import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login, register } from "../services/api";
import { ShieldCheck, Mail, Lock, User, ArrowRight, Eye, EyeOff, AlertCircle, Shield, Siren, Flame } from "lucide-react";

export default function Login({ setUser }) {
  const [searchParams] = useSearchParams();
  const [isRegister, setIsRegister] = useState(searchParams.get("register") === "true");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("vaulto_token");
    if (token) navigate("/");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = isRegister ? await register(form) : await login(form);
      localStorage.setItem("vaulto_token", res.data.token);
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError("");
  };

  return (
    <div className="app-shell" style={{ minHeight: "100vh", display: "flex" }}>
      {/* ─── LEFT: Branding Panel ─────────────────────── */}
      <div className="login-brand-panel">
        <div className="login-brand-inner">
          {/* Logo — same as sidebar */}
          <div
            className="flex items-center gap-3 mb-16 cursor-pointer"
            onClick={() => navigate("/welcome")}
          >
            <div className="rounded-xl bg-white/15 p-2.5 backdrop-blur">
              <ShieldCheck size={22} className="text-white" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/60 font-semibold">
                Security Suite
              </p>
              <span className="text-xl font-extrabold text-white tracking-tight">
                VAULTO
              </span>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Intelligent
            <br />
            Cybersecurity
          </h1>
          <p className="text-sm text-white/65 leading-relaxed max-w-[320px]">
            ML-powered threat detection and automated prevention,
            deployed across a modern 3-tier microservice architecture.
          </p>

          {/* Stats — same layout as dashboard StatCards */}
          <div className="mt-12 grid grid-cols-3 gap-4">
            {[
              { icon: <Shield size={14} />, val: "99.78%", lbl: "ACCURACY" },
              { icon: <Siren size={14} />, val: "5", lbl: "ML MODELS" },
              { icon: <Flame size={14} />, val: "11", lbl: "ATTACK CLASSES" },
            ].map((s, i) => (
              <div key={i} className="rounded-xl bg-white/10 backdrop-blur p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold tracking-[0.1em] text-white/50 uppercase">{s.lbl}</span>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/15 text-white">
                    {s.icon}
                  </span>
                </div>
                <p className="text-xl font-extrabold text-white">{s.val}</p>
              </div>
            ))}
          </div>

          {/* Pulse shield */}
          <div className="absolute bottom-10 right-10 opacity-20">
            <ShieldCheck size={80} className="text-white" />
          </div>
        </div>
      </div>

      {/* ─── RIGHT: Form Panel ────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[400px]">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isRegister ? "Create your account" : "Welcome back"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {isRegister ? "Start monitoring threats in minutes" : "Sign in to your VAULTO dashboard"}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="surface-card-soft flex items-center gap-2.5 px-4 py-3 mb-5 border-red-200" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
              <AlertCircle size={16} className="text-red-500 shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-[11px] font-semibold tracking-[0.1em] text-slate-500 uppercase mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Aman Dubey"
                    autoComplete="name"
                    className="app-input pl-10"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold tracking-[0.1em] text-slate-500 uppercase mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="app-input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-[0.1em] text-slate-500 uppercase mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  minLength={6}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  className="app-input pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm gap-2 justify-center mt-2"
            >
              {loading ? (
                <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isRegister ? "Create Account" : "Sign In"}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-[0.1em]">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Toggle */}
          <button onClick={toggleMode} className="btn-secondary w-full py-2.5 text-sm justify-center">
            {isRegister ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>

          <button
            onClick={() => navigate("/welcome")}
            className="block w-full text-center text-xs text-slate-400 hover:text-slate-600 mt-4 transition"
          >
            ← Back to Landing Page
          </button>
        </div>
      </div>
    </div>
  );
}
