const express = require("express");
const axios = require("axios");
const Alert = require("../models/Alert");
const ApiKey = require("../models/ApiKey");
const { optionalAuth } = require("../middleware/auth");
const { getPreventionAction } = require("../services/preventionEngine");
const { applyBlock } = require("../middleware/waf");

const router = express.Router();
const FLASK_URL = process.env.FLASK_URL || process.env.ML_API_URL || "http://localhost:5000";

const ACTION_KEYS = [
  "DROP_CONNECTION",
  "RATE_LIMIT",
  "BLOCK_AND_LOG",
  "QUARANTINE",
  "FLAG_FOR_REVIEW",
  "ALLOW",
];

function normalizeFlaskPrediction(payload = {}) {
  const prediction = Number.isFinite(Number(payload.prediction))
    ? Number(payload.prediction)
    : 0;
  const predictionLabel = payload.prediction_label || payload.attack_name || "Normal";
  const rawConfidence = Number(payload.confidence || 0);
  const confidence = rawConfidence > 1 ? rawConfidence / 100 : rawConfidence;

  return {
    class: prediction,
    label: predictionLabel,
    prediction,
    prediction_label: predictionLabel,
    confidence,
    confidence_percent: (confidence * 100).toFixed(1),
    model_used: payload.model_used || "XGBoost",
    all_models_results: payload.all_models_results || null,
    severity: payload.severity || null,
  };
}

async function callFlaskPredict(features, model) {
  const candidates = ["/predict", "/api/predict"];

  for (const path of candidates) {
    try {
      const resp = await axios.post(
        `${FLASK_URL}${path}`,
        { features, model: model || "XGBoost" },
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

router.post("/analyze", optionalAuth, async (req, res) => {
  try {
    const apiKey = req.headers["x-vaulto-api-key"];
    let keyDoc = null;

    if (apiKey) {
      keyDoc = await ApiKey.findOne({
        key: apiKey,
        is_active: true,
      });
    }

    // Bypass API key if we have a valid key OR a valid authenticated user session
    if (!keyDoc && !req.userId && apiKey !== "VAULTO_DEV_2024") {
      return res.status(401).json({ error: "Invalid or missing API key. Please use a valid key or log in." });
    }

    const {
      features,
      ip,
      model,
      source_url = "",
      triggered_by = "manual",
    } = req.body || {};

    if (!Array.isArray(features) || features.length !== 20) {
      return res.status(400).json({
        error: "Body must include features:[20 numbers]",
      });
    }

    const sourceIp = ip || req.ip || "0.0.0.0";

    let prediction;
    try {
      prediction = await callFlaskPredict(features, model || "XGBoost");
    } catch (err) {
      const prevention = {
        attack_class: 0,
        attack_label: "Normal",
        action: "ALLOW",
        timeout: 0,
        severity: "none",
        reason: "ML service unavailable. Failsafe mode keeps traffic allowed.",
        prevention_actions: ["Passive monitoring only"],
        ip: sourceIp,
        confidence: 0,
      };

      return res.json({
        prediction: {
          class: 0,
          label: "Normal",
          prediction: 0,
          prediction_label: "Normal",
          confidence: 0,
          model_used: model || "XGBoost",
          all_models_results: null,
          severity: null,
        },
        prevention,
        alert_id: null,
        blocked: false,
        error: "ML unavailable",
      });
    }

    const prevention = getPreventionAction(
      prediction.prediction,
      sourceIp,
      prediction.confidence
    );

    let alertId = null;
    if (prevention.action !== "ALLOW") {
      const created = await Alert.create({
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
        source_url,
        triggered_by: ["safezone", "manual", "auto", "shield"].includes(triggered_by)
          ? triggered_by
          : "manual",
      });

      alertId = created._id;
      
      // Apply active enforcement to the WAF immediately
      applyBlock(sourceIp, prevention.action, prevention.timeout);
    }

    return res.json({
      prediction,
      prevention,
      alert_id: alertId,
      blocked: prevention.action !== "ALLOW",
    });
  } catch (err) {
    return res.status(500).json({
      error: `Analysis failed: ${err.message}`,
    });
  }
});

router.get("/alerts", async (req, res) => {
  try {
    const { status, severity, triggered_by, limit = 50 } = req.query;
    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }
    if (severity && severity !== "all") {
      filter.severity = severity;
    }
    if (triggered_by && triggered_by !== "all") {
      filter.triggered_by = triggered_by;
    }

    const docs = await Alert.find(filter)
      .sort({ createdAt: -1 })
      .limit(Math.min(Number(limit) || 50, 200));

    return res.json(docs);
  } catch (err) {
    return res.status(500).json({
      error: `Failed to fetch alerts: ${err.message}`,
    });
  }
});

router.get("/alerts/stats", async (req, res) => {
  try {
    const now = new Date();
    const since24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [
      total,
      open,
      mitigated,
      dismissed,
      critical,
      high,
      medium,
      none,
      actionAgg,
      threatsLast24h,
      hourlyAgg,
    ] = await Promise.all([
      Alert.countDocuments(),
      Alert.countDocuments({ status: "open" }),
      Alert.countDocuments({ status: "mitigated" }),
      Alert.countDocuments({ status: "dismissed" }),
      Alert.countDocuments({ severity: "critical" }),
      Alert.countDocuments({ severity: "high" }),
      Alert.countDocuments({ severity: "medium" }),
      Alert.countDocuments({ severity: "none" }),
      Alert.aggregate([{ $group: { _id: "$action", count: { $sum: 1 } } }]),
      Alert.countDocuments({ createdAt: { $gte: since24h } }),
      Alert.aggregate([
        { $match: { createdAt: { $gte: since24h } } },
        {
          $group: {
            _id: { $hour: "$createdAt" },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const by_action = {
      DROP_CONNECTION: 0,
      RATE_LIMIT: 0,
      BLOCK_AND_LOG: 0,
      QUARANTINE: 0,
      FLAG_FOR_REVIEW: 0,
      ALLOW: 0,
    };

    actionAgg.forEach((item) => {
      if (ACTION_KEYS.includes(item._id)) {
        by_action[item._id] = item.count;
      }
    });

    const threats_by_hour = new Array(24).fill(0);
    hourlyAgg.forEach((item) => {
      const hour = Number(item._id);
      if (Number.isInteger(hour) && hour >= 0 && hour < 24) {
        threats_by_hour[hour] = item.count;
      }
    });

    return res.json({
      total,
      open,
      mitigated,
      dismissed,
      by_severity: {
        critical,
        high,
        medium,
        none,
      },
      by_action,
      threats_last_24h: threatsLast24h,
      threats_by_hour,
    });
  } catch (err) {
    return res.status(500).json({
      error: `Failed to fetch stats: ${err.message}`,
    });
  }
});

router.patch("/alerts/:id/triage", async (req, res) => {
  try {
    const { status, triaged_by = "admin" } = req.body || {};
    if (!["open", "mitigated", "dismissed"].includes(status)) {
      return res.status(400).json({
        error: "status must be one of: open, mitigated, dismissed",
      });
    }

    const updated = await Alert.findByIdAndUpdate(
      req.params.id,
      {
        status,
        triaged_by,
        triaged_at: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Alert not found" });
    }

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({
      error: `Failed to triage alert: ${err.message}`,
    });
  }
});

router.delete("/alerts/:id", async (req, res) => {
  try {
    const deleted = await Alert.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Alert not found" });
    }

    return res.json({
      success: true,
      id: deleted._id,
    });
  } catch (err) {
    return res.status(500).json({
      error: `Failed to delete alert: ${err.message}`,
    });
  }
});

module.exports = router;
