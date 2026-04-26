const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const predictRoutes = require("./routes/predict");
const alertRoutes = require("./routes/alerts");

const app = express();
const PORT = process.env.PORT || 4000;

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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/predict", predictRoutes);
app.use("/api", alertRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "VAULTO Backend API",
    flask_url: process.env.FLASK_URL || process.env.ML_API_URL || "http://localhost:5000",
    environment: process.env.NODE_ENV || "development",
  });
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log("\n" + "=".repeat(50));
    console.log("  VAULTO Backend API");
    console.log(`  Running on: http://localhost:${PORT}`);
    console.log(`  Flask ML:   ${process.env.FLASK_URL || process.env.ML_API_URL || "http://localhost:5000"}`);
    console.log(`  Frontend:   ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
    console.log(`  Env:        ${process.env.NODE_ENV || "development"}`);
    console.log("=".repeat(50) + "\n");
  });
};

startServer();
