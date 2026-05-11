import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDownRight, ArrowUpRight, Flame, Shield, Siren, Zap } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getAlertStats, getAlerts } from "../api/alerts";
import { getMonitoredSites } from "../api/safezone";
import DEVChat from "../components/DEVChat";

const ATTACK_CLASSES = [
  "Normal",
  "Brute Force",
  "Dictionary Attack",
  "DoS",
  "DDoS",
  "SYN Flood",
  "Port Scan",
  "SQL Injection",
  "XSS",
  "R2L",
  "Botnet",
];

const SEVERITY_COLORS = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#f59e0b",
  none: "#10b981",
};

function relativeTime(dateValue) {
  if (!dateValue) {
    return "just now";
  }
  const ms = Date.now() - new Date(dateValue).getTime();
  const sec = Math.max(1, Math.floor(ms / 1000));
  if (sec < 60) {
    return `${sec} sec ago`;
  }
  const min = Math.floor(sec / 60);
  if (min < 60) {
    return `${min} min ago`;
  }
  const hr = Math.floor(min / 60);
  if (hr < 24) {
    return `${hr} hr ago`;
  }
  return `${Math.floor(hr / 24)} day ago`;
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [statsRes, alertsRes, sitesRes] = await Promise.all([
          getAlertStats(),
          getAlerts({ limit: 200 }),
          getMonitoredSites(),
        ]);

        if (cancelled) {
          return;
        }

        setStats(statsRes.data || null);
        setAlerts(Array.isArray(alertsRes.data) ? alertsRes.data : []);
        setSites(Array.isArray(sitesRes.data) ? sitesRes.data : []);
      } catch {
        if (!cancelled) {
          setStats(null);
          setAlerts([]);
          setSites([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    const timer = setInterval(load, 30000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  const timelineData = useMemo(() => {
    const mitigatedByHour = new Array(24).fill(0);
    alerts.forEach((alert) => {
      if (alert.status === "mitigated") {
        const hour = new Date(alert.createdAt).getHours();
        mitigatedByHour[hour] += 1;
      }
    });

    const detectedByHour = Array.isArray(stats?.threats_by_hour)
      ? stats.threats_by_hour
      : new Array(24).fill(0);

    return new Array(24).fill(0).map((_, hour) => ({
      hour: String(hour).padStart(2, "0"),
      detected: detectedByHour[hour] || 0,
      mitigated: mitigatedByHour[hour] || 0,
    }));
  }, [alerts, stats]);

  const attackBreakdown = useMemo(() => {
    const mapped = ATTACK_CLASSES.map((name) => ({
      label: name,
      count: 0,
      severity: "none",
      color: SEVERITY_COLORS.none,
    }));

    const severityRank = { none: 0, medium: 1, high: 2, critical: 3 };

    alerts.forEach((alert) => {
      const idx = Number(alert.attack_class);
      if (!Number.isInteger(idx) || idx < 0 || idx >= mapped.length) {
        return;
      }
      mapped[idx].count += 1;
      if (severityRank[alert.severity] > severityRank[mapped[idx].severity]) {
        mapped[idx].severity = alert.severity;
        mapped[idx].color = SEVERITY_COLORS[alert.severity] || SEVERITY_COLORS.none;
      }
    });

    return mapped.filter((item) => item.count > 0).sort((a, b) => b.count - a.count);
  }, [alerts]);

  const recentThreats = useMemo(
    () => alerts.filter((alert) => alert.action !== "ALLOW").slice(0, 5),
    [alerts]
  );

  const averageResponse = useMemo(() => {
    const resolved = alerts.filter((alert) => alert.triaged_at && alert.createdAt);
    if (!resolved.length) {
      return 0;
    }
    const totalMs = resolved.reduce((sum, alert) => {
      const diff = new Date(alert.triaged_at).getTime() - new Date(alert.createdAt).getTime();
      return sum + Math.max(0, diff);
    }, 0);
    return Math.round(totalMs / resolved.length / 1000 / 60);
  }, [alerts]);

  const openCount = Number(stats?.open || 0);

  if (loading) {
    return (
      <div className="surface-card p-14 text-center">
        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
        <p className="text-sm text-slate-500">Loading network risk intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="surface-card p-6">
        <p className="section-title">Overview</p>
        <h2 className="mt-1 text-2xl font-extrabold text-slate-900">Network Risk Intelligence</h2>
        <p className="mt-1 text-sm text-slate-600">Real-time threat monitoring and prevention status.</p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Shield size={16} />}
          title="PROTECTED"
          value={openCount > 0 ? "NO" : "YES"}
          subtitle={openCount > 0 ? "Action required" : "Protected and Monitoring"}
          trend={openCount > 0 ? "down" : "up"}
        />
        <StatCard
          icon={<Siren size={16} />}
          title="OPEN ALERTS"
          value={openCount}
          subtitle="Pending triage"
          trend={openCount > 0 ? "up" : "down"}
          dangerGlow={openCount > 0}
        />
        <StatCard
          icon={<Flame size={16} />}
          title="THREATS 24H"
          value={Number(stats?.threats_last_24h || 0)}
          subtitle="Last rolling day"
          trend={(stats?.threats_last_24h || 0) > 0 ? "up" : "down"}
        />
        <StatCard
          icon={<Zap size={16} />}
          title="AVG RESPONSE TIME"
          value={`${averageResponse} min`}
          subtitle="From detection to triage"
          trend={averageResponse <= 15 ? "down" : "up"}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-10">
        <div className="surface-card p-5 xl:col-span-7">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900">Attack Activity — Last 24 Hours</h3>
          </div>
          <div className="h-[290px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="hour" tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="detected" stroke="#ef4444" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="mitigated" stroke="#10b981" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface-card p-5 xl:col-span-3">
          <h3 className="text-lg font-bold text-slate-900">Threat Distribution</h3>
          <div className="mt-4 h-[290px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attackBreakdown} layout="vertical" margin={{ left: 10, right: 10 }}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="label" width={95} tick={{ fill: "#475569", fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {attackBreakdown.map((item) => (
                    <Cell key={item.label} fill={item.color} />
                  ))}
                  <LabelList dataKey="count" position="right" fill="#475569" fontSize={11} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-10">
        <div className="surface-card p-5 xl:col-span-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Recent Threats</h3>
          </div>
          <div className="space-y-2.5">
            {recentThreats.length === 0 && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                No active threat events right now.
              </div>
            )}
            {recentThreats.map((alert) => (
              <div key={alert._id} className="surface-card-soft flex items-center gap-3 px-3 py-3">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: SEVERITY_COLORS[alert.severity] || "#64748b" }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{alert.attack_label}</p>
                  <p className="truncate text-xs text-slate-500">IP: {alert.source_ip}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                  {alert.action}
                </span>
                <span className="text-xs text-slate-500">{relativeTime(alert.createdAt)}</span>
                <Link to="/alerts" className="btn-secondary px-3 py-1.5 text-xs">
                  View
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <Link to="/alerts" className="text-sm font-semibold text-slate-700 underline underline-offset-2">
              View All Alerts
            </Link>
          </div>
        </div>

        <div className="surface-card p-5 xl:col-span-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Monitored Sites</h3>
            <Link to="/safezone" className="btn-primary px-3 py-1.5 text-xs">
              Add Site
            </Link>
          </div>
          <div className="space-y-2.5">
            {sites.length === 0 && (
              <p className="text-sm text-slate-500">No Safe Zone sites configured yet.</p>
            )}
            {sites.map((site) => {
              const hasThreat = Number(site.total_threats || 0) > 0;
              return (
                <div key={site._id} className="surface-card-soft px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: hasThreat ? "#ef4444" : "#10b981" }}
                    />
                    <p className="truncate text-sm font-semibold text-slate-900">{site.url}</p>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Last checked: {relativeTime(site.last_checked)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <DEVChat embedded />
      </section>
    </div>
  );
}

function StatCard({ title, value, subtitle, trend = "up", icon, dangerGlow = false }) {
  return (
    <div className={`surface-card p-4 ${dangerGlow ? "ring-2 ring-red-200" : ""}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.12em] text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        </div>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
          {icon}
        </span>
      </div>
      <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
        {trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trend === "up" ? "Rising" : "Improving"}
      </div>
    </div>
  );
}
