import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Activity, 
  Target, 
  Cpu, 
  History, 
  Settings, 
  ShieldCheck
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/predict", label: "Prediction", icon: <Target size={20} /> },
    { to: "/models", label: "Models", icon: <Cpu size={20} /> },
    { to: "/history", label: "Logs", icon: <History size={20} /> },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 bg-slate-950/50 backdrop-blur-xl border-r border-white/5 flex flex-col p-4 z-50">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30 neon-glow">
          <ShieldCheck className="text-blue-400" size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight text-white uppercase text-glow">
          Vaulto
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className={`${isActive ? "text-blue-400" : "group-hover:text-white"}`}>
                {link.icon}
              </span>
              <span className="font-medium text-sm">{link.label}</span>
              {isActive && (
                <div className="ml-auto w-1 h-4 bg-blue-500 rounded-full neon-glow" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-white/5">
        <p className="text-xs text-slate-500 mb-1">System Status</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse neon-glow" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Protected</span>
        </div>
      </div>
    </aside>
  );
}
