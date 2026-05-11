const mongoose = require("mongoose");

const apiKeySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  label: {
    type: String,
    required: true,
    trim: true,
  },
  site_url: {
    type: String,
    default: "",
    trim: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

apiKeySchema.index({ key: 1 }, { unique: true });
apiKeySchema.index({ is_active: 1 });

module.exports = mongoose.model("ApiKey", apiKeySchema);
