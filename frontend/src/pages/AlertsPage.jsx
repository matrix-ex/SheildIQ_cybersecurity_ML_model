import { useState, useEffect } from "react";
import {
  ShieldCheck, ShieldAlert, AlertTriangle, Clock, Filter,
  CheckCircle, XCircle, Activity, Zap, Skull, Eye
} from "lucide-react";
import { getAlerts, getAlertStats, triageAlert } from "../api/alerts";

// ─── Helpers ────────────────────────────────────────────────
function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatTimeout(seconds) {
  if (!seconds || seconds === 0) return "None";
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
  return `${mins} min${mins > 1 ? "s" : ""}`;
}

const SEVERITY_COLORS = {
  critical: { bg: "rgba(255,68,68,0.12)", border: "#ff4444", text: "#ff4444" },
  high:     { bg: "rgba(255,107,53,0.12)", border: "#ff6b35", text: "#ff6b35" },
  medium:   { bg: "rgba(255,170,0,0.12)", border: "#ffaa00", text: "#ffaa00" },
  none:     { bg: "rgba(0,255,136,0.12)", border: "#00ff88", text: "#00ff88" },
};

const ACTION_COLORS = {
  DROP_CONNECTION: "#ff4444",
  QUARANTINE:      "#ff4444",
  BLOCK_AND_LOG:   "#ff6b35",
  RATE_LIMIT:      "#ffaa00",
  FLAG_FOR_REVIEW: "#7c3aed",
  ALLOW:           "#00ff88",
};

const ACTION_LABELS = {
  DROP_CONNECTION: "DROP",
  QUARANTINE:      "QUARANTINE",
  BLOCK_AND_LOG:   "BLOCK",
  RATE_LIMIT:      "RATE LIMIT",
  FLAG_FOR_REVIEW: "REVIEW",
  ALLOW:           "ALLOW",
};

