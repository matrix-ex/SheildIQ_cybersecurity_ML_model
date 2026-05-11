import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("vaulto_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const analyzeSafezoneUrl = (url) =>
  api.post("/api/safezone/analyze", { url });

export const getMonitoredSites = () =>
  api.get("/api/safezone/sites");

export const removeMonitoredSite = (id) =>
  api.delete(`/api/safezone/sites/${id}`);

export const startSafezoneMonitor = () =>
  api.post("/api/safezone/monitor/start");

export const stopSafezoneMonitor = () =>
  api.post("/api/safezone/monitor/stop");

export default api;
