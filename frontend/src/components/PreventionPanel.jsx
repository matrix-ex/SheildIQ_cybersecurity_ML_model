import { useState } from "react";
import { ShieldCheck, ShieldAlert, AlertTriangle, Clock, Zap, Eye } from "lucide-react";

const ACTION_COLORS = {
  DROP_CONNECTION: { bg: "rgba(255,68,68,0.15)", border: "#ff4444", text: "#ff4444", label: "DROP CONNECTION" },
  QUARANTINE:      { bg: "rgba(255,68,68,0.15)", border: "#ff4444", text: "#ff4444", label: "QUARANTINE" },
  BLOCK_AND_LOG:   { bg: "rgba(255,107,53,0.15)", border: "#ff6b35", text: "#ff6b35", label: "BLOCK & LOG" },
  RATE_LIMIT:      { bg: "rgba(255,170,0,0.15)", border: "#ffaa00", text: "#ffaa00", label: "RATE LIMIT" },
  FLAG_FOR_REVIEW: { bg: "rgba(124,58,237,0.15)", border: "#7c3aed", text: "#7c3aed", label: "FLAG FOR REVIEW" },
  ALLOW:           { bg: "rgba(0,255,136,0.15)", border: "#00ff88", text: "#00ff88", label: "ALLOW" },
};

function formatTimeout(seconds) {
  if (!seconds || seconds === 0) return "None";
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
  return `${mins} min${mins > 1 ? "s" : ""}`;
}

function getConfidenceColor(conf) {
  if (conf >= 90) return "#00ff88";
  if (conf >= 75) return "#ffaa00";
  return "#ff4444";
}

export default function PreventionPanel({ prevention, prediction, onSaveAlert, saving }) {
  if (!prevention) return null;

  const actionStyle = ACTION_COLORS[prevention.action] || ACTION_COLORS.ALLOW;
  const confidence = prediction?.confidence || 0;
  const isAllow = prevention.action === "ALLOW";
  const isReview = prevention.action === "FLAG_FOR_REVIEW";

  return (
    <div
      className="rounded-2xl p-6 mt-6 border backdrop-blur-md transition-all duration-500 animate-fadeIn"
      style={{
        background: isAllow
          ? "linear-gradient(135deg, rgba(0,255,136,0.05), rgba(0,212,255,0.03))"
          : `linear-gradient(135deg, ${actionStyle.bg}, rgba(10,10,26,0.8))`,
        borderColor: isAllow ? "rgba(0,255,136,0.2)" : `${actionStyle.border}33`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {isAllow ? (
            <div className="p-2 rounded-lg" style={{ background: "rgba(0,255,136,0.15)" }}>
              <ShieldCheck size={22} color="#00ff88" />
            </div>
          ) : isReview ? (
            <div className="p-2 rounded-lg" style={{ background: "rgba(124,58,237,0.15)" }}>
              <Eye size={22} color="#7c3aed" />
            </div>
          ) : (
            <div className="p-2 rounded-lg" style={{ background: actionStyle.bg }}>
              <ShieldAlert size={22} color={actionStyle.text} />
            </div>
          )}
          <div>
            <h3 className="text-white font-bold text-lg">
              {isAllow ? "Traffic Safe" : "Prevention Action Triggered"}
            </h3>
            <p className="text-slate-400 text-sm">
              {isAllow ? "No threats detected" : prediction?.attack_name || "Unknown threat"}
            </p>
          </div>
        </div>

        {/* Action Badge */}
        <span
          className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border"
          style={{
            background: actionStyle.bg,
            borderColor: actionStyle.border,
            color: actionStyle.text,
          }}
        >
          {actionStyle.label}
        </span>
      </div>

      {/* Allow → simplified green banner */}
      {isAllow && (
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "rgba(0,255,136,0.08)" }}>
          <ShieldCheck size={40} color="#00ff88" className="opacity-60" />
          <div>
            <p className="text-emerald-300 font-semibold">All Clear</p>
            <p className="text-slate-400 text-sm">
              This traffic pattern matches normal behavior. No prevention actions needed.
            </p>
          </div>
        </div>
      )}

      {/* Threat details */}
      {!isAllow && (
        <>
          {/* Reason */}
          <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/5">
            <p className="text-slate-300 text-sm leading-relaxed">
              <AlertTriangle size={14} className="inline mr-1 -mt-0.5" style={{ color: actionStyle.text }} />
              {prevention.reason}
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {/* Confidence */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Confidence</p>
              <p className="text-xl font-bold" style={{ color: getConfidenceColor(confidence) }}>
                {confidence.toFixed(1)}%
              </p>
            </div>
            {/* Severity */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Severity</p>
              <p className="text-xl font-bold capitalize" style={{ color: actionStyle.text }}>
                {prevention.severity}
              </p>
            </div>
            {/* Timeout */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Timeout</p>
              <p className="text-xl font-bold text-white flex items-center justify-center gap-1">
                <Clock size={14} className="text-slate-400" />
                {formatTimeout(prevention.timeout)}
              </p>
            </div>
            {/* Model */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Model</p>
              <p className="text-xl font-bold text-cyan-400 flex items-center justify-center gap-1">
                <Zap size={14} />
                {prediction?.model_used || "XGBoost"}
              </p>
            </div>
          </div>

          {/* Flag for Review banner */}
          {isReview && (
            <div className="mb-4 p-3 rounded-xl border" style={{ background: "rgba(124,58,237,0.08)", borderColor: "rgba(124,58,237,0.2)" }}>
              <p className="text-purple-300 text-sm">
                <Eye size={14} className="inline mr-1 -mt-0.5" />
                Low confidence detection — this alert requires manual review before enforcement.
              </p>
            </div>
          )}

          {/* Save as Alert button */}
          {onSaveAlert && (
            <button
              onClick={onSaveAlert}
              disabled={saving}
              className="w-full py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all duration-300 border"
              style={{
                background: saving ? "rgba(255,255,255,0.05)" : actionStyle.bg,
                borderColor: saving ? "rgba(255,255,255,0.1)" : actionStyle.border,
                color: saving ? "#94a3b8" : actionStyle.text,
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Saving..." : "✓ Alert Saved to Dashboard"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
