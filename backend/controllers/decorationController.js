const Decoration = require("../models/Decoration");
const fs = require("fs");
const path = require("path");

/* =========================
   GET DECORATIONS (PAGINATION)
========================= */
exports.getDecorations = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    let filter = {};

    // 🔐 CLIENT SEES ADMIN + OWN DECOR
    if (req.user?.role === "client") {
      filter = {
        $or: [
          { createdBy: "admin" },
          { createdBy: "client", userId: req.user.id }
        ]
      };
    }

    const data = await Decoration.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Decoration.countDocuments(filter);

    res.json({
      data,
      total,
      pages: Math.ceil(total / limit)
    });

  } catch (err) {
    console.error("GET DECORATIONS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   ADMIN → ADD DECORATION
========================= */
exports.addDecoration = async (req, res) => {
  try {
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const deco = new Decoration({
      name: req.body.name,
      price: req.body.price,
      image,
      createdBy: "admin",
      approved: true,
      adminDecision: "Approved"
    });

    await deco.save();
    res.status(201).json(deco);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   CLIENT → UPLOAD DECORATION
========================= */
exports.addClientDecoration = async (req, res) => {
  try {
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const decor = new Decoration({
      name: req.body.name || "Client Requested Decoration",
      image,
      createdBy: "client",
      userId: req.user.id,
      eventId: req.body.eventId,
      price: null,                 // 🔒 admin sets later
      approved: false,
      adminDecision: "Pending"
    });

    await decor.save();
    res.status(201).json(decor);

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

/* =========================
   ADMIN → UPDATE DECOR (PRICE + APPROVAL)
========================= */
exports.updateDecoration = async (req, res) => {
  try {
    const deco = await Decoration.findById(req.params.id);

    if (!deco) return res.status(404).json({ message: "Not found" });

    if (req.file) {
      if (deco.image) {
        fs.unlinkSync(path.join(__dirname, "..", deco.image));
      }
      deco.image = `/uploads/${req.file.filename}`;
    }

    if (req.body.name) deco.name = req.body.name;

    // ❌ NO PRICE HERE ANYMORE

    await deco.save();
    res.json(deco);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =========================
   DELETE DECORATION
========================= */
exports.deleteDecoration = async (req, res) => {
  try {
    const deco = await Decoration.findById(req.params.id);

    if (!deco) return res.status(404).json({ message: "Not found" });

    if (deco.image) {
      fs.unlinkSync(path.join(__dirname, "..", deco.image));
    }

    await deco.deleteOne();
    res.json({ message: "Deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   ADMIN → SET PRICE FOR CLIENT DECOR
========================= */
exports.setDecorationPrice = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const { price } = req.body;

    const decor = await Decoration.findById(req.params.id);

    if (!decor) {
      return res.status(404).json({ message: "Decoration not found" });
    }

    decor.price = price;
    decor.approved = true;
    decor.adminDecision = "Approved";

    await decor.save();

    res.json(decor);

  } catch (err) {
    console.error("SET PRICE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
