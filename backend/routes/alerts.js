const express = require("express");
const axios = require("axios");
const Alert = require("../models/Alert");
const { getPreventionAction } = require("../services/preventionEngine");

const router = express.Router();
const FLASK_URL = process.env.FLASK_URL || process.env.ML_API_URL || "http://localhost:5000";

// ─── POST /api/analyze ──────────────────────────────────────
// Full pipeline: Features → Flask ML → Prevention Engine → Alert
router.post("/analyze", async (req, res) => {
  try {
    const { features, ip, model } = req.body;

    if (!features || !Array.isArray(features) || features.length !== 20) {
      return res.status(400).json({
        error: "Expected 'features' array with exactly 20 numbers.",
      });
    }

    const sourceIp = ip || "0.0.0.0";
    const modelName = model || "XGBoost";

    // Step 1: Call Flask ML API
    let prediction;
    try {
      const mlResponse = await axios.post(`${FLASK_URL}/api/predict`, {
        features,
        model: modelName,
      }, { timeout: 10000 });
      prediction = mlResponse.data;
    } catch (mlError) {
      // Flask is down → fail-open (ALLOW)
      console.warn(`[VAULTO] Flask ML unreachable: ${mlError.message}`);
      return res.json({
        prediction: {
          prediction: 0,
          attack_name: "Unknown",
          confidence: 0,
          model_used: modelName,
          severity: { level: "None", score: 0 },
        },
        prevention: {
          action: "ALLOW",
          timeout: 0,
          severity: "none",
          reason: "ML service unavailable — defaulting to ALLOW.",
          ip: sourceIp,
        },
        alert_id: null,
        timestamp: new Date().toISOString(),
        error: "ML service unavailable",
      });
    }

    // Step 2: Run Prevention Engine
    const confidence = (prediction.confidence || 0) / 100; // Flask returns 0-100, engine expects 0-1
    const prevention = getPreventionAction(
      prediction.prediction,
      sourceIp,
      confidence
    );

    // Step 3: Save alert if action is not ALLOW
    let alertId = null;
    if (prevention.action !== "ALLOW") {
      const alert = new Alert({
        ip: sourceIp,
        attack_class: prediction.prediction,
        attack_label: prediction.attack_name,
        action: prevention.action,
        timeout: prevention.timeout,
        reason: prevention.reason,
        severity: prevention.severity,
        confidence: confidence,
        model_used: prediction.model_used || modelName,
        status: "open",
      });
      const saved = await alert.save();
      alertId = saved._id;
    }

    // Step 4: Return everything
    res.json({
      prediction,
      prevention,
      alert_id: alertId,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[VAULTO] /api/analyze error:", err.message);
    res.status(500).json({ error: "Analysis failed: " + err.message });
  }
});

// ─── GET /api/alerts ────────────────────────────────────────
// List alerts with optional filters
router.get("/alerts", async (req, res) => {
  try {
    const { status, severity, limit } = req.query;
    const filter = {};

    if (status && status !== "all") filter.status = status;
    if (severity && severity !== "all") filter.severity = severity;

    const maxLimit = Math.min(parseInt(limit) || 50, 200);

    const alerts = await Alert.find(filter)
      .sort({ createdAt: -1 })
      .limit(maxLimit);

    res.json(alerts);
  } catch (err) {
    console.error("[VAULTO] /api/alerts error:", err.message);
    res.status(500).json({ error: "Failed to fetch alerts: " + err.message });
  }
});

// ─── GET /api/alerts/stats ──────────────────────────────────
// Dashboard statistics
router.get("/alerts/stats", async (req, res) => {
  try {
    const total = await Alert.countDocuments();
    const open = await Alert.countDocuments({ status: "open" });
    const mitigated = await Alert.countDocuments({ status: "mitigated" });
    const dismissed = await Alert.countDocuments({ status: "dismissed" });

    // By severity
    const critical = await Alert.countDocuments({ severity: "critical" });
    const high = await Alert.countDocuments({ severity: "high" });
    const medium = await Alert.countDocuments({ severity: "medium" });
    const none = await Alert.countDocuments({ severity: "none" });

    // By action
    const actionAgg = await Alert.aggregate([
      { $group: { _id: "$action", count: { $sum: 1 } } },
    ]);
    const by_action = {};
    actionAgg.forEach((a) => { by_action[a._id] = a.count; });

    // Threats in last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const threats_last_24h = await Alert.countDocuments({
      createdAt: { $gte: oneDayAgo },
    });

    res.json({
      total,
      open,
      mitigated,
      dismissed,
      by_severity: { critical, high, medium, none },
      by_action,
      threats_last_24h,
    });
  } catch (err) {
    console.error("[VAULTO] /api/alerts/stats error:", err.message);
    res.status(500).json({ error: "Failed to fetch stats: " + err.message });
  }
});

// ─── PATCH /api/alerts/:id/triage ───────────────────────────
// Update alert status (mitigate or dismiss)
router.patch("/alerts/:id/triage", async (req, res) => {
  try {
    const { status, triaged_by } = req.body;

    if (!status || !["mitigated", "dismissed"].includes(status)) {
      return res.status(400).json({
        error: "Status must be 'mitigated' or 'dismissed'.",
      });
    }

    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      {
        status,
        triaged_by: triaged_by || "admin",
        triaged_at: new Date(),
      },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ error: "Alert not found." });
    }

    res.json(alert);
  } catch (err) {
    console.error("[VAULTO] /api/alerts/:id/triage error:", err.message);
    res.status(500).json({ error: "Triage failed: " + err.message });
  }
});

// ─── DELETE /api/alerts/:id ─────────────────────────────────
// Hard delete for demo reset
router.delete("/alerts/:id", async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    if (!alert) {
      return res.status(404).json({ error: "Alert not found." });
    }
    res.json({ message: "Alert deleted.", id: req.params.id });
  } catch (err) {
    console.error("[VAULTO] DELETE /api/alerts/:id error:", err.message);
    res.status(500).json({ error: "Delete failed: " + err.message });
  }
});

module.exports = router;
