const mongoose = require("mongoose");

// Schema
const planSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    limitations: [String],
  },
  { timestamps: true }
);

// Model
const Plan = mongoose.model("Plan", planSchema);

module.exports = Plan;
