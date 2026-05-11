import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getAlertStats, getAlerts, triageAlert } from "../api/alerts";

const RULES = [
  {
    attack_class: 0,
    attack_type: "Normal",
    severity: "none",
    action: "ALLOW",
    timeout: 0,
    prevention_actions: ["Passive monitoring only", "No enforcement required"],
  },
  {
    attack_class: 1,
    attack_type: "Brute Force",
    severity: "high",
    action: "RATE_LIMIT",
    timeout: 1800,
    prevention_actions: [
      "Account lockout after 5 fails",
      "IP rate limiting (max 10 req/min)",
      "CAPTCHA triggered",
      "MFA enforcement",
    ],
  },
  {
    attack_class: 2,
    attack_type: "Dictionary Attack",
    severity: "high",
    action: "RATE_LIMIT",
    timeout: 1800,
    prevention_actions: [
      "Account lockout after 5 fails",
      "IP rate limiting (max 10 req/min)",
      "CAPTCHA triggered",
      "MFA enforcement",
    ],
  },
  {
    attack_class: 3,
    attack_type: "DoS",
    severity: "critical",
    action: "DROP_CONNECTION",
    timeout: 3600,
    prevention_actions: [
      "Rate limiting per source IP",
      "Auto-block offending IP",
      "Connection timeout reduction",
      "Traffic shaping/throttling",
    ],
  },
  {
    attack_class: 4,
    attack_type: "DDoS",
    severity: "critical",
    action: "DROP_CONNECTION",
    timeout: 7200,
    prevention_actions: [
      "CDN/DDoS mitigation activation",
      "Traffic scrubbing at edge",
      "Auto-scaling infrastructure",
      "GeoIP blocking",
    ],
  },
  {
    attack_class: 5,
    attack_type: "SYN Flood",
    severity: "critical",
    action: "DROP_CONNECTION",
    timeout: 3600,
    prevention_actions: [
      "SYN cookies enabled",
      "Rate limit SYN packets per IP",
      "Half-open timeout reduced to 10s",
    ],
  },
  {
    attack_class: 6,
    attack_type: "Port Scan",
    severity: "medium",
    action: "RATE_LIMIT",
    timeout: 900,
    prevention_actions: [
      "Rate limiting per source IP",
      "Auto-block offending IP",
      "Connection timeout reduction",
      "Traffic shaping/throttling",
    ],
  },
  {
    attack_class: 7,
    attack_type: "SQL Injection",
    severity: "critical",
    action: "BLOCK_AND_LOG",
    timeout: 7200,
    prevention_actions: [
      "Parameterized queries enforced",
      "WAF rule activation",
      "Input validation (whitelist)",
      "Error message suppression",
    ],
  },
  {
    attack_class: 8,
    attack_type: "XSS",
    severity: "high",
    action: "BLOCK_AND_LOG",
    timeout: 7200,
    prevention_actions: [
      "Content Security Policy (CSP)",
      "Output encoding/escaping",
      "HTTPOnly cookie flag",
      "X-XSS-Protection header",
    ],
  },
  {
    attack_class: 9,
    attack_type: "R2L",
    severity: "high",
    action: "BLOCK_AND_LOG",
    timeout: 3600,
    prevention_actions: [
      "Account lockout after 5 fails",
      "IP rate limiting (max 10 req/min)",
      "CAPTCHA triggered",
      "MFA enforcement",
    ],
  },
  {
    attack_class: 10,
    attack_type: "Botnet",
    severity: "critical",
    action: "QUARANTINE",
    timeout: 86400,
    prevention_actions: [
      "C2 server IP/domain blocking",
      "DNS sinkholing",
      "Host isolation/quarantine",
      "Egress filtering",
    ],
  },
];

const STATUS_STORAGE_KEY = "vaulto_prevention_rule_status";

const severityClasses = {
  critical: "bg-red-50",
  high: "bg-orange-50",
  medium: "bg-amber-50",
  none: "bg-emerald-50",
};

