import { useState, useEffect } from "react";
import { predict, predictAll, getFeatures } from "../services/api";
import { ShieldAlert, Zap, AlertTriangle, Activity, Target } from "lucide-react";

// Real samples extracted from the CICIDS2017 + CIC-IDS2018 + UNSW-NB15 merged training dataset
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
  "Botnet": [22592.0, 3.0, 4.0, 326.0, 140.0, 108.67, 35.0, 20626.77, 309.84, 3765.33, 301.5, 7356.67, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 66.57],
};

export default function Predict() {
  const [featureNames, setFeatureNames] = useState([]);
  const [features, setFeatures] = useState(Array(20).fill(""));
  const [model, setModel] = useState("Random_Forest");
  const [result, setResult] = useState(null);
  const [allResults, setAllResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getFeatures()
      .then((res) => setFeatureNames(res.data.features))
      .catch(() => setFeatureNames(Array(20).fill("feature")));
  }, []);

  const handlePredict = async () => {
    setError("");
    setLoading(true);
    setResult(null);
    setAllResults(null);
    try {
      const nums = features.map((f) => parseFloat(f) || 0);
      const res = await predict(nums, model);
      setResult(res.data);
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
    setAllResults(null);
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
    setAllResults(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-white text-glow tracking-tight uppercase">Attack Prediction</h1>
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
          <Activity size={14} className="text-blue-400 animate-pulse" />
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Safe Mode Active</span>
        </div>
      </div>

      {/* Sample buttons */}
      <div className="glass-panel rounded-2xl p-6 border-blue-500/10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-blue-500 rounded-full neon-glow" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Simulation Presets</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(SAMPLE_ATTACKS).map((name) => (
            <button key={name} onClick={() => loadSample(name)}
              className="px-4 py-2 bg-white/5 border border-white/5 hover:border-blue-500/40 hover:bg-blue-500/5 rounded-xl text-xs font-semibold text-slate-300 transition-all duration-300 group">
              <span className="group-hover:text-blue-400">{name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feature inputs */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border-white/5">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-4 bg-blue-500 rounded-full neon-glow" />
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Network Telemetry Features</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featureNames.map((name, i) => (
              <div key={i} className="space-y-1.5 focus-within:z-10 group">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-tighter truncate px-1 group-focus-within:text-blue-400 transition-colors" title={name}>
                  {name}
                </label>
                <input type="number" step="any" value={features[i]}
                  onChange={(e) => {
                    const newF = [...features];
                    newF[i] = e.target.value;
                    setFeatures(newF);
                  }}
                  className="w-full px-3 py-2 bg-slate-950/50 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/5 transition-all outline-none"
                  placeholder="0.00" />
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[10px] font-bold text-blue-500/70 uppercase tracking-widest mb-1.5 px-1 font-mono">Select Target Model</label>
              <select value={model} onChange={(e) => setModel(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none cursor-pointer">
                <option value="Random_Forest">Random Forest Classifier</option>
                <option value="XGBoost">XGBoost (Extreme Gradient)</option>
                <option value="SVM">Support Vector Machine</option>
                <option value="KNN">K-Nearest Neighbors</option>
                <option value="MLP">Multi-Layer Perceptron (NN)</option>
              </select>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button onClick={handlePredict} disabled={loading}
                className="flex-1 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl font-bold flex items-center justify-center gap-2 transition-all neon-glow text-sm uppercase tracking-widest">
                <Zap size={18} fill="currentColor" /> {loading ? "Computing..." : "Predict"}
              </button>
              <button onClick={handlePredictAll} disabled={loading}
                className="flex-1 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm uppercase tracking-widest text-slate-300">
                <ShieldAlert size={18} /> Cross-Check
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Result Panel */}
        <div className="glass-panel rounded-2xl p-6 border-white/5 flex flex-col min-h-[400px]">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-4 bg-blue-500 rounded-full neon-glow" />
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Analysis Result</h2>
          </div>

          <div className="flex-1 flex flex-col">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-xs font-bold text-slate-500 uppercase animate-pulse">Running ML Core...</p>
              </div>
            ) : result ? (
              <div className="space-y-6 animate-in zoom-in-95 duration-500">
                <div className="text-center p-6 rounded-3xl bg-white/5 border border-white/5 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-500/5" />
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500"
                      style={{ background: `${result.severity?.color}15`, border: `2px solid ${result.severity?.color}30` }}>
                      <ShieldAlert size={40} style={{ color: result.severity?.color }} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Status Identified</h4>
                    <h3 className="text-2xl font-black text-white uppercase text-glow" style={{ color: result.severity?.color }}>
                      {result.attack_name?.replace("_", " ")}
                    </h3>
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-white/10 uppercase font-bold text-[10px] text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: result.severity?.color }} />
                      {result.severity?.level} Severity
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Confidence</p>
                    <p className="text-xl font-black text-white">{result.confidence}%</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Engine</p>
                    <p className="text-xs font-bold text-blue-400 truncate">{result.model_used}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2">Defense Protocol</p>
                  <p className="text-[11px] leading-relaxed text-slate-300 font-medium italic">
                    "{result.recommendation}"
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-red-500/5 border border-red-500/10 rounded-2xl">
                <AlertTriangle size={32} className="text-red-500 mb-2" />
                <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-2">Core Failure</p>
                <p className="text-[11px] text-red-400/80 leading-relaxed font-mono">{error}</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-30">
                <Target size={48} className="text-slate-500 mb-4" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Awaiting Telemetry</p>
                <p className="text-[9px] text-slate-500 uppercase tracking-tight mt-1">Input network features to begin</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {allResults && (
        <div className="glass-panel rounded-2xl p-6 border-white/5 animate-in slide-in-from-top-4 duration-500 mt-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-4 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Multi-Model Cross-Analysis</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] text-slate-500 uppercase font-black tracking-widest">
                  <th className="pb-4 px-4 font-black">Analysis Engine</th>
                  <th className="pb-4 px-4 font-black">Predicted State</th>
                  <th className="pb-4 px-4 font-black">Reliability Score</th>
                  <th className="pb-4 px-4 font-black">Threat Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {allResults.map((r, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors group">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="p-1 px-2 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400 group-hover:text-blue-400 transition-colors">
                          ENG-{i + 1}
                        </div>
                        <span className="text-sm font-bold text-slate-300">{r.model.replace("_", " ")}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-black text-white uppercase tracking-tight">{r.attack_name?.replace("_", " ")}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 w-24 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${r.confidence}%` }} />
                        </div>
                        <span className="text-xs font-bold text-blue-400 font-mono">{r.confidence?.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right sm:text-left">
                      <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter"
                        style={{ backgroundColor: `${r.severity?.color}15`, color: r.severity?.color, border: `1px solid ${r.severity?.color}30` }}>
                        {r.severity?.level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value, style }) {
  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-lg font-bold" style={style}>{value}</p>
    </div>
  );
}
