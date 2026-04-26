"""
VAULTO - Flask ML Prediction API
Serves trained ML models for real-time attack prediction.
"""

import os
import json
import numpy as np
import pandas as pd
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

# ─── CONFIG ──────────────────────────────────────────────────
BASE_DIR = os.path.dirname(__file__)
MODEL_DIR = os.path.join(BASE_DIR, "models")

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"])

# ─── 20 BASE FEATURE NAMES (original order) ─────────────────
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

SKEWED_FEATURES = [
    "flow_duration", "total_len_fwd_packets", "total_len_bwd_packets",
    "flow_bytes_per_sec", "flow_packets_per_sec", "flow_iat_mean",
    "fwd_iat_mean", "bwd_iat_mean", "fwd_bwd_packet_ratio",
    "bytes_per_packet", "fwd_bwd_len_ratio", "flow_intensity",
    "packet_rate_ratio", "iat_variance", "payload_ratio",
]


def prepare_features(raw_features):
    """Convert 20 raw features into the full 28-feature vector used by models."""
    eps = 1e-6
    df = pd.DataFrame([raw_features], columns=BASE_FEATURES)

    # Derived features
    df["fwd_bwd_packet_ratio"] = df["total_fwd_packets"] / (df["total_bwd_packets"] + eps)
    total_packets = df["total_fwd_packets"] + df["total_bwd_packets"] + eps
    total_bytes = df["total_len_fwd_packets"] + df["total_len_bwd_packets"]
    df["bytes_per_packet"] = total_bytes / total_packets
    df["fwd_bwd_len_ratio"] = df["total_len_fwd_packets"] / (df["total_len_bwd_packets"] + eps)
    df["flag_diversity"] = (
        (df["fwd_psh_flags"] > 0).astype(int) +
        (df["bwd_psh_flags"] > 0).astype(int) +
        (df["fwd_urg_flags"] > 0).astype(int) +
        (df["syn_flag_count"] > 0).astype(int) +
        (df["rst_flag_count"] > 0).astype(int) +
        (df["ack_flag_count"] > 0).astype(int)
    )
    df["flow_intensity"] = df["flow_bytes_per_sec"] / total_packets
    df["packet_rate_ratio"] = df["flow_packets_per_sec"] / (df["bwd_iat_mean"] + eps)
    df["iat_variance"] = np.abs(df["fwd_iat_mean"] - df["bwd_iat_mean"])
    df["payload_ratio"] = total_bytes / (df["flow_duration"] + eps)

    # Log-transform skewed features
    for col in SKEWED_FEATURES:
        if col in df.columns:
            df[col] = np.log1p(df[col])

    df = df.replace([np.inf, -np.inf], 0).fillna(0)
    return df.values


# ─── LOAD MODELS ─────────────────────────────────────────────
print("Loading models...")

scaler = joblib.load(os.path.join(MODEL_DIR, "scaler.joblib"))
feature_names = joblib.load(os.path.join(MODEL_DIR, "feature_names.joblib"))

with open(os.path.join(MODEL_DIR, "labels.json")) as f:
    LABELS = json.load(f)

with open(os.path.join(MODEL_DIR, "metrics.json")) as f:
    MODEL_METRICS = json.load(f)

MODEL_FILES = {
    "Random_Forest": "Random_Forest.joblib",
    "XGBoost": "XGBoost.joblib",
    "SVM": "SVM.joblib",
    "KNN": "KNN.joblib",
    "MLP": "MLP.joblib",
}

models = {}
for name, filename in MODEL_FILES.items():
    path = os.path.join(MODEL_DIR, filename)
    if os.path.exists(path):
        models[name] = joblib.load(path)
        print(f"  Loaded: {name}")
    else:
        print(f"  WARNING: {name} not found at {path}")

print(f"Models loaded: {len(models)}/{len(MODEL_FILES)}")

# ─── SEVERITY MAPPING ───────────────────────────────────────
SEVERITY = {
    "Normal": {"level": "None", "color": "#22c55e", "score": 0},
    "Brute_Force": {"level": "High", "color": "#f97316", "score": 7},
    "Dictionary_Attack": {"level": "High", "color": "#f97316", "score": 7},
    "DoS": {"level": "Critical", "color": "#ef4444", "score": 9},
    "DDoS": {"level": "Critical", "color": "#ef4444", "score": 10},
    "SYN_Flood": {"level": "Critical", "color": "#ef4444", "score": 9},
    "Port_Scan": {"level": "Medium", "color": "#eab308", "score": 5},
    "SQL_Injection": {"level": "Critical", "color": "#ef4444", "score": 9},
    "XSS": {"level": "High", "color": "#f97316", "score": 8},
    "R2L": {"level": "High", "color": "#f97316", "score": 8},
    "Botnet": {"level": "Critical", "color": "#ef4444", "score": 9},
}

