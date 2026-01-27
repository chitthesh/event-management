const express = require("express");
const router = express.Router();

const {
  getAllCatering,
  addCatering,
  deleteCatering
} = require("../controllers/cateringController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

/* =========================
   CLIENT → VIEW FOOD
========================= */
router.get("/", protect, getAllCatering);

/* =========================
   ADMIN → ADD FOOD
========================= */
router.post("/", protect, adminOnly, addCatering);

/* =========================
   ADMIN → DELETE FOOD
========================= */
router.delete("/:id", protect, adminOnly, deleteCatering);

module.exports = router;
