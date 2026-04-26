import { Link, useNavigate } from "react-router-dom";
import { Shield, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("vaulto_token");
    setUser(null);
    navigate("/login");
  };

  const links = [
    { to: "/", label: "Dashboard" },
    { to: "/predict", label: "Predict" },
    { to: "/models", label: "Models" },
    { to: "/history", label: "History" },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-400">
          <Shield size={28} /> VAULTO
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {user &&
            links.map((l) => (
              <Link key={l.to} to={l.to} className="text-slate-300 hover:text-white transition">
                {l.label}
              </Link>
            ))}
          {user ? (
            <button onClick={logout} className="flex items-center gap-1 text-red-400 hover:text-red-300">
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <Link to="/login" className="text-blue-400 hover:text-blue-300">
              Login
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-slate-300" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 pb-4">
          {user &&
            links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className="block py-2 text-slate-300 hover:text-white">
                {l.label}
              </Link>
            ))}
          {user ? (
            <button onClick={logout} className="block py-2 text-red-400">Logout</button>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="block py-2 text-blue-400">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
