import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAlerts } from "../api/alerts";

export default function AlertsBadge() {
  const [count, setCount] = useState(0);
  const [pulse, setPulse] = useState(false);
  const prevCount = useRef(0);
  const navigate = useNavigate();

  const fetchOpenAlerts = async () => {
    try {
      const res = await getAlerts({ status: "open", limit: 1 });
      // The response is an array; use its length or check headers
      // But we need total count, so we fetch stats instead
      const statsRes = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/alerts/stats`
      );
      const stats = await statsRes.json();
      const newCount = stats.open || 0;

      // Pulse if new alerts arrived
      if (newCount > prevCount.current) {
        setPulse(true);
        setTimeout(() => setPulse(false), 2000);
      }
      prevCount.current = newCount;
      setCount(newCount);
    } catch {
      // Silently fail — badge is non-critical
    }
  };

  useEffect(() => {
    fetchOpenAlerts();
    const interval = setInterval(fetchOpenAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  if (count === 0) return null;

  return (
    <button
      onClick={() => navigate("/alerts")}
      className="relative p-1"
      title={`${count} open alert${count !== 1 ? "s" : ""}`}
    >
      <div
        className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold text-white px-1 ${
          pulse ? "animate-pulse" : ""
        }`}
        style={{
          background: "#ff4444",
          boxShadow: pulse ? "0 0 12px rgba(255,68,68,0.6)" : "0 0 6px rgba(255,68,68,0.3)",
        }}
      >
        {count > 99 ? "99+" : count}
      </div>
    </button>
  );
}
