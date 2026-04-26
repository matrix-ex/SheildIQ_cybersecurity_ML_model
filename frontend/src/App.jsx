import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Predict from "./pages/Predict";
import Models from "./pages/Models";
import History from "./pages/History";
import Login from "./pages/Login";
import { getMe } from "./services/api";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Force bypass login for UI preview
    setUser({ name: "Admin", email: "admin@vaulto.cyber", role: "admin" });
    setLoading(false);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950 cyber-grid overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/models" element={<Models />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
