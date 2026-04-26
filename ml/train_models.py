"""
VAULTO - Model Training Pipeline (v2 - High Accuracy)
Trains 5 ML models on the generated dataset:
  1. Random Forest   (800 trees, trained in batches of 100)
  2. XGBoost         (800 boosting rounds with per-round logging)
  3. SVM             (LinearSVC with calibration)
  4. KNN             (k=5, distance-weighted)
  5. MLP             (512-256-128, up to 300 epochs)
"""

import os
import sys
import json
import time
import warnings
import numpy as np
import pandas as pd
import joblib

warnings.filterwarnings('ignore', category=UserWarning, module='sklearn')
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, confusion_matrix
)
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.neighbors import KNeighborsClassifier
from sklearn.neural_network import MLPClassifier
from xgboost import XGBClassifier
import xgboost as xgb

try:
    from imblearn.over_sampling import SMOTE
    HAS_SMOTE = True
except ImportError:
    HAS_SMOTE = False

# ─── PATHS ──────────────────────────────────────────────────
BASE_DIR = os.path.dirname(__file__)
DATA_PATH = os.path.join(BASE_DIR, "data", "vaulto_dataset.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODEL_DIR, exist_ok=True)

LABELS = {
    0: "Normal", 1: "Brute_Force", 2: "Dictionary_Attack",
    3: "DoS", 4: "DDoS", 5: "SYN_Flood",
    6: "Port_Scan", 7: "SQL_Injection", 8: "XSS",
    9: "R2L", 10: "Botnet",
}


# ─── HELPERS ────────────────────────────────────────────────
def fmt_time(secs):
    """Format seconds into mm:ss or hh:mm:ss."""
    if secs < 0:
        return "00:00"
    m, s = divmod(int(secs), 60)
    h, m = divmod(m, 60)
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m:02d}:{s:02d}"


def progress_bar(current, total, width=30):
    """Return a text progress bar."""
    pct = current / total if total > 0 else 1
    filled = int(width * pct)
    bar = "█" * filled + "░" * (width - filled)
    return f"[{bar}] {pct*100:5.1f}%"


def print_progress(epoch, total, elapsed, model_name, extra=""):
    """Print a single progress line with ETA."""
    remaining = (elapsed / epoch * (total - epoch)) if epoch > 0 else 0
    left = total - epoch
    bar = progress_bar(epoch, total)
    line = (
        f"\r  {model_name:<16s} Epoch {epoch:>4d}/{total} {bar} "
        f"| Elapsed: {fmt_time(elapsed)} | ETA: {fmt_time(remaining)} "
        f"| Left: {left:>4d} {extra}"
    )
    sys.stdout.write(line)
    sys.stdout.flush()


# ─── FEATURE ENGINEERING ────────────────────────────────────
def add_derived_features(df):
    """Add the same 8 derived features used during dataset generation."""
    eps = 1e-6

    df["fwd_bwd_packet_ratio"] = (
        df["total_fwd_packets"] / (df["total_bwd_packets"] + eps)
    )

    total_packets = df["total_fwd_packets"] + df["total_bwd_packets"] + eps
    total_bytes = df["total_len_fwd_packets"] + df["total_len_bwd_packets"]
    df["bytes_per_packet"] = total_bytes / total_packets

    df["fwd_bwd_len_ratio"] = (
        df["total_len_fwd_packets"] / (df["total_len_bwd_packets"] + eps)
    )

    df["flag_diversity"] = (
        (df["fwd_psh_flags"] > 0).astype(int) +
        (df["bwd_psh_flags"] > 0).astype(int) +
        (df["fwd_urg_flags"] > 0).astype(int) +
        (df["syn_flag_count"] > 0).astype(int) +
        (df["rst_flag_count"] > 0).astype(int) +
        (df["ack_flag_count"] > 0).astype(int)
    )

    df["flow_intensity"] = df["flow_bytes_per_sec"] / total_packets

    df["packet_rate_ratio"] = (
        df["flow_packets_per_sec"] / (df["bwd_iat_mean"] + eps)
    )

    df["iat_variance"] = np.abs(df["fwd_iat_mean"] - df["bwd_iat_mean"])

    df["payload_ratio"] = total_bytes / (df["flow_duration"] + eps)

    return df


