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
      const alertsRes = await getAlerts({ status: "open", limit: 200 });
      const newCount = Array.isArray(alertsRes.data) ? alertsRes.data.length : 0;

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

  if (count === 0) {
    return null;
  }

  return (
    <button
      onClick={() => navigate("/alerts")}
      className="relative"
      title={`${count} open alert${count !== 1 ? "s" : ""}`}
    >
      <div
        className={`ml-auto inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white ${
          pulse ? "animate-pulse" : ""
        }`}
        style={{
          background: "#b73b39",
          boxShadow: pulse ? "0 0 0 3px rgba(183,59,57,0.2)" : "none",
        }}
      >
        {count > 99 ? "99+" : count}
      </div>
    </button>
  );
}
