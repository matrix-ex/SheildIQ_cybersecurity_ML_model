import { useEffect, useMemo, useState } from "react";
import { Loader2, ShieldAlert, ShieldCheck, Globe, Trash2, RefreshCcw } from "lucide-react";
import {
  analyzeSafezoneUrl,
  getMonitoredSites,
  removeMonitoredSite,
  startSafezoneMonitor,
  stopSafezoneMonitor,
} from "../api/safezone";

function timeAgo(dateValue) {
  if (!dateValue) {
    return "never";
  }
  const seconds = Math.max(1, Math.floor((Date.now() - new Date(dateValue).getTime()) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hrs ago`;
  return `${Math.floor(hours / 24)} days ago`;
}

function riskBadgeClass(level) {
  if (level === "HIGH") return "bg-red-100 text-red-700";
  if (level === "MEDIUM") return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

export default function SafeZone() {
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);
  const [recentChecks, setRecentChecks] = useState([]);
  const [sites, setSites] = useState([]);
  const [autoMonitor, setAutoMonitor] = useState(false);
  const [monitorLastChecked, setMonitorLastChecked] = useState(null);
  const [threatBanner, setThreatBanner] = useState("");

  const loadSites = async () => {
    try {
      const res = await getMonitoredSites();
      const list = Array.isArray(res.data) ? res.data : [];
      setSites(list);
      const hot = list.find((item) => Number(item.total_threats || 0) > 0);
      if (hot) {
        setThreatBanner(`Threat activity detected on ${hot.url}`);
      }
    } catch {
      setSites([]);
    }
  };

  useEffect(() => {
    loadSites();
  }, []);

  useEffect(() => {
    if (!autoMonitor) {
      return undefined;
    }

    const interval = setInterval(async () => {
      await loadSites();
      setMonitorLastChecked(new Date().toISOString());
    }, 5000);

    return () => clearInterval(interval);
  }, [autoMonitor]);

  const handleAnalyze = async (targetUrl) => {
    const value = (targetUrl || urlInput).trim();
    if (!value) {
      setError("Please enter a valid URL.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await analyzeSafezoneUrl(value);
      const data = response.data;
      setReport(data);
      setUrlInput(data.url || value);

      const nextItem = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
        url: data.url || value,
        risk_level: data.risk_level || "LOW",
        checkedAt: new Date().toISOString(),
      };

      setRecentChecks((prev) => [nextItem, ...prev].slice(0, 5));
      if (!data.safe) {
        setThreatBanner(`Threat found: ${data.prediction?.prediction_label || "Unknown"} on ${data.url}`);
      }

      await loadSites();
    } catch (err) {
      setError(err.response?.data?.error || "Safe Zone analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMonitor = async () => {
    try {
      if (autoMonitor) {
        await stopSafezoneMonitor();
        setAutoMonitor(false);
        return;
      }

      const response = await startSafezoneMonitor();
      setAutoMonitor(true);
      setMonitorLastChecked(response.data?.last_checked || new Date().toISOString());
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update auto-monitor state.");
    }
  };

  const handleRemoveSite = async (id) => {
    try {
      await removeMonitoredSite(id);
      await loadSites();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to remove monitored site.");
    }
  };

  const recommendations = useMemo(() => {
    if (report?.recommendations?.length) {
      return report.recommendations;
    }

    return [
      "Enable HTTPS if not already active",
      "Review database query patterns",
      "Check error logging configuration",
    ];
  }, [report]);

  return (
    <div className="space-y-6 animate-subtle-up">
      <section className="surface-card p-6 sm:p-7">
        <p className="section-title">Safe Zone</p>
        <h2 className="mt-1 text-2xl font-extrabold text-slate-900">Website Link Risk Scanner</h2>
        <p className="mt-2 text-sm text-slate-600">
          Analyze URLs against VAULTO threat intelligence and automatically enforce prevention controls.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
          <input
            type="text"
            className="app-input"
            placeholder="https://example.com/login"
            value={urlInput}
            onChange={(event) => setUrlInput(event.target.value)}
          />
          <button
            type="button"
            className="btn-primary inline-flex items-center gap-2"
            onClick={() => handleAnalyze()}
            disabled={loading}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Analyze and Enforce
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleToggleMonitor}
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              autoMonitor ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"
            }`}
          >
            Auto-Monitor: {autoMonitor ? "ON" : "OFF"}
          </button>
          <span className="text-xs text-slate-500">
            Last checked: {monitorLastChecked ? timeAgo(monitorLastChecked) : "never"}
          </span>
        </div>

        {threatBanner && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {threatBanner}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="surface-card p-6 xl:col-span-2">
          <h3 className="text-lg font-bold text-slate-900">Detection and Prevention Report</h3>

          {!report ? (
            <div className="surface-card-soft mt-4 p-8 text-center">
              <Globe className="mx-auto text-slate-500" size={30} />
              <p className="mt-3 text-sm text-slate-600">No analysis report yet.</p>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-700">
                  RISK SCORE: <span className="text-xl font-extrabold text-slate-900">{report.risk_score}/100</span>
                </p>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${riskBadgeClass(report.risk_level)}`}>
                  {report.risk_level} RISK
                </span>
              </div>

              <hr className="my-3 border-slate-200" />

              <p className="text-sm text-slate-700">
                Predicted Attack: <span className="font-semibold">{report.prediction?.prediction_label || "Normal"}</span> ({report.prediction?.confidence_percent || "0.0"}%)
              </p>
              <p className="mt-1 text-sm text-slate-700">
                Action Taken: <span className="font-semibold">{report.prevention?.action || "ALLOW"}</span>
              </p>
              <p className="mt-1 text-sm text-slate-700">
                Timeout: <span className="font-semibold">{Math.round((Number(report.prevention?.timeout || 0) / 3600) * 10) / 10} hours</span>
              </p>

              <hr className="my-3 border-slate-200" />

              <p className="text-sm font-semibold text-slate-700">Prevention Actions Applied:</p>
              <div className="mt-2 space-y-1">
                {(report.prevention?.prevention_actions || []).map((action, index) => (
                  <p key={`${action}-${index}`} className="text-sm text-slate-700">
                    ✓ {action}
                  </p>
                ))}
              </div>

              <hr className="my-3 border-slate-200" />

              <p className="text-sm font-semibold text-slate-700">Recommendations:</p>
              <div className="mt-2 space-y-1">
                {recommendations.map((item, index) => (
                  <p key={`${item}-${index}`} className="text-sm text-slate-700">• {item}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <section className="surface-card p-5">
            <h3 className="text-lg font-bold text-slate-900">Recent Safe Zone Checks</h3>
            <div className="mt-3 space-y-2.5">
              {recentChecks.length === 0 && (
                <p className="text-sm text-slate-500">No checks yet.</p>
              )}
              {recentChecks.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleAnalyze(item.url)}
                  className="surface-card-soft w-full px-3 py-2.5 text-left"
                >
                  <p className="truncate text-sm font-semibold text-slate-900">{item.url}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${riskBadgeClass(item.risk_level)}`}>
                      {item.risk_level}
                    </span>
                    <span className="text-[11px] text-slate-500">{timeAgo(item.checkedAt)}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="surface-card p-5">
            <h3 className="text-lg font-bold text-slate-900">Monitored Sites</h3>
            <div className="mt-3 space-y-2.5">
              {sites.length === 0 && <p className="text-sm text-slate-500">No monitored sites.</p>}
              {sites.map((site) => {
                const hasThreat = Number(site.total_threats || 0) > 0;
                return (
                  <div key={site._id} className="surface-card-soft px-3 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">{site.url}</p>
                        <p className="text-[11px] text-slate-500">
                          Scans: {site.total_scans || 0} • Threats: {site.total_threats || 0}
                        </p>
                      </div>
                      <span className={`inline-flex h-2.5 w-2.5 rounded-full ${hasThreat ? "bg-red-500" : "bg-emerald-500"}`} />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">{site.status}</span>
                      <button
                        type="button"
                        onClick={() => handleAnalyze(site.url)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-600"
                      >
                        <RefreshCcw size={12} /> Re-analyze
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSite(site._id)}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-red-600"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </section>

      <section className="surface-card p-5">
        <div className="flex items-start gap-3 text-sm text-slate-600">
          {report?.safe ? <ShieldCheck size={18} className="text-emerald-600" /> : <ShieldAlert size={18} className="text-red-600" />}
          <p>
            Safe Zone keeps adaptive enforcement enabled for monitored URLs. Suspicious patterns are automatically escalated to Alerts and Prevention Engine workflows.
          </p>
        </div>
      </section>
    </div>
  );
}
