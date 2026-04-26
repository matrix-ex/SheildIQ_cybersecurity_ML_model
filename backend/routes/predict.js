const express = require("express");
const axios = require("axios");
const auth = require("../middleware/auth");
const { optionalAuth } = require("../middleware/auth");
const Prediction = require("../models/Prediction");

const router = express.Router();
const ML_API = process.env.ML_API_URL || "http://localhost:5000";

// POST /api/predict - Single prediction
router.post("/", optionalAuth, async (req, res) => {
  try {
    const { features, model } = req.body;

    // Forward to Flask ML API
    const mlResponse = await axios.post(`${ML_API}/api/predict`, {
      features,
      model: model || "Random_Forest",
    });

    const result = mlResponse.data;

    // Save to database only if user is authenticated
    if (req.userId) {
      const prediction = new Prediction({
        user: req.userId,
        features,
        model_used: result.model_used,
        prediction: result.prediction,
        attack_name: result.attack_name,
        confidence: result.confidence,
        severity: result.severity,
        recommendation: result.recommendation,
      });
      await prediction.save();
    }

    res.json(result);
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }
    res.status(500).json({ error: "ML service unavailable: " + err.message });
  }
});

// POST /api/predict/all - Compare all models
router.post("/all", optionalAuth, async (req, res) => {
  try {
    const { features } = req.body;

    const mlResponse = await axios.post(`${ML_API}/api/predict/all`, {
      features,
    });

    res.json(mlResponse.data);
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }
    res.status(500).json({ error: "ML service unavailable: " + err.message });
  }
});

// GET /api/predict/history - Get prediction history
router.get("/history", optionalAuth, async (req, res) => {
  try {
    if (!req.userId) {
      return res.json([]);
    }
    const predictions = await Prediction.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(predictions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/predict/models - Get model info from ML API
router.get("/models", async (req, res) => {
  try {
    const mlResponse = await axios.get(`${ML_API}/api/models`);
    res.json(mlResponse.data);
  } catch (err) {
    res.status(500).json({ error: "ML service unavailable" });
  }
});

// GET /api/predict/features - Get feature names
router.get("/features", async (req, res) => {
  try {
    const mlResponse = await axios.get(`${ML_API}/api/features`);
    res.json(mlResponse.data);
  } catch (err) {
    res.status(500).json({ error: "ML service unavailable" });
  }
});

// GET /api/predict/stats - Dashboard stats
router.get("/stats", optionalAuth, async (req, res) => {
  try {
    if (!req.userId) {
      return res.json({
        totalPredictions: 0,
        totalAttacks: 0,
        attackDistribution: [],
        recentPredictions: [],
      });
    }
    const total = await Prediction.countDocuments({ user: req.userId });
    const attacks = await Prediction.countDocuments({
      user: req.userId,
      attack_name: { $ne: "Normal" },
    });

    const distribution = await Prediction.aggregate([
      { $match: { user: req.userId } },
      { $group: { _id: "$attack_name", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const recent = await Prediction.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      totalPredictions: total,
      totalAttacks: attacks,
      attackDistribution: distribution,
      recentPredictions: recent,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
