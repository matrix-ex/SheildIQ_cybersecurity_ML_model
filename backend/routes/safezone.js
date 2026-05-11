const express = require("express");
const axios = require("axios");
const MonitoredSite = require("../models/MonitoredSite");
const Alert = require("../models/Alert");
const { getPreventionAction } = require("../services/preventionEngine");

const router = express.Router();
const FLASK_URL = process.env.FLASK_URL || process.env.ML_API_URL || "http://localhost:5000";

let monitorInterval = null;
let monitorLastRunAt = null;

const KNOWN_DOMAINS = [
  "google.com",
  "microsoft.com",
  "github.com",
  "amazon.com",
  "apple.com",
  "cloudflare.com",
  "openai.com",
  "vercel.app",
  "render.com",
  "vaulto.vercel.app",
];

function safeNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function normalizeFlaskPrediction(payload = {}) {
  const prediction = Number.isFinite(Number(payload.prediction))
    ? Number(payload.prediction)
    : 0;
  const predictionLabel = payload.prediction_label || payload.attack_name || "Normal";
  const rawConfidence = Number(payload.confidence || 0);
  const confidence = rawConfidence > 1 ? rawConfidence / 100 : rawConfidence;

  return {
    prediction,
    prediction_label: predictionLabel,
    confidence,
    confidence_percent: (confidence * 100).toFixed(1),
    model_used: payload.model_used || "XGBoost",
    all_models_results: payload.all_models_results || null,
    severity: payload.severity || null,
  };
}

async function callFlaskPredict(features, model = "XGBoost") {
  const candidates = ["/predict", "/api/predict"];

  for (const path of candidates) {
    try {
      const resp = await axios.post(
        `${FLASK_URL}${path}`,
        { features, model },
        { timeout: 10000 }
      );
      return normalizeFlaskPrediction(resp.data);
    } catch (err) {
      if (path === candidates[candidates.length - 1]) {
        throw err;
      }
    }
  }

  throw new Error("ML prediction unavailable");
}

function getUrlPatternFeatures(urlValue) {
  const parsed = new URL(urlValue);
  const host = parsed.hostname.toLowerCase();
  const path = parsed.pathname.toLowerCase();
  const query = parsed.search.toLowerCase();

  const baseNormal = [
    62000, 8, 7, 5500, 4100, 690, 585, 1600, 52, 12000, 11800, 2100, 0, 0,
    0, 1, 2, 6, 350, 820,
  ];

  const bruteForceProfile = [
    1800, 220, 30, 12400, 1700, 58, 34, 6800, 390, 21, 80, 170, 0, 0, 0, 12,
    3, 8, 70, 140,
  ];

  const sqliProfile = [
    1450, 120, 26, 9200, 1200, 77, 45, 7200, 230, 18, 62, 149, 0, 0, 0, 7, 2,
    6, 60, 110,
  ];

  const portScanProfile = [
    380, 55, 68, 3200, 3300, 61, 52, 17200, 480, 9, 11, 13, 0, 0, 0, 4, 1, 2,
    33, 65,
  ];

  const synFloodProfile = [
    800, 500, 35, 15000, 1300, 50, 34, 26000, 900, 5, 18, 21, 0, 0, 0, 35, 4,
    10, 40, 70,
  ];

  const threatsFound = [];
  const recommendations = [];

  let features = [...baseNormal];
  let profile = "normal";

  if (path.includes("/login") || path.includes("/admin")) {
    features = [...bruteForceProfile];
    profile = "bruteforce";
    threatsFound.push("High-frequency authentication surface detected");
    recommendations.push("Enable account lockout and MFA on authentication routes");
  }

  if (query.includes("?id=") || query.includes("?q=") || query.includes("select") || query.includes("union")) {
    features = [...sqliProfile];
    profile = "sqli";
    threatsFound.push("Query-parameter pattern resembles SQL injection probing");
    recommendations.push("Enforce parameterized queries and strict input validation");
  }

  const isKnownDomain = KNOWN_DOMAINS.some((domain) => host === domain || host.endsWith(`.${domain}`));
  if (!isKnownDomain) {
    features = [...portScanProfile];
    profile = "portscan";
    threatsFound.push("Unknown domain footprint raises reconnaissance risk");
    recommendations.push("Apply network segmentation and monitor source port behavior");
  }

  if (path.includes("/api") && query.includes("token=") && !isKnownDomain) {
    features = [...synFloodProfile];
    profile = "synflood";
    threatsFound.push("API token endpoint on unknown host may attract flood attempts");
    recommendations.push("Enable SYN cookies and aggressive request throttling");
  }

  recommendations.push("Keep WAF, TLS, and logging policies enabled for this endpoint");

  return {
    features,
    profile,
    threatsFound: Array.from(new Set(threatsFound)),
    recommendations: Array.from(new Set(recommendations)),
  };
}

function getRiskLevel(score) {
  if (score >= 75) {
    return "HIGH";
  }
  if (score >= 45) {
    return "MEDIUM";
  }
  return "LOW";
}

function toThreatSummary(prediction, prevention, seedThreats) {
  const list = [...seedThreats];

  if ((prediction.prediction_label || "").toLowerCase() !== "normal") {
    list.push(`Predicted ${prediction.prediction_label} with ${prediction.confidence_percent}% confidence`);
  }

  if (prevention.action !== "ALLOW") {
    list.push(`Automated policy action: ${prevention.action}`);
  }

  return Array.from(new Set(list));
}

