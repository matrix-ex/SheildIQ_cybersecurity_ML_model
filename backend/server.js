const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const predictRoutes = require("./routes/predict");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3000"] }));
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/predict", predictRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "VAULTO Backend API" });
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log("\n" + "=".repeat(50));
    console.log("  VAULTO Backend API");
    console.log(`  Running on: http://localhost:${PORT}`);
    console.log(`  ML API:     ${process.env.ML_API_URL}`);
    console.log("=".repeat(50) + "\n");
  });
};

startServer();
