# ANNEXURE – I

---

## 1. Database Models and Schemas

The following implementation represents the MongoDB schemas for the VAULTO platform, built using Mongoose ORM for Node.js.

**User.js**

```javascript
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
```

**Alert.js**

```javascript
const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  source_ip: { type: String, required: true, trim: true },
  attack_class: { type: Number, min: 0, max: 10 },
  attack_label: { type: String, trim: true },
  severity: {
    type: String,
    enum: ["none", "medium", "high", "critical"],
    default: "none",
  },
  confidence: { type: Number, min: 0, max: 1 },
  model_used: { type: String, trim: true },
  action: { type: String, trim: true },
  timeout: { type: Number, default: 0 },
  reason: { type: String, default: "" },
  prevention_actions: { type: [String], default: [] },
  status: {
    type: String,
    enum: ["open", "mitigated", "dismissed"],
    default: "open",
  },
  source_url: { type: String, default: "" },
  triggered_by: {
    type: String,
    enum: ["safezone", "manual", "auto", "shield"],
    default: "manual",
  },
  triaged_by: { type: String, default: "" },
  triaged_at: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

alertSchema.index({ status: 1, severity: 1, createdAt: -1 });
alertSchema.index({ source_ip: 1, createdAt: -1 });

module.exports = mongoose.model("Alert", alertSchema);
```

---

## 2. Backend Server and Authentication

The following code shows the Express.js server entry point with WAF middleware integration and JWT-based authentication routes.

**server.js**

```javascript
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const predictRoutes = require("./routes/predict");
const alertRoutes = require("./routes/alerts");
const safezoneRoutes = require("./routes/safezone");
const aiAgentRoutes = require("./routes/ai-agent");
const { wafMiddleware } = require("./middleware/waf");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "10mb" }));

// Active Enforcement Middleware (WAF)
app.use(wafMiddleware);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/predict", predictRoutes);
app.use("/api", alertRoutes);
app.use("/api", safezoneRoutes);
app.use("/api", aiAgentRoutes);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`VAULTO Backend API running on port ${PORT}`);
  });
};

startServer();
```

**auth.js**

```javascript
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: "Email already registered" });

  const user = new User({ name, email, password });
  await user.save();

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
});

module.exports = router;
```

---

## 3. WAF Middleware (Active Enforcement)

The following code implements the Web Application Firewall middleware that actively drops or rate-limits requests from penalized IP addresses.

**waf.js**

```javascript
const activeBlocks = new Map();
const MAX_RATE_LIMIT_REQUESTS = 10;

function applyBlock(ip, action, timeoutSeconds) {
  if (!ip || action === "ALLOW" || action === "FLAG_FOR_REVIEW") return;
  const duration = Number(timeoutSeconds) > 0 ? Number(timeoutSeconds) : 3600;
  const expiresAt = Date.now() + duration * 1000;

  activeBlocks.set(ip, {
    action, expiresAt,
    requestCount: 0, lastRequestAt: Date.now()
  });
}

function wafMiddleware(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const sourceIp = ip ? ip.split(',')[0].trim() : "0.0.0.0";
  const blockRecord = activeBlocks.get(sourceIp);

  if (blockRecord) {
    if (Date.now() > blockRecord.expiresAt) {
      activeBlocks.delete(sourceIp);
      return next();
    }
    if (["DROP_CONNECTION", "QUARANTINE", "BLOCK_AND_LOG"].includes(blockRecord.action)) {
      return res.status(403).json({
        error: "Forbidden. Blocked by active security policy.",
        action: blockRecord.action
      });
    }
    if (blockRecord.action === "RATE_LIMIT") {
      if (Date.now() - blockRecord.lastRequestAt > 60000) {
        blockRecord.requestCount = 0;
        blockRecord.lastRequestAt = Date.now();
      }
      blockRecord.requestCount++;
      if (blockRecord.requestCount > MAX_RATE_LIMIT_REQUESTS) {
        return res.status(429).json({
          error: "Too Many Requests. Rate limit exceeded.",
          action: "RATE_LIMIT"
        });
      }
    }
  }
  next();
}

module.exports = { applyBlock, wafMiddleware };
```

