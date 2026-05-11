import { useEffect, useState } from "react";
import { CalendarDays, Clock3, Database, ShieldAlert } from "lucide-react";
import { getHistory } from "../services/api";

export default function History() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory()
      .then((res) => setPredictions(res.data))
      .catch(() => setPredictions([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="surface-card p-16 text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
        <p className="text-sm text-slate-500">Loading historical logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-subtle-up">
      <section className="surface-card p-6 sm:p-7">
        <p className="section-title">Forensics Timeline</p>
        <div className="mt-1 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-extrabold text-slate-900">Prediction History</h2>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
            <Database size={14} /> {predictions.length} records
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-600">
          Review past classification events including model source, confidence, and recorded timestamps.
        </p>
      </section>

      {predictions.length === 0 ? (
        <section className="surface-card p-12 text-center">
          <ShieldAlert size={40} className="mx-auto text-slate-500" />
          <h3 className="mt-4 text-xl font-bold text-slate-900">No historical records yet</h3>
          <p className="mt-2 text-sm text-slate-600">Run predictions to generate forensic logs for this account.</p>
          <a href="/prediction" className="btn-primary mt-5 inline-flex">
            Open Prediction Console
          </a>
        </section>
      ) : (
        <section className="surface-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                  <th className="px-5 py-3">#</th>
                  <th className="px-5 py-3">Classification</th>
                  <th className="px-5 py-3">Model</th>
                  <th className="px-5 py-3 text-right">Confidence</th>
                  <th className="px-5 py-3 text-right">Severity</th>
                  <th className="px-5 py-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((entry, index) => (
                  <tr key={entry._id || index} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-5 py-3 text-sm font-semibold text-slate-600">{String(index + 1).padStart(2, "0")}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white">
                          <ShieldAlert size={14} />
                        </span>
                        <span className="text-sm font-semibold text-slate-900">{entry.attack_name?.replace("_", " ")}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-700">{entry.model_used?.replace("_", " ")}</td>
                    <td className="px-5 py-3 text-right text-sm font-semibold text-slate-800">{entry.confidence?.toFixed(1)}%</td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                        style={{
                          backgroundColor: `${entry.severity?.color || "#64748b"}1A`,
                          color: entry.severity?.color || "#334155",
                        }}
                      >
                        {entry.severity?.level || "N/A"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-xs text-slate-600">
                      <div className="inline-flex flex-col items-end gap-0.5">
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays size={12} /> {new Date(entry.createdAt).toLocaleDateString()}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock3 size={12} /> {new Date(entry.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