RECOMMENDATIONS = {
    "Normal": "No action required. Traffic appears normal.",
    "Brute_Force": "Implement account lockout policies, enable MFA, use CAPTCHA on login forms, monitor failed login attempts.",
    "Dictionary_Attack": "Enforce strong password policies, implement rate limiting, use bcrypt hashing, enable account lockout.",
    "DoS": "Enable rate limiting, configure firewall rules, use CDN with DDoS protection, implement SYN cookies.",
    "DDoS": "Activate DDoS mitigation service, scale infrastructure, implement traffic filtering, contact ISP for upstream filtering.",
    "SYN_Flood": "Enable SYN cookies, configure TCP timeout values, use firewall SYN proxy, implement connection rate limiting.",
    "Port_Scan": "Block source IP, review firewall rules, close unnecessary ports, enable IDS/IPS alerts.",
    "SQL_Injection": "Use parameterized queries, implement input validation, deploy WAF, apply principle of least privilege on DB.",
    "XSS": "Implement Content Security Policy, sanitize user input, encode output, use HTTPOnly cookies.",
    "R2L": "Review access controls, implement network segmentation, enable host-based IDS, audit user privileges.",
    "Botnet": "Isolate infected hosts, block C2 server IPs, update antivirus signatures, conduct network forensics.",
}


# ─── ROUTES ──────────────────────────────────────────────────

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "models_loaded": len(models),
        "available_models": list(models.keys()),
    })


@app.route("/api/features", methods=["GET"])
def get_features():
    return jsonify({
        "features": BASE_FEATURES,
        "count": len(BASE_FEATURES),
        "total_features": len(feature_names),
    })


@app.route("/api/models", methods=["GET"])
def get_models():
    return jsonify({
        "models": list(models.keys()),
        "metrics": MODEL_METRICS,
    })


@app.route("/api/labels", methods=["GET"])
def get_labels():
    return jsonify({
        "labels": LABELS,
        "severity": SEVERITY,
    })


@app.route("/api/predict", methods=["POST"])
def predict():
    """
    Predict attack type from network features.
    Body: { "features": [...20 base values...], "model": "Random_Forest" }
    """
    data = request.get_json()
    
    if not data or "features" not in data:
        return jsonify({"error": "Missing 'features' in request body"}), 400
    
    features = data["features"]
    model_name = data.get("model", "Random_Forest")
    
    if model_name not in models:
        return jsonify({"error": f"Model '{model_name}' not found. Available: {list(models.keys())}"}), 400
    
    if len(features) != len(BASE_FEATURES):
        return jsonify({"error": f"Expected {len(BASE_FEATURES)} features, got {len(features)}"}), 400
    
    try:
        # Compute derived features + log transforms, then scale
        X = prepare_features(features)
        X_scaled = scaler.transform(X)
        
        model = models[model_name]
        prediction = int(model.predict(X_scaled)[0])
        attack_name = LABELS.get(str(prediction), "Unknown")
        
        # Get confidence (probability)
        confidence = 0.0
        if hasattr(model, "predict_proba"):
            proba = model.predict_proba(X_scaled)[0]
            confidence = round(float(max(proba)) * 100, 2)
        
        severity = SEVERITY.get(attack_name, {"level": "Unknown", "color": "#gray", "score": 0})
        recommendation = RECOMMENDATIONS.get(attack_name, "No recommendation available.")
        
        return jsonify({
            "prediction": prediction,
            "attack_name": attack_name,
            "confidence": confidence,
            "severity": severity,
            "recommendation": recommendation,
            "model_used": model_name,
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/predict/all", methods=["POST"])
def predict_all_models():
    """Predict using ALL 5 models for comparison."""
    data = request.get_json()
    
    if not data or "features" not in data:
        return jsonify({"error": "Missing 'features' in request body"}), 400
    
    features = data["features"]
    
    if len(features) != len(BASE_FEATURES):
        return jsonify({"error": f"Expected {len(BASE_FEATURES)} features, got {len(features)}"}), 400
    
    try:
        X = prepare_features(features)
        X_scaled = scaler.transform(X)
        
        results = []
        for name, model in models.items():
            pred = int(model.predict(X_scaled)[0])
            attack_name = LABELS.get(str(pred), "Unknown")
            
            confidence = 0.0
            if hasattr(model, "predict_proba"):
                proba = model.predict_proba(X_scaled)[0]
                confidence = round(float(max(proba)) * 100, 2)
            
            results.append({
                "model": name,
                "prediction": pred,
                "attack_name": attack_name,
                "confidence": confidence,
                "severity": SEVERITY.get(attack_name, {}),
            })
        
        return jsonify({"results": results})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/predict/batch", methods=["POST"])
def predict_batch():
    """Batch prediction from CSV-like data."""
    data = request.get_json()
    
    if not data or "samples" not in data:
        return jsonify({"error": "Missing 'samples' in request body"}), 400
    
    model_name = data.get("model", "Random_Forest")
    if model_name not in models:
        return jsonify({"error": f"Model '{model_name}' not found"}), 400
    
    try:
        samples = np.array(data["samples"])
        X_scaled = scaler.transform(samples)
        
        model = models[model_name]
        predictions = model.predict(X_scaled).tolist()
        
        results = []
        for pred in predictions:
            attack_name = LABELS.get(str(int(pred)), "Unknown")
            results.append({
                "prediction": int(pred),
                "attack_name": attack_name,
                "severity": SEVERITY.get(attack_name, {}),
            })
        
        return jsonify({
            "results": results,
            "total": len(results),
            "model_used": model_name,
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ─── MAIN ────────────────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print("\n" + "=" * 50)
    print("  VAULTO ML Prediction API")
    print(f"  Models: {list(models.keys())}")
    print(f"  Running on: http://0.0.0.0:{port}")
    print("=" * 50 + "\n")
    app.run(host="0.0.0.0", port=port, debug=False)

