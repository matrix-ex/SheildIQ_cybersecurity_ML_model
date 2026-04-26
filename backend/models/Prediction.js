const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    features: { type: [Number], required: true },
    model_used: { type: String, required: true },
    prediction: { type: Number, required: true },
    attack_name: { type: String, required: true },
    confidence: { type: Number },
    severity: {
      level: String,
      color: String,
      score: Number,
    },
    recommendation: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prediction", predictionSchema);
