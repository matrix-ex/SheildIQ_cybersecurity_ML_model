import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

export const chatWithAgent = ({ message, conversation_history = [] }) =>
  api.post("/api/agent/chat", {
    message,
    conversation_history,
  });

export default api;
