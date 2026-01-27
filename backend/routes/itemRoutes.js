const router = require("express").Router();
const Item = require("../models/Item");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, adminOnly, async (req, res) => {
  const item = new Item(req.body);
  await item.save();
  res.json(item);
});

router.get("/", protect, async (req, res) => {
  res.json(await Item.find());
});

module.exports = router;
