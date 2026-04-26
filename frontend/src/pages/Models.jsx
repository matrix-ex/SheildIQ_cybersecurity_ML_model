import { useState, useEffect } from "react";
import { getModels } from "../services/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, LineChart, Line, Legend,
} from "recharts";

const COLORS = ["#3b82f6", "#8b5cf6", "#22c55e", "#f97316", "#ef4444"];
const MODEL_ICONS = { XGBoost: "🚀", Random_Forest: "🌳", KNN: "📍", MLP: "🧠", SVM: "⚔️" };

import {
  Trophy,
  Cpu,
  Target,
  Zap,
  Clock,
  TrendingUp,
  BarChart as BarChartIcon,
  Shield,
  Activity,
} from "lucide-react";

export default function Models() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getModels()
      .then((res) => setMetrics(res.data.metrics || []))
      .catch(() => setMetrics([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!metrics.length) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center border-white/5 max-w-2xl mx-auto mt-10">
        <Cpu size={48} className="text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">No Model Data Found</h3>
        <p className="text-slate-500 text-sm mb-4">Make sure the Python ML microservice is running on port 5000.</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
          <Activity size={14} className="text-red-400 animate-pulse" />
          <span className="text-xs font-bold text-red-400 uppercase tracking-widest">ML API Offline</span>
        </div>
      </div>
    );
  }

  const sorted = [...metrics].sort((a, b) => b.accuracy - a.accuracy);
  const best = sorted[0];

  const barData = sorted.map((m, i) => ({
    name: m.model_name.replace("_", " "),
    Accuracy: m.accuracy,
    Precision: m.precision,
    Recall: m.recall,
    F1: m.f1_score,
    fill: COLORS[i % COLORS.length],
  }));

  const radarData = ["accuracy", "precision", "recall", "f1_score"].map((key) => {
    const entry = { metric: key.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()) };
    metrics.forEach((m) => { entry[m.model_name] = m[key]; });
    return entry;
  });

  // Grouped bar data for full comparison
  const comparisonData = sorted.map((m) => ({
    name: m.model_name.replace("_", " "),
    Accuracy: m.accuracy,
    Precision: m.precision,
    Recall: m.recall,
    "F1 Score": m.f1_score,
  }));

  // Average metrics
  const avgAcc = (metrics.reduce((s, m) => s + m.accuracy, 0) / metrics.length).toFixed(2);
  const avgF1 = (metrics.reduce((s, m) => s + m.f1_score, 0) / metrics.length).toFixed(2);
  const totalTrainTime = metrics.reduce((s, m) => s + (m.training_time_sec || 0), 0).toFixed(1);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-white text-glow tracking-tight uppercase">Algorithm Benchmarks</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">ML API Connected</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <Trophy size={14} className="text-blue-400" />
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{metrics.length} Models Loaded</span>
          </div>
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Trophy className="text-green-400" size={20} />}
          label="Best Model"
          value={best.model_name.replace("_", " ")}
          subValue={`${best.accuracy}% Accuracy`}
          color="green"
        />
        <StatCard
          icon={<Target className="text-blue-400" size={20} />}
          label="Average Accuracy"
          value={`${avgAcc}%`}
          subValue="Across all models"
          color="blue"
        />
        <StatCard
          icon={<Zap className="text-purple-400" size={20} />}
          label="Average F1-Score"
          value={`${avgF1}%`}
          subValue="Weighted harmonic mean"
          color="purple"
        />
        <StatCard
          icon={<Clock className="text-orange-400" size={20} />}
          label="Total Training Time"
          value={`${totalTrainTime}s`}
          subValue={`${metrics.length} models trained`}
          color="orange"
        />
      </div>

      {/* Model Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {sorted.map((m, i) => (
          <div key={m.model_name}
            className={`glass-panel rounded-2xl p-5 border transition-all duration-300 hover:scale-[1.03] cursor-default group relative overflow-hidden ${m.model_name === best.model_name ? "border-green-500/30 bg-green-500/5" : "border-white/5 hover:border-blue-500/20"
              }`}>
            {/* Glow effect for best model */}
            {m.model_name === best.model_name && (
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />
            )}

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 group-hover:text-blue-400 transition-colors">
                  <span className="text-lg">{MODEL_ICONS[m.model_name] || "🔧"}</span>
                </div>
                {m.model_name === best.model_name && (
                  <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[8px] font-black uppercase tracking-tighter shadow-[0_0_10px_rgba(34,197,94,0.3)] flex items-center gap-1">
                    <Trophy size={10} /> Best
                  </span>
                )}
                <span className="text-[9px] font-mono text-slate-600 bg-slate-900/50 px-2 py-0.5 rounded">
                  #{i + 1}
                </span>
              </div>

              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 truncate">{m.model_name.replace("_", " ")}</p>
              <h4 className="text-3xl font-black text-white mb-4 group-hover:text-glow transition-all" style={{ color: COLORS[i % COLORS.length] }}>
                {m.accuracy}%
              </h4>

              <div className="space-y-2.5">
                <MetricLine label="Precision" value={m.precision} color={COLORS[i % COLORS.length]} />
                <MetricLine label="Recall" value={m.recall} color={COLORS[i % COLORS.length]} />
                <MetricLine label="F1-Score" value={m.f1_score} color={COLORS[i % COLORS.length]} />
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <span className="text-[9px] text-slate-500 font-bold uppercase">Train Time</span>
                  <span className="text-xs font-mono text-slate-300">{m.training_time_sec?.toFixed(1)}s</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accuracy Comparison Bar Chart */}
        <div className="glass-panel rounded-3xl p-8 border-white/5">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-1 h-4 bg-blue-500 rounded-full neon-glow" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Accuracy Comparison</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis domain={[95, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }}
                  tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  formatter={(value) => [`${value}%`, '']}
                />
                <Bar dataKey="Accuracy" radius={[6, 6, 0, 0]} barSize={36}>
                  {barData.map((d, i) => <Cell key={i} fill={d.fill} fillOpacity={0.85} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Multi-Dimensional Radar */}
        <div className="glass-panel rounded-3xl p-8 border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/20 blur-[100px] rounded-full" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-1 h-4 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Metric Radar Analysis</h3>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                  <PolarRadiusAxis domain={[95, 100]} axisLine={false} tick={false} />
                  {metrics.map((m, i) => (
                    <Radar key={m.model_name} name={m.model_name.replace("_", " ")} dataKey={m.model_name}
                      stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length]} fillOpacity={0.08} strokeWidth={2} />
                  ))}
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    formatter={(value) => [`${value}%`, '']}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {metrics.map((m, i) => (
                <div key={i} className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-all cursor-default">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{m.model_name.replace("_", " ")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full Metrics Table */}
      <div className="glass-panel rounded-3xl p-8 border-white/5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Detailed Performance Matrix</h3>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
            <Shield size={14} className="text-cyan-400" />
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Live Metrics</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-[10px] text-slate-500 uppercase font-black tracking-widest">
                <th className="pb-4 px-4">Rank</th>
                <th className="pb-4 px-4">Model</th>
                <th className="pb-4 px-4 text-right">Accuracy</th>
                <th className="pb-4 px-4 text-right">Precision</th>
                <th className="pb-4 px-4 text-right">Recall</th>
                <th className="pb-4 px-4 text-right">F1-Score</th>
                <th className="pb-4 px-4 text-right">Train Time</th>
                <th className="pb-4 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sorted.map((m, i) => (
                <tr key={m.model_name} className="hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-4">
                    <span className={`text-sm font-black ${i === 0 ? 'text-green-400' : i === 1 ? 'text-blue-400' : i === 2 ? 'text-purple-400' : 'text-slate-500'}`}>
                      #{i + 1}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{MODEL_ICONS[m.model_name] || "🔧"}</span>
                      <div>
                        <span className="text-sm font-bold text-slate-200 block">{m.model_name.replace("_", " ")}</span>
                        {i === 0 && <span className="text-[8px] text-green-400 font-bold uppercase">Best Performer</span>}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-black text-white">{m.accuracy}%</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-bold text-slate-300">{m.precision}%</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-bold text-slate-300">{m.recall}%</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-bold text-slate-300">{m.f1_score}%</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-xs font-mono text-slate-400">{m.training_time_sec?.toFixed(1)}s</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter bg-green-500/10 text-green-400 border border-green-500/20">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card Component ───────────────────────────
function StatCard({ icon, label, value, subValue, color }) {
  const colorClasses = {
    blue: "from-blue-500/10 to-transparent border-blue-500/20",
    green: "from-green-500/10 to-transparent border-green-500/20",
    purple: "from-purple-500/10 to-transparent border-purple-500/20",
    orange: "from-orange-500/10 to-transparent border-orange-500/20",
  };

  return (
    <div className={`glass-panel p-5 rounded-2xl flex items-center justify-between border ${colorClasses[color]} bg-gradient-to-br transition-transform hover:scale-[1.02] cursor-default`}>
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-xl font-black text-white">{value}</h4>
        </div>
        {subValue && <span className="text-[10px] text-slate-400 font-medium">{subValue}</span>}
      </div>
      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
        {icon}
      </div>
    </div>
  );
}

// ─── Metric Line Component ────────────────────────
function MetricLine({ label, value, color }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase">
        <span>{label}</span>
        <span style={{ color }}>{value}%</span>
      </div>
      <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${value}%`, backgroundColor: color, opacity: 0.7 }} />
      </div>
    </div>
  );
}
