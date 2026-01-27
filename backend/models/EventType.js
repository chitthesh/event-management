const mongoose = require("mongoose");

const eventTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  basePrice: { type: Number, default: 0 }
});

module.exports = mongoose.model("EventType", eventTypeSchema);