# ─── DATA LOADING ───────────────────────────────────────────
def load_and_preprocess():
    """Load dataset, add features, preprocess, split into train/test."""
    print("\n[1/4] Loading dataset...")
    df = pd.read_csv(DATA_PATH)

    if "label_name" in df.columns:
        df = df.drop("label_name", axis=1)

    df = df.replace([np.inf, -np.inf], np.nan).fillna(0)

    # Ensure derived features exist (compute if missing)
    derived_cols = [
        "fwd_bwd_packet_ratio", "bytes_per_packet", "fwd_bwd_len_ratio",
        "flag_diversity", "flow_intensity", "packet_rate_ratio",
        "iat_variance", "payload_ratio"
    ]
    if not all(col in df.columns for col in derived_cols):
        print("  Computing derived features...")
        df = add_derived_features(df)
        df = df.replace([np.inf, -np.inf], np.nan).fillna(0)

    X = df.drop("label", axis=1)
    y = df["label"].astype(int)
    feature_names = list(X.columns)

    # Log-transform skewed features for better normalization
    skewed_features = [
        "flow_duration", "total_len_fwd_packets", "total_len_bwd_packets",
        "flow_bytes_per_sec", "flow_packets_per_sec", "flow_iat_mean",
        "fwd_iat_mean", "bwd_iat_mean", "fwd_bwd_packet_ratio",
        "bytes_per_packet", "fwd_bwd_len_ratio", "flow_intensity",
        "packet_rate_ratio", "iat_variance", "payload_ratio"
    ]
    for col in skewed_features:
        if col in X.columns:
            X[col] = np.log1p(X[col])

    print(f"  Dataset shape: {df.shape}")
    print(f"  Features: {X.shape[1]}")
    print(f"  Classes:  {y.nunique()}")

    print("\n[2/4] Splitting data (80% train, 20% test)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print("[3/4] Normalizing features (StandardScaler)...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    joblib.dump(scaler, os.path.join(MODEL_DIR, "scaler.joblib"))
    joblib.dump(feature_names, os.path.join(MODEL_DIR, "feature_names.joblib"))

    if HAS_SMOTE:
        print("  Applying SMOTE oversampling for minority classes...")
        min_class_count = min(np.bincount(y_train))
        k_neighbors = min(5, min_class_count - 1) if min_class_count > 1 else 1
        smote = SMOTE(random_state=42, k_neighbors=k_neighbors)
        X_train_scaled, y_train = smote.fit_resample(X_train_scaled, y_train)
        print(f"  After SMOTE: {X_train_scaled.shape[0]:,} samples")
    else:
        print("  [!] imbalanced-learn not installed, skipping SMOTE")

    print(f"  Train set: {X_train_scaled.shape[0]:,} samples")
    print(f"  Test set:  {X_test_scaled.shape[0]:,} samples")

    return X_train_scaled, X_test_scaled, y_train, y_test, feature_names


# ─── EVALUATION ─────────────────────────────────────────────
def evaluate_model(model, X_test, y_test, model_name):
    """Evaluate a trained model and return metrics."""
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, average="weighted", zero_division=0)
    rec = recall_score(y_test, y_pred, average="weighted", zero_division=0)
    f1 = f1_score(y_test, y_pred, average="weighted", zero_division=0)
    cm = confusion_matrix(y_test, y_pred).tolist()

    metrics = {
        "model_name": model_name,
        "accuracy": round(acc * 100, 2),
        "precision": round(prec * 100, 2),
        "recall": round(rec * 100, 2),
        "f1_score": round(f1 * 100, 2),
        "confusion_matrix": cm,
    }

    print(f"\n  ┌{'─' * 42}┐")
    print(f"  │  {model_name} Results{' ' * (30 - len(model_name))}│")
    print(f"  ├{'─' * 42}┤")
    print(f"  │    Accuracy:  {metrics['accuracy']:>7.2f}%{' ' * 19}│")
    print(f"  │    Precision: {metrics['precision']:>7.2f}%{' ' * 19}│")
    print(f"  │    Recall:    {metrics['recall']:>7.2f}%{' ' * 19}│")
    print(f"  │    F1-Score:  {metrics['f1_score']:>7.2f}%{' ' * 19}│")
    print(f"  └{'─' * 42}┘")

    return metrics


# ─── INDIVIDUAL MODEL TRAINERS WITH PROGRESS ────────────────

def train_random_forest(X_train, y_train):
    """Train Random Forest in batches, showing progress per batch of trees."""
    total_trees = 800
    batch_size = 100
    n_batches = total_trees // batch_size
    model_name = "Random_Forest"

    print(f"\n  {'═' * 56}")
    print(f"  [1/5] Training {model_name}  ({total_trees} trees, batch={batch_size})")
    print(f"  {'═' * 56}")

    model = RandomForestClassifier(
        n_estimators=batch_size,
        max_depth=50,
        min_samples_split=2,
        min_samples_leaf=1,
        max_features='sqrt',
        class_weight='balanced',
        random_state=42,
        n_jobs=-1,
        warm_start=True,
    )

    start = time.time()
    for batch in range(1, n_batches + 1):
        model.n_estimators = batch * batch_size
        model.fit(X_train, y_train)
        elapsed = time.time() - start
        print_progress(batch, n_batches, elapsed, model_name,
                       f"| Trees: {batch * batch_size}/{total_trees}")

    elapsed = time.time() - start
    print(f"\n  ✓ Done in {fmt_time(elapsed)} ({elapsed:.1f}s)")
    return model, elapsed


