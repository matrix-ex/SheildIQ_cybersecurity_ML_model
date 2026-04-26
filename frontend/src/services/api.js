import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

// Direct ML API access (bypasses backend auth)
const ML_API = axios.create({
  baseURL: "/ml",
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("vaulto_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── AUTH ────────────────────────────────────────────────
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

// ─── PREDICT ─────────────────────────────────────────────
export const predict = (features, model) =>
  API.post("/predict", { features, model });
export const predictAll = (features) =>
  API.post("/predict/all", { features });
export const getHistory = () => API.get("/predict/history");
export const getFeatures = () => API.get("/predict/features");
export const getStats = () => API.get("/predict/stats");

// ─── MODELS (with direct ML API fallback) ────────────────
export const getModels = async () => {
  // Try backend first, then fall back to direct ML API
  try {
    const res = await API.get("/predict/models");
    if (res.data?.metrics?.length) return res;
  } catch {}
  // Fallback: direct to ML API (no auth needed)
  return ML_API.get("/models");
};

export default API;
