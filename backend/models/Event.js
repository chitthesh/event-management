const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    // 🔐 Event owner
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // 🎉 Event type (admin-managed)
    eventType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventType",
      required: true
    },
    
     eventDate: {
  type: Date,
default: Date.now
},

    // 🍽 Catering services (selected food)
    cateringServices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Catering"
      }
    ],

    // 🪑 Items (chairs, tents etc)
    items: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Decoration"
  }
],

    // 👥 Guests count
    guests: {
      type: Number,
      default: 0
    },

    // 💰 Calculated total cost
    totalCost: {
      type: Number,
      default: 0
    },

    // 📌 Event status
    status: {
  type: String,
  enum: [
    "Pending",
    "Approved",
    "Rejected",
    "Completed",
    "Cancelled"   // 🔥 ADD THIS
  ],
  default: "Pending"
},
unread: {
  type: Boolean,
  default: true
},

    // 💬 Admin message to user
    message: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

module.exports = mongoose.model("Event", eventSchema);
