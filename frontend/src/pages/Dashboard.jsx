import { useState, useEffect } from "react";
import { getStats, getModels } from "../services/api";
import {
  ShieldAlert,
  Activity,
  Zap,
  Trophy,
  AlertTriangle,
  History,
  TrendingUp,
  Globe,
  Database,
  Cpu,
  Layers,
  Target,
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid, RadarChart,
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

const COLORS = ["#22c55e", "#38bdf8", "#ef4444", "#f43f5e", "#eab308", "#a855f7", "#f97316", "#06b6d4", "#14b8a6", "#8b5cf6", "#ec4899"];
const MODEL_ICONS = { XGBoost: "🚀", Random_Forest: "🌳", KNN: "📍", MLP: "🧠", SVM: "⚔️" };
const MODEL_COLORS = { XGBoost: "orange", Random_Forest: "green", KNN: "blue", MLP: "purple", SVM: "slate" };

// Severity mapping (same as ML API)
const SEVERITY_MAP = {
  Normal: { level: "None", color: "#22c55e" },
  Brute_Force: { level: "High", color: "#f97316" },
  Dictionary_Attack: { level: "High", color: "#f97316" },
  DoS: { level: "Critical", color: "#ef4444" },
  DDoS: { level: "Critical", color: "#ef4444" },
  SYN_Flood: { level: "Critical", color: "#ef4444" },
  Port_Scan: { level: "Medium", color: "#eab308" },
  SQL_Injection: { level: "Critical", color: "#ef4444" },
  XSS: { level: "High", color: "#f97316" },
  R2L: { level: "High", color: "#f97316" },
  Botnet: { level: "Critical", color: "#ef4444" },
};

// Training dataset distribution (actual from synthetic dataset v2)
const TRAINING_DIST = [
  { name: "Normal", value: 10000, fill: "#22c55e" },
  { name: "Brute Force", value: 10000, fill: "#f43f5e" },
  { name: "Dictionary", value: 10000, fill: "#f97316" },
  { name: "DoS", value: 10000, fill: "#ef4444" },
  { name: "DDoS", value: 10000, fill: "#38bdf8" },
  { name: "SYN Flood", value: 10000, fill: "#06b6d4" },
  { name: "Port Scan", value: 10000, fill: "#eab308" },
  { name: "SQL Injection", value: 10000, fill: "#14b8a6" },
  { name: "XSS", value: 10000, fill: "#8b5cf6" },
  { name: "R2L", value: 10000, fill: "#ec4899" },
  { name: "Botnet", value: 10000, fill: "#a855f7" },
];
const TOTAL_TRAINING = 110000;

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      getStats().then((r) => r.data),
      getModels().then((r) => r.data),
    ]).then(([statsRes, modelsRes]) => {
      if (statsRes.status === "fulfilled") setStats(statsRes.value);
      if (modelsRes.status === "fulfilled") setMetrics(modelsRes.value.metrics || []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Determine best model dynamically from ML API metrics
  const sortedModels = [...metrics].sort((a, b) => b.accuracy - a.accuracy);
  const bestModel = sortedModels[0];

  // Attack distribution: use user's prediction history if available, else training data
  const distData = stats?.attackDistribution?.length
    ? stats.attackDistribution.map((d, i) => ({
        name: d._id?.replace("_", " "),
        value: d.count,
        fill: COLORS[i % COLORS.length],
      }))
    : TRAINING_DIST;

  const totalSamples = distData.reduce((sum, d) => sum + d.value, 0);

  // Last detected attack from recent predictions
  const lastThreat = stats?.recentPredictions?.find((p) => p.attack_name !== "Normal");
  const lastDetectedName = lastThreat?.attack_name?.replace("_", " ") || "None yet";
  const lastDetectedTime = lastThreat
    ? timeAgo(new Date(lastThreat.createdAt))
    : "No scans";

  // Radar data from metrics
  const radarData = metrics.length
    ? ["accuracy", "precision", "recall", "f1_score"].map((key) => {
        const entry = { metric: key.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()) };
        metrics.forEach((m) => { entry[m.model_name] = m[key]; });
        return entry;
      })
    : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<BellIcon />}
          label="Total Predictions"
          value={stats?.totalPredictions?.toLocaleString() || "0"}
          subValue={stats ? "from your scans" : "run a prediction"}
          color="blue"
        />
        <StatCard
          icon={<AlertTriangle className="text-red-400" />}
          label="Threats Detected"
          value={stats?.totalAttacks?.toLocaleString() || "0"}
          subValue={stats?.totalPredictions ? `${Math.round((stats.totalAttacks / stats.totalPredictions) * 100)}% attack rate` : ""}
          color="red"
        />
        <StatCard
          icon={<History className="text-orange-400" />}
          label="Last Detected"
          value={lastDetectedName}
          subValue={lastDetectedTime}
          color="orange"
        />
        <StatCard
          icon={<Trophy className="text-green-400" />}
          label="Best Model"
          value={bestModel?.model_name?.replace("_", " ") || "XGBoost"}
          subValue={`${bestModel?.accuracy || 99.78}% Acc`}
          color="green"
        />
      </div>

      {/* Dataset Info Banner */}
      <div className="glass-panel rounded-2xl p-4 border-blue-500/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <Database size={18} className="text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Training Dataset</p>
            <p className="text-sm font-bold text-white">Synthetic Dataset v2 (Optimized)</p>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-lg font-black text-blue-400">{metrics.length > 0 ? '110,000' : '110,000'}</p>
            <p className="text-[9px] text-slate-500 uppercase font-bold">Total Samples</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-green-400">11</p>
            <p className="text-[9px] text-slate-500 uppercase font-bold">Attack Classes</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-purple-400">28</p>
            <p className="text-[9px] text-slate-500 uppercase font-bold">Features</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-orange-400">{metrics.length || 5}</p>
            <p className="text-[9px] text-slate-500 uppercase font-bold">Models</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attack Statistics - Donut Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Zap size={18} className="text-blue-400" />
              {stats?.attackDistribution?.length ? "Your Prediction Distribution" : "Training Data Distribution"}
            </h3>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 neon-glow" />
              <div className="w-2 h-2 rounded-full bg-slate-700" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="h-[280px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distData}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {distData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} className="stroke-none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#f8fafc' }}
                    formatter={(value) => value.toLocaleString()}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-white">{totalSamples >= 1000 ? `${(totalSamples / 1000).toFixed(0)}K` : totalSamples}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">{stats?.attackDistribution?.length ? "Predictions" : "Training Samples"}</span>
              </div>
            </div>

            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
              {distData.map((item, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2 bg-white/5 rounded-lg border border-white/5 group hover:border-blue-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill, boxShadow: `0 0 8px ${item.fill}` }} />
                    <span className="text-sm font-medium text-slate-300">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{item.value.toLocaleString()}</span>
                    <span className="text-[9px] text-slate-500">({((item.value / totalSamples) * 100).toFixed(1)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Threats */}
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-bold flex items-center gap-2">
              <History size={18} className="text-blue-400" />
              Recent Threats
            </h3>
            {stats?.recentPredictions?.length > 0 && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-tighter">
                <span className="w-1 h-1 bg-red-500 rounded-full animate-ping" />
                Live
              </span>
            )}
          </div>

          <div className="space-y-4">
            {stats?.recentPredictions?.length > 0 ? (
              <>
                <div className="flex text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2">
                  <span className="flex-1">Attack</span>
                  <span>Severity</span>
                </div>
                {stats.recentPredictions.slice(0, 8).map((threat, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400 group-hover:text-white transition-colors">
                        <ShieldAlert size={14} />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-200 block">{threat.attack_name?.replace("_", " ")}</span>
                        <span className="text-[9px] text-slate-500">{timeAgo(new Date(threat.createdAt))}</span>
                      </div>
                    </div>
                    <span
                      className="px-2 py-1 rounded-md text-[10px] font-bold uppercase"
                      style={{ backgroundColor: `${threat.severity?.color || SEVERITY_MAP[threat.attack_name]?.color || "#666"}20`, color: threat.severity?.color || SEVERITY_MAP[threat.attack_name]?.color || "#666" }}
                    >
                      {threat.severity?.level || SEVERITY_MAP[threat.attack_name]?.level || "N/A"}
                    </span>
                  </div>
                ))}
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-50">
                <ShieldAlert size={36} className="text-slate-600 mb-3" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Predictions Yet</p>
                <p className="text-[10px] text-slate-500 mt-1">Run a prediction to see threats here</p>
                <a href="/predict" className="mt-4 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all neon-glow">
                  Start Scanning
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attack Class Distribution Bar Chart */}
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-white font-bold flex items-center gap-2 mb-6">
            <TrendingUp size={18} className="text-blue-400" />
            {stats?.attackDistribution?.length ? "Prediction Breakdown" : "Training Class Balance"}
          </h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distData} margin={{ bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9 }} angle={-35} textAnchor="end" height={50} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  formatter={(value) => value.toLocaleString()}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={18}>
                  {distData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex justify-between items-center text-[10px] text-slate-500 uppercase font-bold tracking-widest">
            <span>{distData.length} Classes</span>
            <span className="flex items-center gap-2">
              <div className="w-12 h-1 bg-blue-500/20 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 neon-glow" style={{ width: `${distData.length > 0 ? 100 : 0}%` }} />
              </div>
              {totalSamples.toLocaleString()} Samples
            </span>
          </div>
        </div>

        {/* Model Radar Comparison */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/20 blur-[100px] rounded-full" />
          </div>

          <div className="relative h-full flex flex-col">
            <h3 className="text-white font-bold flex items-center gap-2 mb-4">
              <Target size={18} className="text-blue-400" />
              Model Metric Comparison
            </h3>

            {radarData.length > 0 ? (
              <>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.08)" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 'bold' }} />
                      <PolarRadiusAxis domain={[0, 100]} axisLine={false} tick={false} />
                      {metrics.map((m, i) => (
                        <Radar key={m.model_name} name={m.model_name.replace("_", " ")} dataKey={m.model_name}
                          stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length]} fillOpacity={0.05} strokeWidth={2} />
                      ))}
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 flex flex-wrap justify-center gap-3">
                  {metrics.map((m, i) => (
                    <div key={i} className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-all cursor-default">
                      <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{m.model_name.replace("_", " ")}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center opacity-40">
                  <Cpu size={48} className="text-slate-600 mx-auto mb-3" />
                  <p className="text-xs font-bold text-slate-400 uppercase">Start ML API to load metrics</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Model Performance - Dynamic from ML API */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold flex items-center gap-2">
            <Trophy size={18} className="text-blue-400" />
            Model Performance
          </h3>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            {metrics.length} engines trained
          </span>
        </div>
        {metrics.length > 0 ? (
          <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${Math.min(metrics.length, 5)} gap-4`}>
            {sortedModels.map((m, i) => (
              <ModelScore
                key={m.model_name}
                name={m.model_name.replace("_", " ")}
                accuracy={m.accuracy}
                precision={m.precision}
                recall={m.recall}
                f1={m.f1_score}
                icon={MODEL_ICONS[m.model_name] || "🔧"}
                color={MODEL_COLORS[m.model_name] || "blue"}
                isBest={i === 0}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <ModelScoreSimple name="XGBoost" score="99.78" icon="🚀" color="orange" isBest />
            <ModelScoreSimple name="Random Forest" score="99.76" icon="🌳" color="green" />
            <ModelScoreSimple name="MLP" score="99.60" icon="🧠" color="purple" />
            <ModelScoreSimple name="SVM" score="99.57" icon="⚔️" color="slate" />
            <ModelScoreSimple name="KNN" score="98.75" icon="📍" color="blue" />
          </div>
        )}
      </div>
    </div>
  );
}

// Helper: time ago
function timeAgo(date) {
  const sec = Math.floor((Date.now() - date) / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  return `${days}d ago`;
}

function StatCard({ icon, label, value, subValue, color }) {
  const colorClasses = {
    blue: "from-blue-500/10 to-transparent border-blue-500/20",
    red: "from-red-500/10 to-transparent border-red-500/20",
    orange: "from-orange-500/10 to-transparent border-orange-500/20",
    green: "from-green-500/10 to-transparent border-green-500/20",
  };

  return (
    <div className={`glass-panel p-5 rounded-2xl flex items-center justify-between border ${colorClasses[color]} bg-gradient-to-br transition-transform hover:scale-[1.02] cursor-default`}>
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-2xl font-black text-white">{value}</h4>
          {subValue && <span className="text-[10px] text-slate-400 font-medium">{subValue}</span>}
        </div>
      </div>
      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
        {icon}
      </div>
    </div>
  );
}

function ModelScore({ name, accuracy, precision, recall, f1, icon, color, isBest }) {
  const colorMap = {
    green: "text-green-400",
    orange: "text-orange-400",
    blue: "text-blue-400",
    purple: "text-purple-400",
    slate: "text-slate-400",
  };

  return (
    <div className={`glass-panel p-4 rounded-xl border transition-all text-center group hover:scale-[1.02] cursor-default ${isBest ? "border-green-500/30 bg-green-500/5" : "border-white/5 hover:border-white/10"}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-xl filter grayscale group-hover:grayscale-0 transition-all">{icon}</div>
        {isBest && (
          <span className="px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[7px] font-black uppercase tracking-tighter">
            Best
          </span>
        )}
      </div>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mb-1 truncate text-left">{name}</p>
      <div className="flex items-baseline gap-1">
        <span className={`text-xl font-black ${colorMap[color]}`}>{accuracy}%</span>
        <span className="text-[8px] text-slate-600 font-bold uppercase">Acc.</span>
      </div>
      <div className="mt-3 space-y-1.5">
        <MetricBar label="Precision" value={precision} color={colorMap[color]} />
        <MetricBar label="Recall" value={recall} color={colorMap[color]} />
        <MetricBar label="F1 Score" value={f1} color={colorMap[color]} />
      </div>
    </div>
  );
}

function MetricBar({ label, value, color }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[7px] font-bold text-slate-600 uppercase w-12 text-left truncate">{label}</span>
      <div className="flex-1 h-1 bg-slate-900 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${value}%`, backgroundColor: 'currentColor' }} />
      </div>
      <span className="text-[8px] font-bold text-slate-400 w-8 text-right">{value}%</span>
    </div>
  );
}

function ModelScoreSimple({ name, score, icon, color, isBest }) {
  const colorMap = {
    green: "text-green-400",
    orange: "text-orange-400",
    blue: "text-blue-400",
    purple: "text-purple-400",
    slate: "text-slate-400",
  };

  return (
    <div className={`glass-panel p-4 rounded-xl border transition-all text-center group hover:scale-[1.02] cursor-default ${isBest ? 'border-green-500/30 bg-green-500/5' : 'border-white/5 hover:border-white/10'}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xl filter grayscale group-hover:grayscale-0 transition-all">{icon}</div>
        {isBest && (
          <span className="px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[7px] font-black uppercase tracking-tighter">
            Best
          </span>
        )}
      </div>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mb-1 truncate text-left">{name}</p>
      <div className="flex items-baseline gap-1">
        <span className={`text-xl font-black ${colorMap[color]}`}>{score}%</span>
        <span className="text-[8px] text-slate-600 font-bold uppercase">Acc.</span>
      </div>
      <div className="mt-2 w-full h-1 bg-slate-900 rounded-full overflow-hidden">
        <div className="h-full bg-current rounded-full neon-glow" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function BellIcon() {
  return (
    <div className="relative">
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full neon-glow animate-ping" />
      <Activity className="text-blue-400" />
    </div>
  );
}
