const mongoose = require("mongoose");

const monitoredSiteSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  label: {
    type: String,
    default: "",
    trim: true,
  },
  status: {
    type: String,
    enum: ["active", "paused"],
    default: "active",
  },
  last_checked: {
    type: Date,
    default: null,
  },
  last_threat: {
    type: String,
    default: "",
  },
  total_scans: {
    type: Number,
    default: 0,
  },
  total_threats: {
    type: Number,
    default: 0,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

monitoredSiteSchema.index({ url: 1 }, { unique: true });
monitoredSiteSchema.index({ status: 1, last_checked: -1 });

module.exports = mongoose.model("MonitoredSite", monitoredSiteSchema);
