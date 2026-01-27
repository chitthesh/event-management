const mongoose = require("mongoose");

const cateringSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      enum: ["starter", "main", "dessert", "special"],
      required: true
    },

    pricePerPlate: {
      type: Number,
      required: true
    },

    image: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

module.exports = mongoose.model("Catering", cateringSchema);