// ─── Stat Card ──────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, glow }) {
  return (
    <div
      className="rounded-xl p-4 border backdrop-blur-md transition-all duration-300"
      style={{
        background: glow ? `linear-gradient(135deg, ${color}08, ${color}04)` : "rgba(255,255,255,0.03)",
        borderColor: glow ? `${color}33` : "rgba(255,255,255,0.06)",
        boxShadow: glow ? `0 0 20px ${color}15` : "none",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">{label}</span>
        <Icon size={16} style={{ color: glow ? color : "#475569" }} />
      </div>
      <p className="text-2xl font-bold" style={{ color: glow ? color : "#94a3b8" }}>
        {value}
      </p>
    </div>
  );
}

// ─── Filter Button ──────────────────────────────────────────
function FilterBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-all duration-200 border ${
        active
          ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
          : "bg-white/3 border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/10"
      }`}
    >
      {label}
    </button>
  );
}

// ─── Alert Card ─────────────────────────────────────────────
function AlertCard({ alert, onTriage }) {
  const [triaging, setTriaging] = useState(false);
  const sev = SEVERITY_COLORS[alert.severity] || SEVERITY_COLORS.none;
  const actionColor = ACTION_COLORS[alert.action] || "#94a3b8";
  const actionLabel = ACTION_LABELS[alert.action] || alert.action;
  const isDone = alert.status !== "open";

  const handleTriage = async (status) => {
    setTriaging(true);
    await onTriage(alert._id, status);
    setTriaging(false);
  };

  return (
    <div
      className="rounded-xl p-5 border backdrop-blur-md transition-all duration-500"
      style={{
        background: isDone
          ? "rgba(255,255,255,0.02)"
          : `linear-gradient(135deg, ${sev.bg}, rgba(10,10,26,0.6))`,
        borderColor: isDone ? "rgba(255,255,255,0.04)" : `${sev.border}25`,
        opacity: isDone ? 0.6 : 1,
      }}
    >
      {/* Row 1: Badges + time */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {/* Severity badge */}
        <span
          className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border"
          style={{ background: sev.bg, borderColor: sev.border, color: sev.text }}
        >
          {alert.severity}
        </span>
        {/* Attack label */}
        <span className="text-white font-semibold text-sm">{alert.attack_label}</span>
        {/* Action badge */}
        <span
          className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
          style={{ background: `${actionColor}18`, color: actionColor }}
        >
          {actionLabel}
        </span>
        {/* Status */}
        {isDone && (
          <span
            className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
            style={{
              background: alert.status === "mitigated" ? "rgba(0,255,136,0.1)" : "rgba(148,163,184,0.1)",
              color: alert.status === "mitigated" ? "#00ff88" : "#94a3b8",
            }}
          >
            {alert.status}
          </span>
        )}
        <span className="ml-auto text-[11px] text-slate-500">{timeAgo(alert.createdAt)}</span>
      </div>

      {/* Row 2: IP, Confidence, Model */}
      <div className="flex items-center gap-4 mb-2 text-sm">
        <span className="text-slate-400">
          IP: <span className="text-white font-mono">{alert.ip}</span>
        </span>
        <span className="text-slate-400">
          Confidence:{" "}
          <span
            className="font-bold"
            style={{ color: alert.confidence >= 0.9 ? "#00ff88" : alert.confidence >= 0.75 ? "#ffaa00" : "#ff4444" }}
          >
            {(alert.confidence * 100).toFixed(1)}%
          </span>
        </span>
        <span className="text-slate-400">
          <Zap size={12} className="inline text-cyan-400 mr-0.5" />
          {alert.model_used}
        </span>
      </div>

      {/* Row 3: Reason */}
      <p className="text-slate-400 text-sm mb-3 leading-relaxed">{alert.reason}</p>

      {/* Row 4: Timeout */}
      {alert.timeout > 0 && (
        <p className="text-slate-500 text-xs mb-3 flex items-center gap-1">
          <Clock size={12} /> Timeout: {formatTimeout(alert.timeout)}
        </p>
      )}

      {/* Row 5: Triage buttons OR triage result */}
      {alert.status === "open" ? (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTriage("mitigated")}
            disabled={triaging}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 border bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-40"
          >
            <CheckCircle size={14} /> Mitigate
          </button>
          <button
            onClick={() => handleTriage("dismissed")}
            disabled={triaging}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 border bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-40"
          >
            <XCircle size={14} /> Dismiss
          </button>
        </div>
      ) : (
        <p className="text-xs text-slate-500 flex items-center gap-1">
          {alert.status === "mitigated" ? (
            <><CheckCircle size={12} className="text-emerald-500" /> Mitigated</>
          ) : (
            <><XCircle size={12} className="text-slate-500" /> Dismissed</>
          )}
          {alert.triaged_by && <> by {alert.triaged_by}</>}
          {alert.triaged_at && <> — {timeAgo(alert.triaged_at)}</>}
        </p>
      )}
    </div>
  );
}

// ─── Alerts Page ────────────────────────────────────────────
export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const filters = {};
      if (statusFilter !== "all") filters.status = statusFilter;
      if (severityFilter !== "all") filters.severity = severityFilter;

      const [alertsRes, statsRes] = await Promise.all([
        getAlerts(filters),
        getAlertStats(),
      ]);
      setAlerts(alertsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, severityFilter]);

  const handleTriage = async (id, status) => {
    // Optimistic UI update
    setAlerts((prev) =>
      prev.map((a) =>
        a._id === id
          ? { ...a, status, triaged_by: "admin", triaged_at: new Date().toISOString() }
          : a
      )
    );
    // Update stats optimistically
    if (stats) {
      setStats((prev) => ({
        ...prev,
        open: Math.max(0, prev.open - 1),
        [status]: (prev[status] || 0) + 1,
      }));
    }

    try {
      await triageAlert(id, { status, triaged_by: "admin" });
    } catch (err) {
      console.error("Triage failed:", err);
      fetchData(); // Rollback on failure
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
          <ShieldAlert size={24} className="text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Threat Alerts</h1>
          <p className="text-slate-500 text-sm">Real-time prevention actions & alert management</p>
        </div>
      </div>

      {/* Stats Bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <StatCard label="Total" value={stats.total} icon={Activity} color="#00d4ff" glow={stats.total > 0} />
          <StatCard label="Open" value={stats.open} icon={AlertTriangle} color="#ff4444" glow={stats.open > 0} />
          <StatCard label="Mitigated" value={stats.mitigated} icon={CheckCircle} color="#00ff88" glow={stats.mitigated > 0} />
          <StatCard label="Critical" value={stats.by_severity?.critical || 0} icon={Skull} color="#ff4444" glow={(stats.by_severity?.critical || 0) > 0} />
          <StatCard label="Last 24h" value={stats.threats_last_24h} icon={Clock} color="#7c3aed" glow={stats.threats_last_24h > 0} />
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5 backdrop-blur-md">
        <Filter size={14} className="text-slate-500" />
        <span className="text-[11px] text-slate-500 uppercase tracking-wider mr-1">Status:</span>
        {["all", "open", "mitigated", "dismissed"].map((s) => (
          <FilterBtn key={s} label={s} active={statusFilter === s} onClick={() => setStatusFilter(s)} />
        ))}
        <div className="w-px h-5 bg-white/10 mx-1" />
        <span className="text-[11px] text-slate-500 uppercase tracking-wider mr-1">Severity:</span>
        {["all", "critical", "high", "medium"].map((s) => (
          <FilterBtn key={s} label={s} active={severityFilter === s} onClick={() => setSeverityFilter(s)} />
        ))}
      </div>

      {/* Alert Cards */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading alerts...</p>
        </div>
      ) : alerts.length === 0 ? (
        /* Empty state */
        <div className="text-center py-20 rounded-2xl border border-white/5 bg-white/3 backdrop-blur-md">
          <ShieldCheck size={56} className="text-emerald-500/60 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-1">All Systems Secure</h3>
          <p className="text-slate-500 text-sm">No active threats detected. Your network is clean.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert, i) => (
            <div
              key={alert._id}
              className="animate-fadeSlideUp"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <AlertCard alert={alert} onTriage={handleTriage} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
