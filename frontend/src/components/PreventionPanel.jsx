import { ShieldCheck, ShieldAlert, Clock3, AlertTriangle } from "lucide-react";

const ACTION_STYLES = {
  ALLOW: "bg-emerald-100 text-emerald-700",
  RATE_LIMIT: "bg-amber-100 text-amber-700",
  DROP_CONNECTION: "bg-red-100 text-red-700",
  BLOCK_AND_LOG: "bg-orange-100 text-orange-700",
  QUARANTINE: "bg-red-100 text-red-700",
  FLAG_FOR_REVIEW: "bg-slate-200 text-slate-700",
};

function formatTimeout(seconds) {
  const value = Number(seconds || 0);
  if (!value) {
    return "0s";
  }
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  return `${minutes}m`;
}

export default function PreventionPanel({ prevention, prediction, onSaveAlert, saving = false }) {
  if (!prevention) {
    return null;
  }

  const confidencePercent = (() => {
    const raw = Number(prediction?.confidence || prevention?.confidence || 0);
    return raw > 1 ? raw : raw * 100;
  })();

  const attackLabel =
    prediction?.prediction_label ||
    prediction?.attack_name ||
    prevention?.attack_label ||
    "Normal";

  const actionStyle = ACTION_STYLES[prevention.action] || "bg-slate-200 text-slate-700";

  return (
    <section className="surface-card mt-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            {prevention.action === "ALLOW" ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Prevention Engine</p>
            <h3 className="text-lg font-bold text-slate-900">Action: {prevention.action}</h3>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${actionStyle}`}>
          {attackLabel}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
        <div className="surface-card-soft p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">Severity</p>
          <p className="mt-1 text-base font-bold capitalize text-slate-900">{prevention.severity}</p>
        </div>
        <div className="surface-card-soft p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">Confidence</p>
          <p className="mt-1 text-base font-bold text-slate-900">{confidencePercent.toFixed(1)}%</p>
        </div>
        <div className="surface-card-soft p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">Timeout</p>
          <p className="mt-1 inline-flex items-center gap-1 text-base font-bold text-slate-900">
            <Clock3 size={14} />
            {formatTimeout(prevention.timeout)}
          </p>
        </div>
        <div className="surface-card-soft p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">Model</p>
          <p className="mt-1 text-base font-bold text-slate-900">{prediction?.model_used || "XGBoost"}</p>
        </div>
      </div>

      <div className="surface-card-soft mt-4 p-3.5">
        <p className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          <AlertTriangle size={12} /> Reason
        </p>
        <p className="mt-1.5 text-sm text-slate-700">{prevention.reason}</p>
      </div>

      <div className="surface-card-soft mt-4 p-3.5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Prevention Actions Applied</p>
        {Array.isArray(prevention.prevention_actions) && prevention.prevention_actions.length > 0 ? (
          <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
            {prevention.prevention_actions.map((action, index) => (
              <li key={`${action}-${index}`}>• {action}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-600">No additional prevention actions required.</p>
        )}
      </div>

      {onSaveAlert && (
        <button
          type="button"
          onClick={onSaveAlert}
          disabled={saving}
          className="btn-primary mt-4 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving Alert..." : "Save as Alert"}
        </button>
      )}
    </section>
  );
}
