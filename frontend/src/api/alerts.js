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

/**
 * Full analysis pipeline: features → ML prediction → prevention action → alert
 */
export const analyzeTraffic = (payload) =>
  api.post("/api/analyze", payload);

/**
 * Fetch alerts with optional filters
 * @param {object} filters - { status, severity, limit }
 */
export const getAlerts = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append("status", filters.status);
  if (filters.severity) params.append("severity", filters.severity);
  if (filters.limit) params.append("limit", filters.limit);
  return api.get(`/api/alerts?${params.toString()}`);
};

/**
 * Get aggregated alert statistics for dashboard
 */
export const getAlertStats = () =>
  api.get("/api/alerts/stats");

/**
 * Triage an alert (mitigate or dismiss)
 * @param {string} id - Alert MongoDB _id
 * @param {object} payload - { status: "mitigated"|"dismissed", triaged_by: "admin" }
 */
export const triageAlert = (id, payload) =>
  api.patch(`/api/alerts/${id}/triage`, payload);

/**
 * Hard delete an alert (demo reset)
 * @param {string} id - Alert MongoDB _id
 */
export const deleteAlert = (id) =>
  api.delete(`/api/alerts/${id}`);
