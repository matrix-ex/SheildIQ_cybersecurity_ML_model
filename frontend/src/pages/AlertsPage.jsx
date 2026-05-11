import { useEffect, useState } from "react";
import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react";
import { getAlerts, getAlertStats, triageAlert } from "../api/alerts";

const SEVERITY = {
  critical: { color: "#ef4444", bg: "#fee2e2" },
  high: { color: "#f97316", bg: "#ffedd5" },
  medium: { color: "#f59e0b", bg: "#fef3c7" },
  none: { color: "#10b981", bg: "#d1fae5" },
};

const ACTION = {
  DROP_CONNECTION: { color: "#ef4444", label: "DROP CONNECTION" },
  QUARANTINE: { color: "#ef4444", label: "QUARANTINE" },
  BLOCK_AND_LOG: { color: "#f97316", label: "BLOCK AND LOG" },
  RATE_LIMIT: { color: "#f59e0b", label: "RATE LIMIT" },
  FLAG_FOR_REVIEW: { color: "#64748b", label: "FLAG FOR REVIEW" },
  ALLOW: { color: "#10b981", label: "ALLOW" },
};

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins} mins ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hrs ago`;
  return `${Math.floor(hours / 24)} days ago`;
}

function StatCard({ label, value }) {
  return (
    <div className="surface-card px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

function FilterPill({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
        active
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-300 bg-white text-slate-700"
      }`}
    >
      {label}
    </button>
  );
}

function AlertCard({ alert, onTriage }) {
  const [triaging, setTriaging] = useState(false);

  const severity = SEVERITY[alert.severity] || SEVERITY.none;
  const action = ACTION[alert.action] || { color: "#64748b", label: alert.action || "UNKNOWN" };

  const handleTriage = async (status) => {
    setTriaging(true);
    await onTriage(alert._id, status);
    setTriaging(false);
  };

  return (
    <div className="surface-card p-5">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full px-2.5 py-1 font-semibold uppercase" style={{ color: severity.color, background: severity.bg }}>
          {alert.severity || "none"}
        </span>
        <span className="text-sm font-bold text-slate-900">{alert.attack_label}</span>
        <span className="rounded-full px-2.5 py-1 font-semibold" style={{ color: action.color, background: `${action.color}1A` }}>
          {action.label}
        </span>
        <span className="ml-auto text-xs text-slate-500">{timeAgo(alert.createdAt || new Date().toISOString())}</span>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700 md:grid-cols-3">
        <p>
          IP: <span className="font-semibold">{alert.source_ip || "0.0.0.0"}</span>
        </p>
        <p>
          Confidence: <span className="font-semibold">{((Number(alert.confidence || 0)) * 100).toFixed(1)}%</span>
        </p>
        <p>
          {alert.model_used || "XGBoost"}
        </p>
      </div>

      <p className="mt-2 text-sm text-slate-600">
        Source: {alert.triggered_by || "manual"}
        {alert.source_url ? ` -> ${alert.source_url}` : ""}
      </p>

      <p className="mt-2 text-sm text-slate-600">
        Prevention: {Array.isArray(alert.prevention_actions) && alert.prevention_actions.length > 0
          ? alert.prevention_actions.slice(0, 3).join(", ")
          : alert.reason || "No actions listed"}
      </p>

      {alert.status === "open" ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => handleTriage("mitigated")}
            disabled={triaging}
            className="btn-primary disabled:opacity-60"
          >
            <CheckCircle2 size={14} className="mr-1" /> Mitigate
          </button>
          <button
            onClick={() => handleTriage("dismissed")}
            disabled={triaging}
            className="btn-secondary disabled:opacity-60"
          >
            <XCircle size={14} className="mr-1" /> Dismiss
          </button>
        </div>
      ) : (
        <p className="mt-4 text-xs font-semibold text-slate-500">
          {alert.status === "mitigated" ? "Mitigated" : "Dismissed"}
          {alert.triaged_by ? ` by ${alert.triaged_by}` : ""}
          {alert.triaged_at ? ` • ${timeAgo(alert.triaged_at)}` : ""}
        </p>
      )}
    </div>
  );
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [triggeredByFilter, setTriggeredByFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const filters = {};
      if (statusFilter !== "all") filters.status = statusFilter;
      if (severityFilter !== "all") filters.severity = severityFilter;
      if (triggeredByFilter !== "all") filters.triggered_by = triggeredByFilter;

      const [alertsRes, statsRes] = await Promise.all([getAlerts(filters), getAlertStats()]);
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
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [statusFilter, severityFilter, triggeredByFilter]);

  const handleTriage = async (id, status) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert._id === id
          ? { ...alert, status, triaged_by: "admin", triaged_at: new Date().toISOString() }
          : alert
      )
    );

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
      fetchData();
    }
  };

  return (
    <div className="space-y-6 animate-subtle-up">
      <section className="surface-card p-6 sm:p-7">
        <p className="section-title">Alerts</p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-extrabold text-slate-900">Threat Alerts</h2>
        </div>
        <p className="mt-2 text-sm text-slate-600">
          Live SOC feed for detected attacks and automated prevention actions.
        </p>
      </section>

      {stats && (
        <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Open" value={stats.open} />
          <StatCard label="Mitigated" value={stats.mitigated} />
          <StatCard label="Dismissed" value={stats.dismissed} />
          <StatCard label="Last 24h" value={stats.threats_last_24h} />
        </section>
      )}

      <section className="surface-card p-4">
        <div className="flex flex-wrap items-center gap-2.5 text-sm font-semibold text-slate-600">
          <span>Status:</span>
          {["all", "open", "mitigated", "dismissed"].map((status) => (
            <FilterPill
              key={status}
              label={status}
              active={statusFilter === status}
              onClick={() => setStatusFilter(status)}
            />
          ))}

          <span className="ml-3">Severity:</span>
          {["all", "critical", "high", "medium"].map((severity) => (
            <FilterPill
              key={severity}
              label={severity}
              active={severityFilter === severity}
              onClick={() => setSeverityFilter(severity)}
            />
          ))}

          <span className="ml-3">Triggered By:</span>
          {["all", "safezone", "manual", "auto"].map((triggeredBy) => (
            <FilterPill
              key={triggeredBy}
              label={triggeredBy}
              active={triggeredByFilter === triggeredBy}
              onClick={() => setTriggeredByFilter(triggeredBy)}
            />
          ))}
        </div>
      </section>

      {loading ? (
        <section className="surface-card p-14 text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
          <p className="text-sm text-slate-500">Loading alerts...</p>
        </section>
      ) : alerts.length === 0 ? (
        <section className="surface-card p-14 text-center">
          <ShieldCheck size={44} className="mx-auto text-emerald-600" />
          <h3 className="mt-4 text-xl font-bold text-slate-900">All Systems Secure</h3>
          <p className="mt-2 text-sm text-slate-600">No matching alerts for the selected filters.</p>
        </section>
      ) : (
        <section className="space-y-3">
          {alerts.map((alert) => (
            <AlertCard key={alert._id} alert={alert} onTriage={handleTriage} />
          ))}
        </section>
      )}
    </div>
  );
}
