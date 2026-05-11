const express = require("express");
const axios = require("axios");
const Alert = require("../models/Alert");

const router = express.Router();

const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY || "";
const CEREBRAS_API_URL = process.env.CEREBRAS_API_URL || "https://api.cerebras.ai/v1/chat/completions";
const CEREBRAS_MODEL = process.env.CEREBRAS_MODEL || "llama3.1-8b";

const sessionStore = new Map();
const MAX_SESSION_MESSAGES = 10;

async function getAlertContextSummary() {
  const [total, open, critical, high, medium, lastAlerts] = await Promise.all([
    Alert.countDocuments(),
    Alert.countDocuments({ status: "open" }),
    Alert.countDocuments({ severity: "critical" }),
    Alert.countDocuments({ severity: "high" }),
    Alert.countDocuments({ severity: "medium" }),
    Alert.find({}).sort({ createdAt: -1 }).limit(5),
  ]);

  const recent = lastAlerts.map((item) => ({
    attack_label: item.attack_label,
    action: item.action,
    severity: item.severity,
    source_ip: item.source_ip,
    createdAt: item.createdAt,
  }));

  return {
    total,
    open,
    by_severity: {
      critical,
      high,
      medium,
    },
    recent,
  };
}

function buildSystemPrompt(alertContext) {
  return [
    "You are DEV (Automated Response & Intelligence Agent), VAULTO's built-in cybersecurity AI assistant.",
    "You are an expert in network security, attack types, and prevention.",
    "You have knowledge of all 11 attack classes VAULTO monitors: Normal, Brute Force, Dictionary Attack, DoS, DDoS, SYN Flood, Port Scan, SQL Injection, XSS, R2L, Botnet.",
    "When asked about an attack, explain: what it is, how it works, real-world examples, severity, and how VAULTO prevents it.",
    "Keep responses concise, professional, and actionable.",
    "If user asks for urgent incident guidance, provide immediate containment, triage, and recovery steps.",
    "Current VAULTO context below includes live alert data.",
    `Live Alert Context: ${JSON.stringify(alertContext)}`,
  ].join(" ");
}

function getSessionId(req) {
  return (
    req.headers["x-session-id"] ||
    req.body?.session_id ||
    req.ip ||
    "anonymous"
  );
}

function compactHistory(history) {
  const cleaned = Array.isArray(history)
    ? history
        .filter((item) => item && typeof item.content === "string" && item.role)
        .map((item) => ({
          role: item.role === "assistant" ? "assistant" : "user",
          content: item.content,
        }))
    : [];

  return cleaned.slice(-MAX_SESSION_MESSAGES);
}

router.post("/agent/chat", async (req, res) => {
  try {
    const { message, conversation_history = [] } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Body must include a non-empty message",
      });
    }

    const sessionId = getSessionId(req);
    const priorSessionHistory = sessionStore.get(sessionId) || [];
    const clientHistory = compactHistory(conversation_history);

    const mergedHistory = [...priorSessionHistory, ...clientHistory].slice(-MAX_SESSION_MESSAGES);

    let alertContext = {
      total: 0,
      open: 0,
      by_severity: { critical: 0, high: 0, medium: 0 },
      recent: [],
    };

    try {
      alertContext = await getAlertContextSummary();
    } catch (dbErr) {
      console.warn("[DEV] Alert context unavailable:", dbErr.message);
    }

    const systemPrompt = buildSystemPrompt(alertContext);

    if (!CEREBRAS_API_KEY) {
      const fallback = "I am DEV. The Cerebras API key is not configured, so I am running in fallback mode. I can still help with VAULTO attack classes, prevention strategy, and incident response guidance.";

      const stored = [...mergedHistory, { role: "user", content: message }, { role: "assistant", content: fallback }]
        .slice(-MAX_SESSION_MESSAGES);
      sessionStore.set(sessionId, stored);

      return res.json({
        response: fallback,
        agent: "DEV",
      });
    }

    const userAssistantWindow = [
      ...mergedHistory,
      { role: "user", content: message },
    ].slice(-(MAX_SESSION_MESSAGES - 1));

    const cerebrasMessages = [
      { role: "system", content: systemPrompt },
      ...userAssistantWindow,
    ];

    const cerebrasResp = await axios.post(
      CEREBRAS_API_URL,
      {
        model: CEREBRAS_MODEL,
        max_tokens: 700,
        temperature: 0.2,
        messages: cerebrasMessages,
      },
      {
        timeout: 20000,
        headers: {
          Authorization: `Bearer ${CEREBRAS_API_KEY}`,
          "content-type": "application/json",
        },
      }
    );

    const responseText =
      cerebrasResp.data?.choices?.[0]?.message?.content?.trim() ||
      "I am DEV. I could not generate a response right now.";

    const updatedSession = [
      ...mergedHistory,
      { role: "user", content: message },
      { role: "assistant", content: responseText },
    ].slice(-MAX_SESSION_MESSAGES);

    sessionStore.set(sessionId, updatedSession);

    return res.json({
      response: responseText,
      agent: "DEV",
    });
  } catch (err) {
    const status = err.response?.status || 500;
    const details = err.response?.data || err.message;

    return res.status(status).json({
      error: "DEV request failed",
      details,
      agent: "DEV",
    });
  }
});

module.exports = router;
