const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
  },
  attack_class: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  attack_label: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  timeout: {
    type: Number,
    default: 0,
  },
  reason: {
    type: String,
    default: "",
  },
  severity: {
    type: String,
    enum: ["none", "medium", "high", "critical"],
    default: "none",
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0,
  },
  model_used: {
    type: String,
    default: "XGBoost",
  },
  status: {
    type: String,
    enum: ["open", "mitigated", "dismissed"],
    default: "open",
  },
  triaged_by: {
    type: String,
    default: null,
  },
  triaged_at: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

alertSchema.index({ status: 1, severity: 1 });
alertSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Alert", alertSchema);
