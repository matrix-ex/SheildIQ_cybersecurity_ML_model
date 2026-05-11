import { useEffect, useState } from "react";
import { AlertTriangle, ShieldAlert, Sparkles } from "lucide-react";
import { getFeatures, predictAll } from "../services/api";
import { analyzeTraffic } from "../api/alerts";
import PreventionPanel from "../components/PreventionPanel";

const SAMPLE_ATTACKS = {
  "Normal Traffic": [54457531.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.04, 54457531.0, 54457531.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0],
  "Brute Force": [1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2000000.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0],
  "Dictionary Attack": [3.69, 164.0, 32.0, 212941.0, 1386.0, 1298.0, 43.0, 459304.78, 52.9, 22.4, 114.8, 2674.21, 0.22, 0.13, 0.1, 1.0, 1.0, 1.0, 0.0, 0.0],
  "DoS Attack": [15868.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 126.04, 15868.0, 15868.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0],
  "DDoS Attack": [15832478.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.13, 15800000.0, 15800000.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0],
  "SYN Flood": [0.0, 2.0, 0.0, 200.0, 0.0, 100.0, 0.0, 88888888.0, 111111.11, 0.01, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 3.0, 3.0, 0.0, 0.0],
  "Port Scan": [71.0, 1.0, 1.0, 0.0, 6.0, 0.0, 6.0, 84507.04, 28169.01, 71.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 3.0],
  "SQL Injection": [0.0, 2.0, 0.0, 200.0, 0.0, 100.0, 0.0, 88888888.0, 111111.11, 0.01, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0, 2.0, 0.0, 0.0],
  "XSS": [5175794.0, 3.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.77, 1725264.67, 2587897.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  "R2L": [21039913.0, 2.0, 5.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.33, 3506652.17, 2671668.0, 5259966.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 0.0],
  Botnet: [22592.0, 3.0, 4.0, 326.0, 140.0, 108.67, 35.0, 20626.77, 309.84, 3765.33, 301.5, 7356.67, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 66.57],
};

const modelOptions = [
  { value: "Random_Forest", label: "Random Forest" },
  { value: "XGBoost", label: "XGBoost" },
  { value: "SVM", label: "Support Vector Machine" },
  { value: "KNN", label: "K-Nearest Neighbors" },
  { value: "MLP", label: "Multi-Layer Perceptron" },
];

export default function Predict() {
  const [featureNames, setFeatureNames] = useState([]);
  const [features, setFeatures] = useState(Array(20).fill(""));
  const [model, setModel] = useState("Random_Forest");
  const [result, setResult] = useState(null);
  const [prevention, setPrevention] = useState(null);
  const [allResults, setAllResults] = useState(null);
  const [lastPayload, setLastPayload] = useState(null);
  const [alertId, setAlertId] = useState(null);
  const [savingAlert, setSavingAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const FALLBACK_FEATURES = [
  "flow_duration", "total_fwd_packets", "total_bwd_packets",
  "total_len_fwd_packets", "total_len_bwd_packets",
  "fwd_packet_len_mean", "bwd_packet_len_mean",
  "flow_bytes_per_sec", "flow_packets_per_sec",
  "flow_iat_mean", "fwd_iat_mean", "bwd_iat_mean",
  "fwd_psh_flags", "bwd_psh_flags", "fwd_urg_flags",
  "syn_flag_count", "rst_flag_count", "ack_flag_count",
  "down_up_ratio", "avg_packet_size",
];

  useEffect(() => {
    getFeatures()
      .then((res) => {
        const f = res.data?.features;
        setFeatureNames(f?.length === 20 ? f : FALLBACK_FEATURES);
      })
      .catch(() => setFeatureNames(FALLBACK_FEATURES));
  }, []);

  const handlePredict = async () => {
    setError("");
    setLoading(true);
    setResult(null);
    setPrevention(null);
    setAllResults(null);
    setAlertId(null);
    try {
      const nums = features.map((f) => parseFloat(f) || 0);
      const payload = {
        features: nums,
        model,
        ip: "127.0.0.1",
        source_url: "",
        triggered_by: "manual",
      };

      const res = await analyzeTraffic(payload, {
        headers: { "x-vaulto-api-key": "VAULTO_DEV_2024" }
      });
      const data = res.data || {};
      setResult(data.prediction || null);
      setPrevention(data.prevention || null);
      setAlertId(data.alert_id || null);
      setLastPayload(payload);
    } catch (err) {
      setError(err.response?.data?.error || "Prediction failed. Is the ML service running?");
    } finally {
      setLoading(false);
    }
  };

  const handlePredictAll = async () => {
    setError("");
    setLoading(true);
    setResult(null);
    setPrevention(null);
    setAllResults(null);
    setAlertId(null);
    try {
      const nums = features.map((f) => parseFloat(f) || 0);
      const res = await predictAll(nums);
      setAllResults(res.data.results);
    } catch (err) {
      setError(err.response?.data?.error || "Prediction failed. Is the ML service running?");
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (name) => {
    const sample = SAMPLE_ATTACKS[name];
    setFeatures(sample.map(String));
    setResult(null);
    setPrevention(null);
    setAllResults(null);
    setAlertId(null);
  };

  const handleSaveAsAlert = async () => {
    if (!lastPayload) {
      return;
    }

    setSavingAlert(true);
    try {
      const res = await analyzeTraffic(lastPayload, {
        headers: { "x-vaulto-api-key": "VAULTO_DEV_2024" }
      });
      setAlertId(res.data?.alert_id || alertId);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save alert.");
    } finally {
      setSavingAlert(false);
    }
  };

  return (
    <div className="space-y-6 animate-subtle-up">
      <section className="surface-card p-6 sm:p-7">
        <p className="section-title">Prediction Console</p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-extrabold text-slate-900">Traffic Classification</h2>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
            <Sparkles size={14} /> Manual Analysis Mode
          </span>
        </div>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Submit 20 telemetry features to detect attack class, confidence, severity, and recommended response.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {Object.keys(SAMPLE_ATTACKS).map((name) => (
            <button
              key={name}
              onClick={() => loadSample(name)}
              className="rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              {name}
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="surface-card p-6 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-slate-900">Input Features</h3>
            <span className="text-xs text-slate-500">{featureNames.length || 20} expected fields</span>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {featureNames.map((name, i) => (
              <div key={i}>
                <label className="mb-1 block truncate text-[11px] font-semibold uppercase tracking-wide text-slate-500" title={name}>
                  {name}
                </label>
                <input
                  type="number"
                  step="any"
                  value={features[i]}
                  onChange={(e) => {
                    const next = [...features];
                    next[i] = e.target.value;
                    setFeatures(next);
                  }}
                  className="app-input"
                  placeholder="0"
                />
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Model Selection
              </label>
              <select value={model} onChange={(e) => setModel(e.target.value)} className="app-input">
                {modelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button onClick={handlePredict} disabled={loading} className="btn-primary disabled:opacity-60">
              {loading ? "Processing..." : "Predict"}
            </button>

            <button onClick={handlePredictAll} disabled={loading} className="btn-secondary disabled:opacity-60">
              Compare All
            </button>
          </div>
        </div>

        <div className="surface-card p-6">
          <h3 className="text-lg font-bold text-slate-900">Result</h3>

          <div className="mt-4">
            {loading && (
              <div className="surface-card-soft p-6 text-center">
                <div className="mx-auto mb-3 h-9 w-9 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
                <p className="text-sm text-slate-600">Running prediction...</p>
              </div>
            )}

            {!loading && error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <AlertTriangle size={16} /> Request failed
                </div>
                <p className="mt-2 text-sm">{error}</p>
              </div>
            )}

            {!loading && result && (
              <div className="space-y-3">
                <div className="surface-card-soft p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Detected Class</p>
                  <p className="mt-1 text-xl font-extrabold text-slate-900">
                    {(result.prediction_label || result.attack_name || "Unknown")?.replace("_", " ")}
                  </p>
                  <span className="mt-2 inline-flex rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white">
                    {prevention?.severity || "Unknown"} severity
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="surface-card-soft p-3">
                    <p className="text-xs text-slate-500">Confidence</p>
                    <p className="text-lg font-bold text-slate-900">
                      {(() => {
                        const confidence = Number(result.confidence || 0);
                        const percent = confidence > 1 ? confidence : confidence * 100;
                        return `${percent.toFixed(1)}%`;
                      })()}
                    </p>
                  </div>
                  <div className="surface-card-soft p-3">
                    <p className="text-xs text-slate-500">Model</p>
                    <p className="text-sm font-semibold text-slate-900 truncate">{result.model_used}</p>
                  </div>
                </div>

                <div className="surface-card-soft p-3.5">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Recommendation</p>
                  <p className="mt-1 text-sm text-slate-700">{prevention?.reason || result.recommendation || "No recommendation."}</p>
                </div>

                <div className="surface-card-soft p-3">
                  <p className="text-xs text-slate-500">Alert ID</p>
                  <p className="text-sm font-semibold text-slate-900 break-all">{alertId || "Not saved"}</p>
                </div>
              </div>
            )}

            {!loading && !result && !error && (
              <div className="surface-card-soft p-8 text-center">
                <ShieldAlert size={28} className="mx-auto text-slate-500" />
                <p className="mt-3 text-sm font-semibold text-slate-700">No result yet</p>
                <p className="mt-1 text-xs text-slate-500">Run prediction to inspect risk classification.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {allResults && (
        <section className="surface-card p-6">
          <h3 className="text-lg font-bold text-slate-900">Model Comparison</h3>
          <p className="mt-1 text-sm text-slate-500">Cross-model classification and confidence scores for the same input.</p>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                  <th className="py-2.5 pr-3">Model</th>
                  <th className="py-2.5 px-3">Prediction</th>
                  <th className="py-2.5 px-3 text-right">Confidence</th>
                  <th className="py-2.5 pl-3 text-right">Severity</th>
                </tr>
              </thead>
              <tbody>
                {allResults.map((entry, index) => (
                  <tr key={index} className="border-b border-slate-100 last:border-b-0">
                    <td className="py-3 pr-3 text-sm font-semibold text-slate-800">{entry.model.replace("_", " ")}</td>
                    <td className="py-3 px-3 text-sm text-slate-700">{entry.attack_name?.replace("_", " ")}</td>
                    <td className="py-3 px-3 text-right text-sm font-semibold text-slate-800">{entry.confidence?.toFixed(1)}%</td>
                    <td className="py-3 pl-3 text-right">
                      <span
                        className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                        style={{
                          backgroundColor: `${entry.severity?.color || "#64748b"}1A`,
                          color: entry.severity?.color || "#334155",
                        }}
                      >
                        {entry.severity?.level || "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {prevention && (
        <PreventionPanel
          prevention={prevention}
          prediction={result}
          onSaveAlert={handleSaveAsAlert}
          saving={savingAlert}
        />
      )}
    </div>
  );
}