async function analyzeSafezoneUrl(urlValue, context = {}) {
  const { sourceIp = "0.0.0.0", triggeredBy = "safezone", io = null } = context;
  const pattern = getUrlPatternFeatures(urlValue);

  let prediction;
  try {
    prediction = await callFlaskPredict(pattern.features, "XGBoost");
  } catch (err) {
    prediction = {
      prediction: 0,
      prediction_label: "Normal",
      confidence: 0,
      confidence_percent: "0.0",
      model_used: "XGBoost",
      all_models_results: null,
      severity: null,
    };
  }

  const prevention = getPreventionAction(
    prediction.prediction,
    sourceIp,
    prediction.confidence
  );

  const confidenceScore = Math.round(safeNumber(prediction.confidence, 0) * 100);
  const actionRisk = {
    ALLOW: 5,
    RATE_LIMIT: 45,
    BLOCK_AND_LOG: 68,
    DROP_CONNECTION: 80,
    QUARANTINE: 90,
    FLAG_FOR_REVIEW: 35,
  };

  const riskScore = Math.max(
    0,
    Math.min(100, Math.round((confidenceScore * 0.65) + (actionRisk[prevention.action] || 0) * 0.35))
  );

  const riskLevel = getRiskLevel(riskScore);
  const threatSummary = toThreatSummary(prediction, prevention, pattern.threatsFound);
  const safe = prevention.action === "ALLOW";

  const monitoredSite = await MonitoredSite.findOneAndUpdate(
    { url: urlValue.toLowerCase() },
    {
      $set: {
        url: urlValue.toLowerCase(),
        status: "active",
        last_checked: new Date(),
        last_threat: safe ? "" : prediction.prediction_label,
      },
      $inc: {
        total_scans: 1,
        total_threats: safe ? 0 : 1,
      },
      $setOnInsert: {
        label: new URL(urlValue).hostname,
        addedAt: new Date(),
      },
    },
    {
      upsert: true,
      new: true,
    }
  );

  let alertId = null;
  if (!safe) {
    const alert = await Alert.create({
      source_ip: sourceIp,
      attack_class: prediction.prediction,
      attack_label: prediction.prediction_label,
      severity: prevention.severity,
      confidence: prediction.confidence,
      model_used: prediction.model_used,
      action: prevention.action,
      timeout: prevention.timeout,
      reason: prevention.reason,
      prevention_actions: prevention.prevention_actions,
      status: "open",
      source_url: urlValue,
      triggered_by: triggeredBy,
    });

    alertId = alert._id;

    if (io && typeof io.emit === "function") {
      io.emit("safezone:threat", {
        alert_id: String(alert._id),
        url: urlValue,
        attack_label: prediction.prediction_label,
        severity: prevention.severity,
        action: prevention.action,
        risk_score: riskScore,
      });
    }
  }

  return {
    url: urlValue,
    risk_score: riskScore,
    risk_level: riskLevel,
    prediction,
    prevention,
    threats_found: threatSummary,
    recommendations: pattern.recommendations,
    safe,
    monitored_site: monitoredSite,
    alert_id: alertId,
  };
}

router.post("/safezone/analyze", async (req, res) => {
  try {
    const { url } = req.body || {};
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Body must include url" });
    }

    let normalizedUrl;
    try {
      const raw = url.trim();
      const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
      normalizedUrl = new URL(withProtocol).toString();
    } catch (err) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    const report = await analyzeSafezoneUrl(normalizedUrl, {
      sourceIp: req.ip || "0.0.0.0",
      triggeredBy: "safezone",
      io: req.app.get("io") || null,
    });

    return res.json(report);
  } catch (err) {
    return res.status(500).json({
      error: `Safe Zone analysis failed: ${err.message}`,
    });
  }
});

router.get("/safezone/sites", async (req, res) => {
  try {
    const sites = await MonitoredSite.find({}).sort({ addedAt: -1 });
    return res.json(sites);
  } catch (err) {
    return res.status(500).json({
      error: `Failed to fetch monitored sites: ${err.message}`,
    });
  }
});

router.delete("/safezone/sites/:id", async (req, res) => {
  try {
    const deleted = await MonitoredSite.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Site not found" });
    }

    return res.json({ success: true, id: deleted._id });
  } catch (err) {
    return res.status(500).json({
      error: `Failed to remove site: ${err.message}`,
    });
  }
});

router.post("/safezone/monitor/start", async (req, res) => {
  try {
    if (monitorInterval) {
      return res.json({
        running: true,
        interval_ms: 30000,
        message: "Safe Zone monitor already running",
        last_checked: monitorLastRunAt,
      });
    }

    monitorInterval = setInterval(async () => {
      try {
        const activeSites = await MonitoredSite.find({ status: "active" });
        const io = req.app.get("io") || null;

        for (const site of activeSites) {
          await analyzeSafezoneUrl(site.url, {
            sourceIp: "0.0.0.0",
            triggeredBy: "auto",
            io,
          });
        }

        monitorLastRunAt = new Date().toISOString();
      } catch (err) {
        console.error("[SafeZone Monitor] Loop failed:", err.message);
      }
    }, 30000);

    return res.json({
      running: true,
      interval_ms: 30000,
      message: "Safe Zone monitor started",
      last_checked: monitorLastRunAt,
    });
  } catch (err) {
    return res.status(500).json({
      error: `Failed to start monitor: ${err.message}`,
    });
  }
});

router.post("/safezone/monitor/stop", async (req, res) => {
  try {
    if (monitorInterval) {
      clearInterval(monitorInterval);
      monitorInterval = null;
    }

    return res.json({
      running: false,
      message: "Safe Zone monitor stopped",
      last_checked: monitorLastRunAt,
    });
  } catch (err) {
    return res.status(500).json({
      error: `Failed to stop monitor: ${err.message}`,
    });
  }
});

module.exports = router;
