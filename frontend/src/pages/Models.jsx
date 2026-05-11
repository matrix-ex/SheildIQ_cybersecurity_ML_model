import { useEffect, useMemo, useState } from "react";
import { Activity, Cpu, Trophy } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Radar,
  RadarChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getModels } from "../services/api";

const COLORS = ["#115293", "#356fa6", "#4e88b7", "#6e6aa6", "#7d7b92"];

const TRAINING_DISTRIBUTION = [
  { name: "Normal", value: 10000 },
  { name: "Brute Force", value: 10000 },
  { name: "Dictionary Attack", value: 10000 },
  { name: "DoS", value: 10000 },
  { name: "DDoS", value: 10000 },
  { name: "SYN Flood", value: 10000 },
  { name: "Port Scan", value: 10000 },
  { name: "SQL Injection", value: 10000 },
  { name: "XSS", value: 10000 },
  { name: "R2L", value: 10000 },
  { name: "Botnet", value: 10000 },
];

const BEFORE_AFTER = [
  { metric: "Accuracy", before: "94.2%", after: "99.78%" },
  { metric: "Precision", before: "93.4%", after: "99.76%" },
  { metric: "Recall", before: "92.8%", after: "99.73%" },
  { metric: "F1 Score", before: "93.1%", after: "99.74%" },
  { metric: "False Positive Rate", before: "5.2%", after: "0.8%" },
];

const FEATURE_IMPORTANCE = [
  { name: "flow_bytes_per_sec", score: 0.95 },
  { name: "syn_flag_count", score: 0.92 },
  { name: "fwd_packets", score: 0.88 },
  { name: "flow_pkts_per_sec", score: 0.85 },
  { name: "active_time", score: 0.82 },
  { name: "fwd_iat_std", score: 0.79 },
  { name: "rst_flag_count", score: 0.75 },
  { name: "ack_flag_count", score: 0.72 },
  { name: "bwd_packets", score: 0.68 },
  { name: "idle_time", score: 0.65 },
];

