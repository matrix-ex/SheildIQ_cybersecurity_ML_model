import { Link, useLocation } from "react-router-dom";
import {
  X,
  LayoutDashboard,
  Target,
  Link2,
  Shield,
  Cpu,
  History,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import AlertsBadge from "./AlertsBadge";

export default function Sidebar({ open, onClose }) {
  const location = useLocation();

  const links = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/prediction", label: "Prediction", icon: <Target size={20} /> },
    { to: "/safezone", label: "Safe Zone", icon: <Link2 size={20} /> },
    { to: "/prevention", label: "Prevention", icon: <Shield size={20} /> },
    { to: "/models", label: "Models", icon: <Cpu size={20} /> },
    { to: "/logs", label: "Logs", icon: <History size={20} /> },
    { to: "/alerts", label: "Alerts", icon: <ShieldAlert size={20} />, hasBadge: true },
  ];

  return (
    <>
      {open && (
        <button
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[1px] lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] transform border-r border-slate-200 bg-white/95 p-5 shadow-xl transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 lg:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-2.5 border border-slate-200">
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
          <button
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="space-y-1.5">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={`group flex items-center gap-3 rounded-xl border px-3.5 py-3 transition-colors ${
                  isActive
                    ? "border-slate-300 bg-slate-900 text-white"
                    : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span className={isActive ? "text-white" : "text-slate-500"}>
                  {link.icon}
                </span>
                <span className="text-sm font-semibold">{link.label}</span>
                {link.hasBadge && <AlertsBadge />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500 font-semibold mb-1.5">
            System Status
          </p>
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-sm font-semibold text-slate-700">
              Protected and Monitoring
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
