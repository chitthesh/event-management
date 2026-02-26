const Catering = require("../models/Catering");

/* =========================
   CLIENT + ADMIN → GET ALL
========================= */
exports.getAllCatering = async (req, res) => {
  try {
    const data = await Catering.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch catering items",
      error: error.message
    });
  }
};

/* =========================
   ADMIN → ADD FOOD
========================= */
exports.addCatering = async (req, res) => {
  try {
    const { name, category, pricePerPlate, image } = req.body;

    // Validation
    if (!name || !category || !pricePerPlate) {
      return res.status(400).json({
        message: "Name, category & price are required"
      });
    }

    const item = await Catering.create({
      name,
      category,
      pricePerPlate,
      type,
      image: image || "" // optional

    });

    res.status(201).json(item);

  } catch (error) {
    res.status(500).json({
      message: "Failed to add catering item",
      error: error.message
    });
  }
};

/* =========================
   ADMIN → DELETE FOOD
========================= */
exports.deleteCatering = async (req, res) => {
  try {
    const item = await Catering.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found"
      });
    }

    res.json({
      message: "Catering item deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
      error: error.message
    });
  }
};