function formatTimeout(seconds) {
  if (!seconds) {
    return "0s";
  }
  const hour = Math.floor(seconds / 3600);
  const min = Math.floor((seconds % 3600) / 60);
  if (hour > 0 && min > 0) {
    return `${hour}h ${min}m`;
  }
  if (hour > 0) {
    return `${hour}h`;
  }
  return `${min}m`;
}

function timeAgo(dateValue) {
  const sec = Math.max(1, Math.floor((Date.now() - new Date(dateValue).getTime()) / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}h ago`;
  return `${Math.floor(hour / 24)}d ago`;
}

function StatCard({ title, value }) {
  return (
    <div className="surface-card p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{title}</p>
      <p className="mt-1 text-2xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

export default function PreventionPage() {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [expandedRule, setExpandedRule] = useState(null);
  const [ruleStatus, setRuleStatus] = useState({});
  const [triageModal, setTriageModal] = useState({ open: false, alert: null });
  const [triageBy, setTriageBy] = useState("admin");
  const [triaging, setTriaging] = useState(false);

  const load = async () => {
    try {
      const [statsRes, alertsRes] = await Promise.all([
        getAlertStats(),
        getAlerts({ limit: 100 }),
      ]);
      setStats(statsRes.data || null);
      const list = Array.isArray(alertsRes.data) ? alertsRes.data : [];
      setAlerts(list.filter((item) => item.action !== "ALLOW").slice(0, 10));
    } catch {
      setStats(null);
      setAlerts([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STATUS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          setRuleStatus(parsed);
          return;
        }
      }
    } catch {
      // ignore bad storage data
    }

    const defaults = {};
    RULES.forEach((rule) => {
      defaults[rule.attack_class] = "Active";
    });
    setRuleStatus(defaults);
  }, []);

  useEffect(() => {
    if (Object.keys(ruleStatus).length > 0) {
      localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(ruleStatus));
    }
  }, [ruleStatus]);

  const statValues = useMemo(() => {
    const byAction = stats?.by_action || {};
    const totalBlocked =
      Number(byAction.DROP_CONNECTION || 0) +
      Number(byAction.BLOCK_AND_LOG || 0) +
      Number(byAction.QUARANTINE || 0);

    return {
      totalBlocked,
      rateLimited: Number(byAction.RATE_LIMIT || 0),
      quarantined: Number(byAction.QUARANTINE || 0),
      flagged: Number(byAction.FLAG_FOR_REVIEW || 0),
    };
  }, [stats]);

  const toggleRuleStatus = (attackClass) => {
    setRuleStatus((prev) => ({
      ...prev,
      [attackClass]: prev[attackClass] === "Paused" ? "Active" : "Paused",
    }));
  };

  const handleTriage = async (status) => {
    if (!triageModal.alert) {
      return;
    }

    setTriaging(true);
    try {
      await triageAlert(triageModal.alert._id, {
        status,
        triaged_by: triageBy || "admin",
      });
      setTriageModal({ open: false, alert: null });
      await load();
    } finally {
      setTriaging(false);
    }
  };

  return (
    <div className="space-y-6 animate-subtle-up">
      <section className="surface-card p-6">
        <p className="section-title">Prevention Engine</p>
        <h2 className="mt-1 text-2xl font-extrabold text-slate-900">Automated countermeasures for all 11 attack classes</h2>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="TOTAL BLOCKED" value={statValues.totalBlocked} />
        <StatCard title="RATE LIMITED" value={statValues.rateLimited} />
        <StatCard title="QUARANTINED" value={statValues.quarantined} />
        <StatCard title="FLAGGED FOR REVIEW" value={statValues.flagged} />
      </section>

      <section className="surface-card p-5">
        <h3 className="text-lg font-bold text-slate-900">Prevention Rules Table</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                <th className="py-2.5 pr-2">Attack Type</th>
                <th className="py-2.5 px-2">Severity</th>
                <th className="py-2.5 px-2">Action</th>
                <th className="py-2.5 px-2">Timeout</th>
                <th className="py-2.5 px-2">Status</th>
                <th className="py-2.5 pl-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {RULES.map((rule) => {
                const expanded = expandedRule === rule.attack_class;
                return (
                  <>
                    <tr key={rule.attack_class} className={`${severityClasses[rule.severity] || "bg-white"} border-b border-slate-200`}>
                      <td className="py-3 pr-2 text-sm font-semibold text-slate-900">{rule.attack_type}</td>
                      <td className="py-3 px-2 text-sm capitalize text-slate-700">{rule.severity}</td>
                      <td className="py-3 px-2 text-sm font-semibold text-slate-700">{rule.action}</td>
                      <td className="py-3 px-2 text-sm text-slate-700">{formatTimeout(rule.timeout)}</td>
                      <td className="py-3 px-2">
                        <button
                          type="button"
                          onClick={() => toggleRuleStatus(rule.attack_class)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            ruleStatus[rule.attack_class] === "Paused"
                              ? "bg-slate-300 text-slate-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {ruleStatus[rule.attack_class] || "Active"}
                        </button>
                      </td>
                      <td className="py-3 pl-2">
                        <button
                          type="button"
                          onClick={() => setExpandedRule(expanded ? null : rule.attack_class)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600"
                        >
                          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />} Expand
                        </button>
                      </td>
                    </tr>
                    {expanded && (
                      <tr className="border-b border-slate-200 bg-white">
                        <td colSpan={6} className="px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Prevention Actions</p>
                          <ul className="mt-2 space-y-1 text-sm text-slate-700">
                            {rule.prevention_actions.map((action, idx) => (
                              <li key={`${rule.attack_class}-${idx}`}>• {action}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="surface-card p-5">
        <h3 className="text-lg font-bold text-slate-900">Recent Prevention Actions</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                <th className="py-2.5 pr-2">Time</th>
                <th className="py-2.5 px-2">IP</th>
                <th className="py-2.5 px-2">Attack</th>
                <th className="py-2.5 px-2">Action Taken</th>
                <th className="py-2.5 px-2">Status</th>
                <th className="py-2.5 pl-2">Triage</th>
              </tr>
            </thead>
            <tbody>
              {alerts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-sm text-slate-500">
                    No prevention actions recorded yet.
                  </td>
                </tr>
              )}
              {alerts.map((alert) => (
                <tr key={alert._id} className="border-b border-slate-200 last:border-b-0">
                  <td className="py-3 pr-2 text-sm text-slate-700">{timeAgo(alert.createdAt)}</td>
                  <td className="py-3 px-2 text-sm text-slate-700">{alert.source_ip}</td>
                  <td className="py-3 px-2 text-sm font-semibold text-slate-800">{alert.attack_label}</td>
                  <td className="py-3 px-2 text-sm text-slate-700">{alert.action}</td>
                  <td className="py-3 px-2 text-sm capitalize text-slate-700">{alert.status}</td>
                  <td className="py-3 pl-2">
                    <button
                      type="button"
                      className="btn-secondary px-3 py-1.5 text-xs"
                      onClick={() => setTriageModal({ open: true, alert })}
                    >
                      Triage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {triageModal.open && triageModal.alert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="surface-card w-full max-w-md p-5">
            <h4 className="text-lg font-bold text-slate-900">Triage Alert</h4>
            <p className="mt-1 text-sm text-slate-600">
              {triageModal.alert.attack_label} • {triageModal.alert.source_ip}
            </p>

            <div className="mt-4">
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Triaged By
              </label>
              <input
                value={triageBy}
                onChange={(event) => setTriageBy(event.target.value)}
                className="app-input"
                placeholder="admin"
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                className="btn-primary"
                disabled={triaging}
                onClick={() => handleTriage("mitigated")}
              >
                Mark Mitigated
              </button>
              <button
                className="btn-secondary"
                disabled={triaging}
                onClick={() => handleTriage("dismissed")}
              >
                Dismiss
              </button>
              <button
                className="btn-secondary"
                disabled={triaging}
                onClick={() => setTriageModal({ open: false, alert: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
