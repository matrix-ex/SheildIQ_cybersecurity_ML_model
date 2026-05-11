import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Attach JWT if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("vaulto_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const analyzeTraffic = (payload, config = {}) => api.post("/api/analyze", payload, config);

export const getAlerts = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== "all") {
    params.append("status", filters.status);
  }
  if (filters.severity && filters.severity !== "all") {
    params.append("severity", filters.severity);
  }
  if (filters.triggered_by && filters.triggered_by !== "all") {
    params.append("triggered_by", filters.triggered_by);
  }
  if (filters.limit) {
    params.append("limit", String(filters.limit));
  }

  const query = params.toString();
  return api.get(query ? `/api/alerts?${query}` : "/api/alerts");
};

export const getAlertStats = () => api.get("/api/alerts/stats");

export const triageAlert = (id, payload) => api.patch(`/api/alerts/${id}/triage`, payload);

export const deleteAlert = (id) => api.delete(`/api/alerts/${id}`);

export default api;
