import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Cpu,
  Activity,
  Globe,
  Bot,
  BarChart3,
  ArrowRight,
  ChevronRight,
  Zap,
  Lock,
  Layers,
  Shield,
  Siren,
  Flame,
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Cpu size={18} />,
      title: "5 ML Models",
      desc: "XGBoost, Random Forest, SVM, KNN & MLP — trained on 110K+ network samples across 11 attack classes.",
    },
    {
      icon: <Shield size={18} />,
      title: "Active IPS",
      desc: "Real-time WAF enforcement with auto-blocking, rate limiting, quarantine & the Three Strikes Rule.",
    },
    {
      icon: <Activity size={18} />,
      title: "Live Dashboard",
      desc: "Network risk intelligence with attack timelines, threat distribution, alert feed & auto-refresh.",
    },
    {
      icon: <Globe size={18} />,
      title: "Safe Zone Scanner",
      desc: "URL-based threat analysis with risk scoring, auto-monitoring & continuous site surveillance.",
    },
    {
      icon: <Bot size={18} />,
      title: "DEV AI Assistant",
      desc: "LLM-powered security chatbot with live alert context for threat guidance & incident response.",
    },
    {
      icon: <BarChart3 size={18} />,
      title: "Model Benchmarking",
      desc: "Side-by-side comparison of all 5 models with accuracy, precision, recall & F1-score metrics.",
    },
  ];

  const stats = [
    { icon: <ShieldCheck size={16} />, value: "99.78%", label: "DETECTION ACCURACY" },
    { icon: <Siren size={16} />, value: "11", label: "ATTACK CLASSES" },
    { icon: <Flame size={16} />, value: "110K+", label: "TRAINING SAMPLES" },
    { icon: <Zap size={16} />, value: "<50ms", label: "RESPONSE TIME" },
  ];

  return (
    <div className="app-shell" style={{ minHeight: "100vh" }}>
      {/* ─── NAV ────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 border border-slate-200 p-2.5">
              <ShieldCheck className="text-slate-700" size={20} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-semibold">
                Security Suite
              </p>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                VAULTO
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition">Features</a>
            <a href="#stats" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition">Performance</a>
            <a href="#architecture" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition">Architecture</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/login")} className="btn-secondary text-xs">Sign In</button>
            <button onClick={() => navigate("/login?register=true")} className="btn-primary text-xs gap-1.5">
              Get Started <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* ─── HERO ────────────────────────────────────── */}
        <section className="py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-600 mb-6">
            <Zap size={12} className="text-slate-500" /> Powered by Machine Learning
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08]">
            Intelligent Cybersecurity
            <br />
            <span style={{ color: "var(--accent)" }}>Attack Prediction & Prevention</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-[640px] mx-auto leading-relaxed">
            VAULTO unifies ML-based threat detection with an automated prevention engine,
            real-time monitoring dashboard, and AI-powered security assistant — all within
            a modern, cloud-deployable microservice architecture.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <button onClick={() => navigate("/login?register=true")} className="btn-primary py-3 px-6 text-sm gap-2">
              Launch Dashboard <ArrowRight size={16} />
            </button>
            <button
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-secondary py-3 px-6 text-sm gap-2"
            >
              Explore Features <ChevronRight size={16} />
            </button>
          </div>

          {/* Shield visual — using dashboard icon style */}
          <div className="mt-14 flex justify-center">
            <div className="relative h-[140px] w-[140px]">
              <div className="absolute inset-0 rounded-full border-2 border-slate-200 animate-[landing-pulse_3s_ease-in-out_infinite]" />
              <div className="absolute inset-3 rounded-full border-2 border-slate-300 animate-[landing-pulse_3s_ease-in-out_infinite_0.4s]" />
              <div className="absolute inset-6 rounded-full border-2 border-slate-400 animate-[landing-pulse_3s_ease-in-out_infinite_0.8s]" />
              <div className="absolute inset-9 rounded-full flex items-center justify-center" style={{ background: "var(--accent)" }}>
                <ShieldCheck size={40} className="text-white" />
              </div>
            </div>
          </div>
        </section>

        {/* ─── STATS (surface-card style) ──────────────── */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 -mt-4 mb-16" id="stats">
          {stats.map((s, i) => (
            <div key={i} className="surface-card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.12em] text-slate-500">{s.label}</p>
                  <p className="mt-1 text-2xl font-extrabold text-slate-900">{s.value}</p>
                </div>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
                  {s.icon}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* ─── FEATURES (surface-card grid) ────────────── */}
        <section className="mb-16" id="features">
          <div className="surface-card p-6 mb-6">
            <p className="section-title">Core Capabilities</p>
            <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
              Everything you need for intelligent network defense
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              From detection to prevention to advisory — VAULTO covers the complete cybersecurity operations lifecycle.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div key={i} className="surface-card p-5 transition-shadow hover:shadow-lg">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white mb-3">
                  {f.icon}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{f.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── ARCHITECTURE ────────────────────────────── */}
        <section className="mb-16" id="architecture">
          <div className="surface-card p-6 mb-6">
            <p className="section-title">System Design</p>
            <h2 className="mt-1 text-2xl font-extrabold text-slate-900">3-Tier Microservice Architecture</h2>
            <p className="mt-1 text-sm text-slate-600">Modular, independently scalable, and cloud-native by design.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <Layers size={20} />, title: "ML Microservice", sub: "Python • Flask • XGBoost • Scikit-Learn", tag: "Tier 1 — Intelligence" },
              { icon: <Zap size={20} />, title: "Backend API", sub: "Node.js • Express • MongoDB • JWT", tag: "Tier 2 — Orchestration" },
              { icon: <BarChart3 size={20} />, title: "React Dashboard", sub: "React 18 • Vite • Tailwind • Recharts", tag: "Tier 3 — Presentation" },
            ].map((arch, i) => (
              <div key={i} className="surface-card p-5 text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-slate-700 mx-auto mb-3">
                  {arch.icon}
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-1">{arch.title}</h3>
                <p className="text-xs text-slate-500 mb-3">{arch.sub}</p>
                <span className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-[11px] font-semibold tracking-[0.06em] text-slate-500 uppercase">
                  {arch.tag}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CTA ─────────────────────────────────────── */}
        <section className="mb-16">
          <div className="surface-card p-10 text-center" style={{ background: "var(--accent)", border: "none" }}>
            <Lock size={28} className="text-white/60 mx-auto mb-4" />
            <h2 className="text-2xl font-extrabold text-white mb-2">Ready to secure your network?</h2>
            <p className="text-sm text-white/70 mb-6">Create your account and start monitoring threats in minutes.</p>
            <button
              onClick={() => navigate("/login?register=true")}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold transition hover:bg-slate-50"
              style={{ color: "var(--accent)" }}
            >
              Get Started Free <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </div>

      {/* ─── FOOTER ──────────────────────────────────── */}
      <footer className="border-t border-slate-200 py-8 text-center">
        <div className="flex items-center justify-center gap-2 text-lg font-extrabold text-slate-900 mb-2">
          <ShieldCheck size={18} /> VAULTO
        </div>
        <p className="text-xs text-slate-500">B.Tech Major Project — Cybersecurity Attack Prediction & Prevention System</p>
        <p className="text-[11px] text-slate-400 mt-2">© 2025 VAULTO. Aman Dubey & Aryan Dev.</p>
      </footer>
    </div>
  );
}
