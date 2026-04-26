import { useState, useEffect } from "react";
import { getHistory } from "../services/api";
import { History as HistoryIcon, ShieldAlert, Cpu, Calendar, Clock, Database } from "lucide-react";

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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-white text-glow tracking-tight uppercase flex items-center gap-3">
          <Database className="text-blue-400" />
          Threat Intelligence Logs
        </h1>
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
          <Clock size={14} className="text-blue-400" />
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{predictions.length} Records</span>
        </div>
      </div>

      {predictions.length === 0 ? (
        <div className="glass-panel rounded-3xl p-16 text-center border-white/5 max-w-2xl mx-auto mt-10">
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
            <HistoryIcon size={32} className="text-slate-600" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">Archive Empty</h3>
          <p className="text-slate-500 text-sm mb-8">No historical attack data has been captured by the neural engines yet.</p>
          <a href="/predict" className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold uppercase tracking-widest transition-all neon-glow">
            Initialize Scan
          </a>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] text-slate-500 uppercase font-black tracking-widest">
                  <th className="py-5 px-6">ID</th>
                  <th className="py-5 px-6">Attack Classification</th>
                  <th className="py-5 px-6">Neural Engine</th>
                  <th className="py-5 px-6">Reliability</th>
                  <th className="py-5 px-6">Threat Level</th>
                  <th className="py-5 px-6">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {predictions.map((p, i) => (
                  <tr key={p._id || i} className="hover:bg-white/5 transition-colors group">
                    <td className="py-4 px-6 text-xs font-mono text-slate-600">
                      #{String(i + 1).padStart(3, '0')}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-slate-900 border border-white/5 text-slate-400 group-hover:text-blue-400 transition-colors">
                          <ShieldAlert size={14} />
                        </div>
                        <span className="text-sm font-bold text-slate-200">
                          {p.attack_name?.replace("_", " ")}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-white/5 border border-white/10">
                        <Cpu size={10} className="text-blue-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          {p.model_used?.split("_").map(w => w[0]).join("")}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-mono">{p.confidence?.toFixed(1)}%</span>
                        <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500/50" style={{ width: `${p.confidence}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter"
                        style={{
                          backgroundColor: (p.severity?.color || "#666") + "20",
                          color: p.severity?.color || "#666",
                          border: `1px solid ${(p.severity?.color || "#666")}30`
                        }}>
                        {p.severity?.level || "N/A"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                          <Calendar size={10} className="text-slate-500" />
                          {new Date(p.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                          <Clock size={10} />
                          {new Date(p.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
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
