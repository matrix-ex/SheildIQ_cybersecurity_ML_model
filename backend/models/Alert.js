const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  source_ip: {
    type: String,
    required: true,
    trim: true,
  },
  attack_class: {
    type: Number,
    min: 0,
    max: 10,
  },
  attack_label: {
    type: String,
    trim: true,
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
  },
  model_used: {
    type: String,
    trim: true,
  },
  action: {
    type: String,
    trim: true,
  },
  timeout: {
    type: Number,
    default: 0,
  },
  reason: {
    type: String,
    default: "",
  },
  prevention_actions: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ["open", "mitigated", "dismissed"],
    default: "open",
  },
  source_url: {
    type: String,
    default: "",
  },
  triggered_by: {
    type: String,
    enum: ["safezone", "manual", "auto", "shield"],
    default: "manual",
  },
  triaged_by: {
    type: String,
    default: "",
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

alertSchema.index({ status: 1, severity: 1, createdAt: -1 });
alertSchema.index({ createdAt: -1 });
alertSchema.index({ source_ip: 1, createdAt: -1 });
alertSchema.index({ source_url: 1 });

module.exports = mongoose.model("Alert", alertSchema);
