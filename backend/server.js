const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const ApiKey = require("./models/ApiKey");
const authRoutes = require("./routes/auth");
const predictRoutes = require("./routes/predict");
const alertRoutes = require("./routes/alerts");
const safezoneRoutes = require("./routes/safezone");
const aiAgentRoutes = require("./routes/ai-agent");
const { wafMiddleware } = require("./middleware/waf");

const app = express();
const PORT = process.env.PORT || 4000;
app.set("trust proxy", true);

// CORS — allow local dev + deployed frontend
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));

// Active Enforcement Middleware (WAF)
app.use(wafMiddleware);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/predict", predictRoutes);
app.use("/api", alertRoutes);
app.use("/api", safezoneRoutes);
app.use("/api", aiAgentRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "VAULTO Backend API",
    flask_url: process.env.FLASK_URL || process.env.ML_API_URL || "http://localhost:5000",
    frontend_url: process.env.FRONTEND_URL || "http://localhost:5173",
    cerebras_configured: Boolean(process.env.CEREBRAS_API_KEY),
    environment: process.env.NODE_ENV || "development",
  });
});

async function seedDemoKey() {
  try {
    const exists = await ApiKey.findOne({ key: "nexus-bank-demo-key" });
    if (!exists) {
      await ApiKey.create({
        key: "nexus-bank-demo-key",
        label: "Nexus Bank Demo Site",
        site_url: "http://localhost:5001",
        is_active: true,
      });
      console.log("[VAULTO] Demo API key seeded: nexus-bank-demo-key");
    }
  } catch (err) {
    console.warn(`[VAULTO] Demo API key seed skipped: ${err.message}`);
  }
}

// Start server
const startServer = async () => {
  await connectDB();
  await seedDemoKey();
  app.listen(PORT, () => {
    console.log("\n" + "=".repeat(50));
    console.log("  VAULTO Backend API");
    console.log(`  Running on: http://localhost:${PORT}`);
    console.log(`  Flask ML:   ${process.env.FLASK_URL || process.env.ML_API_URL || "http://localhost:5000"}`);
    console.log(`  Frontend:   ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
    console.log(`  Cerebras:   ${process.env.CEREBRAS_API_KEY ? "configured" : "not configured"}`);
    console.log(`  Env:        ${process.env.NODE_ENV || "development"}`);
    console.log("=".repeat(50) + "\n");
  });
};

startServer();