def train_xgboost(X_train, y_train):
    """Train XGBoost with per-round callback progress."""
    total_rounds = 800
    model_name = "XGBoost"

    print(f"\n  {'═' * 56}")
    print(f"  [2/5] Training {model_name}  ({total_rounds} boosting rounds)")
    print(f"  {'═' * 56}")

    class ProgressCallback(xgb.callback.TrainingCallback):
        """XGBoost callback that prints epoch progress."""
        def __init__(self):
            self.start = time.time()

        def after_iteration(self, model, epoch, evals_log):
            if (epoch + 1) % 10 == 0 or epoch == 0:
                elapsed = time.time() - self.start
                extra = ""
                if evals_log and 'train' in evals_log:
                    for metric_name, vals in evals_log['train'].items():
                        extra = f"| {metric_name}: {vals[-1]:.4f}"
                print_progress(epoch + 1, total_rounds, elapsed, model_name, extra)
            return False

    model = XGBClassifier(
        n_estimators=total_rounds,
        max_depth=15,
        learning_rate=0.05,
        subsample=0.85,
        colsample_bytree=0.85,
        reg_alpha=0.1,
        reg_lambda=1.0,
        min_child_weight=3,
        gamma=0.1,
        random_state=42,
        eval_metric="mlogloss",
        n_jobs=-1,
        verbosity=0,
        callbacks=[ProgressCallback()],
    )

    start = time.time()
    model.fit(X_train, y_train, eval_set=[(X_train, y_train)], verbose=False)
    elapsed = time.time() - start
    print(f"\n  ✓ Done in {fmt_time(elapsed)} ({elapsed:.1f}s)")

    # Remove callback so model can be pickled
    model.set_params(callbacks=None)

    return model, elapsed


def train_svm(X_train, y_train):
    """Train LinearSVC with calibration for probability support."""
    total_iters = 5000
    model_name = "SVM"

    print(f"\n  {'═' * 56}")
    print(f"  [3/5] Training {model_name}  (LinearSVC, max_iter={total_iters})")
    print(f"  {'═' * 56}")

    base_svm = LinearSVC(
        C=1.0,
        class_weight='balanced',
        random_state=42,
        max_iter=total_iters,
        dual='auto',
    )

    start = time.time()
    print(f"  Training LinearSVC on {X_train.shape[0]:,} samples...")
    base_svm.fit(X_train, y_train)
    fit_time = time.time() - start
    bar = progress_bar(1, 2)
    print(f"  {model_name:<16s} Step 1/2   {bar} | Elapsed: {fmt_time(fit_time)} | LinearSVC done")

    # Wrap with CalibratedClassifierCV for probability support
    print(f"  Calibrating probabilities (3-fold CV)...")
    model = CalibratedClassifierCV(base_svm, cv=3)
    model.fit(X_train, y_train)
    elapsed = time.time() - start
    bar = progress_bar(2, 2)
    print(f"  {model_name:<16s} Step 2/2   {bar} | Elapsed: {fmt_time(elapsed)} | Calibration done")

    print(f"  ✓ Done in {fmt_time(elapsed)} ({elapsed:.1f}s)")
    return model, elapsed


def train_knn(X_train, y_train):
    """Train KNN (no epochs, instant fit)."""
    model_name = "KNN"

    print(f"\n  {'═' * 56}")
    print(f"  [4/5] Training {model_name}  (k=5, distance-weighted)")
    print(f"  {'═' * 56}")

    model = KNeighborsClassifier(
        n_neighbors=5,
        weights="distance",
        metric="minkowski",
        p=2,
        leaf_size=20,
        n_jobs=-1,
    )

    start = time.time()
    print(f"  Building KD-Tree index on {X_train.shape[0]:,} samples...")
    model.fit(X_train, y_train)
    elapsed = time.time() - start

    bar = progress_bar(1, 1)
    print(f"  {model_name:<16s} {bar} | Elapsed: {fmt_time(elapsed)} | Done!")
    print(f"  ✓ Done in {fmt_time(elapsed)} ({elapsed:.1f}s)")
    return model, elapsed