---

## 4. Prevention Engine (Three Strikes Rule)

The following code shows the core prevention engine logic that maps ML predictions to countermeasure actions and implements the Three Strikes escalation rule.

**preventionEngine.js**

```javascript
const ipStrikeMap = new Map();
const STRIKE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const STRIKE_THRESHOLD = 3;

function getPreventionAction(predictionClass, ip, confidence) {
  const classNum = parseInt(predictionClass, 10) || 0;
  const sourceIp = ip || "0.0.0.0";
  const rule = PREVENTION_RULES[classNum] || PREVENTION_RULES[0];

  let { action, severity, prevention_actions, reason, timeout } = rule;

  // Confidence override: below 75% -> escalate to human
  if (confidence < 0.75 && classNum !== 0) {
    action = "FLAG_FOR_REVIEW";
    timeout = 0;
    prevention_actions = [
      "Escalate event to SOC analyst",
      "Collect additional telemetry",
      "Keep source under temporary watchlist",
    ];
    reason = `Confidence ${(confidence * 100).toFixed(1)}%. Flagged for manual review.`;
  }

  // Three Strikes Rule: escalate repeat offenders
  if (["RATE_LIMIT", "FLAG_FOR_REVIEW", "BLOCK_AND_LOG"].includes(action)) {
    const now = Date.now();
    let strikes = (ipStrikeMap.get(sourceIp) || [])
      .filter(s => now - s.timestamp < STRIKE_WINDOW_MS);
    strikes.push({ timestamp: now });
    ipStrikeMap.set(sourceIp, strikes);

    if (strikes.length >= STRIKE_THRESHOLD) {
      action = "DROP_CONNECTION";
      severity = "critical";
      timeout = 7200;
      prevention_actions = [
        "Auto-block IP (Three Strikes Rule)",
        "Connection dropped by Active WAF",
        "Escalated to CRITICAL"
      ];
      reason = `IP triggered ${strikes.length} warnings in 5 min. Auto-escalated.`;
    }
  }

  return {
    attack_class: classNum, attack_label: rule.label,
    action, timeout, severity, prevention_actions, reason,
    ip: sourceIp, confidence
  };
}

module.exports = { getPreventionAction, PREVENTION_RULES };
```

---

## 5. ML Prediction API (Flask Microservice)

The following code shows the Flask-based ML API that loads trained models, computes derived features, and serves prediction results.

**app.py**

