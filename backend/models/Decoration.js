const mongoose = require("mongoose");

const decorationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  image: {
    type: String,
    required: true
  },

  // 🔒 PRICE – ONLY ADMIN SETS THIS
  price: {
    type: Number,
    default: null
  },

  // 👤 WHO CREATED THIS DECOR
  createdBy: {
    type: String,
    enum: ["admin", "client"],
    required: true
  },

  // 🔔 ADMIN DECISION FLOW
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  },

  // 🔗 LINK TO EVENT (ONLY FOR CLIENT-UPLOADED DECOR)
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model("Decoration", decorationSchema);
