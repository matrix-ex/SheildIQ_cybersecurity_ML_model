import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Predict from "./pages/Predict";
import Models from "./pages/Models";
import History from "./pages/History";
import AlertsPage from "./pages/AlertsPage";
import SafeZone from "./pages/SafeZone";
import PreventionPage from "./pages/PreventionPage";
import DEVChat from "./components/DEVChat";
import { getMe } from "./services/api";

/* Wrapper: protects dashboard routes — redirects to /login if not authenticated */
function ProtectedRoute({ user, children }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem("vaulto_token");
    if (token) {
      getMe()
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("vaulto_token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("vaulto_token");
    setUser(null);
  };

  // Public pages (no sidebar/header)
  const isPublicPage = ["/welcome", "/login"].includes(location.pathname);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Initializing VAULTO...</p>
      </div>
    );
  }

  // Public routes: Landing + Login
  if (isPublicPage) {
    return (
      <Routes>
        <Route path="/welcome" element={<Landing />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
      </Routes>
    );
  }

  // Dashboard shell with sidebar + header
  return (
    <ProtectedRoute user={user}>
      <div className="app-shell">
        <div className="mx-auto flex min-h-screen max-w-[1600px]">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex min-w-0 flex-1 flex-col">
            <Header
              user={user}
              onMenuClick={() => setSidebarOpen((prev) => !prev)}
              onLogout={handleLogout}
            />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/prediction" element={<Predict />} />
                <Route path="/predict" element={<Navigate to="/prediction" />} />
                <Route path="/safezone" element={<SafeZone />} />
                <Route path="/safe-zone" element={<Navigate to="/safezone" />} />
                <Route path="/prevention" element={<PreventionPage />} />
                <Route path="/models" element={<Models />} />
                <Route path="/logs" element={<History />} />
                <Route path="/history" element={<Navigate to="/logs" />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </div>
        <DEVChat />
      </div>
    </ProtectedRoute>
  );
}