```python
import numpy as np, pandas as pd, joblib, json
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

BASE_FEATURES = [
    "flow_duration", "total_fwd_packets", "total_bwd_packets",
    "total_len_fwd_packets", "total_len_bwd_packets",
    "fwd_packet_len_mean", "bwd_packet_len_mean",
    "flow_bytes_per_sec", "flow_packets_per_sec",
    "flow_iat_mean", "fwd_iat_mean", "bwd_iat_mean",
    "fwd_psh_flags", "bwd_psh_flags", "fwd_urg_flags",
    "syn_flag_count", "rst_flag_count", "ack_flag_count",
    "down_up_ratio", "avg_packet_size",
]

def prepare_features(raw_features):
    eps = 1e-6
    df = pd.DataFrame([raw_features], columns=BASE_FEATURES)
    # Derive 8 additional features
    df["fwd_bwd_packet_ratio"] = df["total_fwd_packets"] / (df["total_bwd_packets"] + eps)
    total_packets = df["total_fwd_packets"] + df["total_bwd_packets"] + eps
    total_bytes = df["total_len_fwd_packets"] + df["total_len_bwd_packets"]
    df["bytes_per_packet"] = total_bytes / total_packets
    df["fwd_bwd_len_ratio"] = df["total_len_fwd_packets"] / (df["total_len_bwd_packets"] + eps)
    df["flag_diversity"] = sum(
        (df[f] > 0).astype(int) for f in
        ["fwd_psh_flags","bwd_psh_flags","fwd_urg_flags",
         "syn_flag_count","rst_flag_count","ack_flag_count"]
    )
    df["flow_intensity"] = df["flow_bytes_per_sec"] / total_packets
    df["packet_rate_ratio"] = df["flow_packets_per_sec"] / (df["bwd_iat_mean"] + eps)
    df["iat_variance"] = np.abs(df["fwd_iat_mean"] - df["bwd_iat_mean"])
    df["payload_ratio"] = total_bytes / (df["flow_duration"] + eps)
    # Log-transform skewed features
    for col in SKEWED_FEATURES:
        if col in df.columns:
            df[col] = np.log1p(df[col])
    return df.replace([np.inf, -np.inf], 0).fillna(0).values

# Load all 5 models
scaler = joblib.load("models/scaler.joblib")
models = {name: joblib.load(f"models/{name}.joblib")
           for name in ["Random_Forest","XGBoost","SVM","KNN","MLP"]}

@app.route("/api/predict", methods=["POST"])
def predict():
    data = request.get_json()
    features = data["features"]
    model_name = data.get("model", "Random_Forest")
    X = scaler.transform(prepare_features(features))
    model = models[model_name]
    prediction = int(model.predict(X)[0])
    confidence = round(float(max(model.predict_proba(X)[0])) * 100, 2)
    return jsonify({
        "prediction": prediction,
        "confidence": confidence,
        "model_used": model_name
    })

@app.route("/api/predict/all", methods=["POST"])
def predict_all_models():
    data = request.get_json()
    features = data["features"]
    X = scaler.transform(prepare_features(features))
    results = []
    for name, model in models.items():
        pred = int(model.predict(X)[0])
        confidence = round(float(max(model.predict_proba(X)[0])) * 100, 2)
        results.append({"model": name, "prediction": pred, "confidence": confidence})
    return jsonify({"results": results})
```

---

## 6. Prevention Rules Configuration

The complete prevention rules mapping used by the Prevention Engine for all 11 attack classes.

**preventionEngine.js — PREVENTION_RULES**

```javascript
const PREVENTION_RULES = {
  0: {
    label: "Normal", action: "ALLOW", timeout: 0, severity: "none",
    prevention_actions: ["Passive monitoring only", "No enforcement required"],
    reason: "Traffic behavior is normal. VAULTO continues monitoring.",
  },
  1: {
    label: "Brute Force", action: "RATE_LIMIT", timeout: 1800, severity: "high",
    prevention_actions: [
      "Account lockout after 5 fails", "IP rate limiting (max 10 req/min)",
      "CAPTCHA triggered", "MFA enforcement",
    ],
    reason: "Brute-force behavior detected. Access is rate-limited.",
  },
  3: {
    label: "DoS", action: "DROP_CONNECTION", timeout: 3600, severity: "critical",
    prevention_actions: [
      "Rate limiting per source IP", "Auto-block offending IP",
      "Connection timeout reduction", "Traffic shaping/throttling",
    ],
    reason: "DoS traffic pattern detected. Suspicious flows dropped.",
  },
  4: {
    label: "DDoS", action: "DROP_CONNECTION", timeout: 7200, severity: "critical",
    prevention_actions: [
      "CDN/DDoS mitigation activation", "Traffic scrubbing at edge",
      "Auto-scaling infrastructure", "GeoIP blocking",
    ],
    reason: "Distributed attack detected. Edge mitigation applied.",
  },
  7: {
    label: "SQL Injection", action: "BLOCK_AND_LOG", timeout: 7200, severity: "critical",
    prevention_actions: [
      "Parameterized queries enforced", "WAF rule activation",
      "Input validation (whitelist)", "Error message suppression",
    ],
    reason: "SQL injection detected. Requests blocked and logged.",
  },
  10: {
    label: "Botnet", action: "QUARANTINE", timeout: 86400, severity: "critical",
    prevention_actions: [
      "C2 server IP/domain blocking", "DNS sinkholing",
      "Host isolation/quarantine", "Egress filtering",
    ],
    reason: "Botnet communication detected. Quarantine activated.",
  },
};
```

---