export default function Models() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getModels()
      .then((res) => setMetrics(res.data.metrics || []))
      .catch(() => setMetrics([]))
      .finally(() => setLoading(false));
  }, []);

  const sorted = useMemo(() => [...metrics].sort((a, b) => b.accuracy - a.accuracy), [metrics]);
  const best = sorted[0];

  const avgAcc = metrics.length
    ? (metrics.reduce((sum, model) => sum + model.accuracy, 0) / metrics.length).toFixed(2)
    : "0.00";

  const avgF1 = metrics.length
    ? (metrics.reduce((sum, model) => sum + model.f1_score, 0) / metrics.length).toFixed(2)
    : "0.00";

  const barData = sorted.map((model, index) => ({
    name: model.model_name.replace("_", " "),
    accuracy: model.accuracy,
    fill: COLORS[index % COLORS.length],
  }));

  const classComparisonData = TRAINING_DISTRIBUTION.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));

  const radarData = ["accuracy", "precision", "recall", "f1_score"].map((metricKey) => {
    const entry = {
      metric: metricKey.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    };
    sorted.forEach((model) => {
      entry[model.model_name] = model[metricKey];
    });
    return entry;
  });

  if (loading) {
    return (
      <div className="surface-card p-16 text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
        <p className="text-sm text-slate-500">Loading model analytics...</p>
      </div>
    );
  }

  if (!metrics.length) {
    return (
      <div className="surface-card mx-auto max-w-2xl p-10 text-center">
        <Cpu size={44} className="mx-auto text-slate-500" />
        <h2 className="mt-4 text-2xl font-extrabold text-slate-900">No Model Metrics Available</h2>
        <p className="mt-2 text-sm text-slate-600">
          Start the Python ML microservice to load benchmark performance data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-subtle-up">
      <section className="surface-card p-6 sm:p-7">
        <p className="section-title">Model Benchmarking</p>
        <h2 className="mt-1 text-2xl font-extrabold text-slate-900">Comparative Performance Overview</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Evaluate model quality and consistency across weighted accuracy, precision, recall, and F1 score.
        </p>
      </section>

      <section className="surface-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Active Model</p>
            <p className="text-lg font-bold text-slate-900">XGBoost (Primary)</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            99.78% Accuracy
          </span>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Top Performer"
          value={best?.model_name.replace("_", " ") || "N/A"}
          note={best ? `${best.accuracy}% accuracy` : "No data"}
          icon={<Trophy size={16} />}
        />
        <MetricCard
          title="Average Accuracy"
          value={`${avgAcc}%`}
          note="Across all models"
          icon={<Activity size={16} />}
        />
        <MetricCard
          title="Average F1 Score"
          value={`${avgF1}%`}
          note="Weighted harmonic mean"
          icon={<Activity size={16} />}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="surface-card p-6">
          <h3 className="text-lg font-bold text-slate-900">Training Data Distribution</h3>
          <div className="mt-5 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={classComparisonData} dataKey="value" outerRadius={110} innerRadius={64}>
                  {classComparisonData.map((item, index) => (
                    <Cell key={item.name} fill={item.fill || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => Number(value).toLocaleString()}
                  contentStyle={{ background: "#fff", border: "1px solid #d7dee8", borderRadius: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface-card p-6">
          <h3 className="text-lg font-bold text-slate-900">Class Frequency Comparison</h3>
          <div className="mt-5 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classComparisonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6ebf2" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={110} tick={{ fill: "#6a7a8f", fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => Number(value).toLocaleString()}
                  contentStyle={{ background: "#fff", border: "1px solid #d7dee8", borderRadius: "12px" }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {classComparisonData.map((item, index) => (
                    <Cell key={item.name} fill={item.fill || COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="surface-card p-6">
          <h3 className="text-lg font-bold text-slate-900">Model Leaderboard</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                  <th className="py-2.5 pr-2">Rank</th>
                  <th className="py-2.5 px-2">Model</th>
                  <th className="py-2.5 px-2 text-right">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((model, index) => (
                  <tr key={model.model_name} className="border-b border-slate-100 last:border-b-0">
                    <td className="py-3 pr-2 text-sm font-semibold text-slate-700">#{index + 1}</td>
                    <td className="py-3 px-2 text-sm font-semibold text-slate-900">{model.model_name.replace("_", " ")}</td>
                    <td className="py-3 px-2 text-right text-sm font-semibold text-slate-800">{model.accuracy}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="surface-card p-6">
          <h3 className="text-lg font-bold text-slate-900">Feature Importance (Top 10)</h3>
          <div className="mt-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FEATURE_IMPORTANCE} layout="vertical" margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6ebf2" />
                <XAxis type="number" domain={[0, 1]} />
                <YAxis type="category" dataKey="name" width={140} tick={{ fill: "#6a7a8f", fontSize: 11 }} />
                <Tooltip formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`} />
                <Bar dataKey="score" fill="#1a1f2e" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="surface-card p-6">
        <h3 className="text-lg font-bold text-slate-900">Model Performance Table</h3>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                <th className="py-2.5 pr-2">Rank</th>
                <th className="py-2.5 px-2">Model</th>
                <th className="py-2.5 px-2 text-right">Accuracy</th>
                <th className="py-2.5 px-2 text-right">Precision</th>
                <th className="py-2.5 px-2 text-right">Recall</th>
                <th className="py-2.5 px-2 text-right">F1 Score</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((model, index) => (
                <tr key={model.model_name} className="border-b border-slate-100 last:border-b-0">
                  <td className="py-3 pr-2 text-sm font-semibold text-slate-700">#{index + 1}</td>
                  <td className="py-3 px-2 text-sm font-semibold text-slate-900">{model.model_name.replace("_", " ")}</td>
                  <td className="py-3 px-2 text-right text-sm font-semibold text-slate-800">{model.accuracy}%</td>
                  <td className="py-3 px-2 text-right text-sm text-slate-700">{model.precision}%</td>
                  <td className="py-3 px-2 text-right text-sm text-slate-700">{model.recall}%</td>
                  <td className="py-3 px-2 text-right text-sm text-slate-700">{model.f1_score}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="surface-card p-6">
          <h3 className="text-lg font-bold text-slate-900">Before vs After Optimization</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                  <th className="py-2.5 pr-2">Metric</th>
                  <th className="py-2.5 px-2">Before</th>
                  <th className="py-2.5 px-2">After</th>
                </tr>
              </thead>
              <tbody>
                {BEFORE_AFTER.map((entry) => (
                  <tr key={entry.metric} className="border-b border-slate-100 last:border-b-0">
                    <td className="py-3 pr-2 text-sm font-semibold text-slate-800">{entry.metric}</td>
                    <td className="py-3 px-2 text-sm text-slate-700">{entry.before}</td>
                    <td className="py-3 px-2 text-sm font-semibold text-emerald-700">{entry.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="surface-card p-6">
          <h3 className="text-lg font-bold text-slate-900">Metric Consistency Radar</h3>
          <div className="mt-5 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e6ebf2" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "#6a7a8f", fontSize: 11 }} />
                <PolarRadiusAxis domain={[95, 100]} tick={false} axisLine={false} />
                {sorted.map((model, index) => (
                  <Radar
                    key={model.model_name}
                    name={model.model_name.replace("_", " ")}
                    dataKey={model.model_name}
                    stroke={COLORS[index % COLORS.length]}
                    fill={COLORS[index % COLORS.length]}
                    fillOpacity={0.08}
                    strokeWidth={2}
                  />
                ))}
                <Tooltip formatter={(value) => `${value}%`} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ title, value, note, icon }) {
  return (
    <div className="surface-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="section-title">{title}</p>
          <p className="metric-value mt-1">{value}</p>
          <p className="mt-1.5 text-xs text-slate-500">{note}</p>
        </div>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
          {icon}
        </span>
      </div>
    </div>
  );
}