def train_mlp(X_train, y_train):
    """Train MLP with per-epoch progress via partial_fit."""
    total_epochs = 300
    patience = 20
    model_name = "MLP"
    batch_size = 512
    val_frac = 0.1

    print(f"\n  {'═' * 56}")
    print(f"  [5/5] Training {model_name}  (512-256-128, up to {total_epochs} epochs)")
    print(f"  {'═' * 56}")

    # Split off validation set for early stopping
    n_val = int(len(y_train) * val_frac)
    indices = np.random.RandomState(42).permutation(len(y_train))
    val_idx, train_idx = indices[:n_val], indices[n_val:]

    if hasattr(y_train, 'iloc'):
        X_t, y_t = X_train[train_idx], y_train.iloc[train_idx].values
        X_v, y_v = X_train[val_idx], y_train.iloc[val_idx].values
    else:
        X_t, y_t = X_train[train_idx], y_train[train_idx]
        X_v, y_v = X_train[val_idx], y_train[val_idx]

    classes = np.unique(y_train)

    model = MLPClassifier(
        hidden_layer_sizes=(512, 256, 128),
        activation="relu",
        solver="adam",
        learning_rate='adaptive',
        learning_rate_init=0.001,
        alpha=0.00005,
        batch_size=batch_size,
        random_state=42,
        max_iter=1,
        warm_start=True,
    )

    start = time.time()
    best_val_loss = np.inf
    best_model_state = None
    no_improve = 0
    actual_epochs = 0

    for epoch in range(1, total_epochs + 1):
        model.partial_fit(X_t, y_t, classes=classes)
        actual_epochs = epoch

        # Compute validation loss every epoch
        val_pred = model.predict(X_v)
        val_acc = accuracy_score(y_v, val_pred)
        val_loss = 1.0 - val_acc

        elapsed = time.time() - start
        extra = f"| val_acc: {val_acc*100:.2f}% | patience: {patience - no_improve}/{patience}"
        print_progress(epoch, total_epochs, elapsed, model_name, extra)

        if val_loss < best_val_loss - 0.0005:
            best_val_loss = val_loss
            no_improve = 0
        else:
            no_improve += 1
            if no_improve >= patience:
                print(f"\n  Early stopping at epoch {epoch} (no improvement for {patience} epochs)")
                break

    elapsed = time.time() - start
    print(f"\n  ✓ Done in {fmt_time(elapsed)} ({elapsed:.1f}s) | {actual_epochs} epochs completed")
    return model, elapsed


# ─── MAIN PIPELINE ──────────────────────────────────────────

def train_all_models(X_train, X_test, y_train, y_test):
    """Train all 5 ML models with epoch-by-epoch progress."""
    print("\n[4/4] Training models...\n")
    print("=" * 60)

    trainers = [
        ("Random_Forest", train_random_forest),
        ("XGBoost", train_xgboost),
        ("SVM", train_svm),
        ("KNN", train_knn),
        ("MLP", train_mlp),
    ]

    all_metrics = []

    for name, trainer_fn in trainers:
        model, train_time = trainer_fn(X_train, y_train)

        # Evaluate
        metrics = evaluate_model(model, X_test, y_test, name)
        metrics["training_time_sec"] = round(train_time, 2)
        all_metrics.append(metrics)

        # Save model
        model_path = os.path.join(MODEL_DIR, f"{name}.joblib")
        joblib.dump(model, model_path)
        print(f"  Model saved: {model_path}")

    return all_metrics


def main():
    print("=" * 60)
    print("  VAULTO - ML Model Training Pipeline (v2)")
    print("  (with Feature Engineering & Tuned Hyperparameters)")
    print("=" * 60)

    X_train, X_test, y_train, y_test, feature_names = load_and_preprocess()
    all_metrics = train_all_models(X_train, X_test, y_train, y_test)

    # Save metrics
    metrics_path = os.path.join(MODEL_DIR, "metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(all_metrics, f, indent=2)

    labels_path = os.path.join(MODEL_DIR, "labels.json")
    with open(labels_path, "w") as f:
        json.dump(LABELS, f, indent=2)

    # Summary
    print("\n\n" + "=" * 60)
    print("  TRAINING COMPLETE - Model Comparison")
    print("=" * 60)
    print(f"  {'Model':<20s} {'Accuracy':>10s} {'F1-Score':>10s} {'Time':>8s}")
    print(f"  {'─' * 50}")

    best_model = max(all_metrics, key=lambda x: x["accuracy"])
    for m in all_metrics:
        marker = " ★" if m["model_name"] == best_model["model_name"] else ""
        print(f"  {m['model_name']:<20s} {m['accuracy']:>9.2f}% {m['f1_score']:>9.2f}% {m['training_time_sec']:>7.1f}s{marker}")

    print(f"\n  Best model: {best_model['model_name']} ({best_model['accuracy']:.2f}%)")
    print(f"\n  All models saved to: {MODEL_DIR}")
    print(f"  Metrics saved to: {metrics_path}")
    print("=" * 60)


if __name__ == "__main__":
    main()
