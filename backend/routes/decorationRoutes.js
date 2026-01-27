const router = require("express").Router();
const upload = require("../middleware/upload");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const {
  getDecorations,
  addDecoration,          // ADMIN decor
  addClientDecoration,   // CLIENT decor
  deleteDecoration,
  updateDecoration,
  setDecorationPrice     // ADMIN price approve
} = require("../controllers/decorationController");

/* =========================
   GET DECORATIONS
   Admin → all
   Client → admin + own
========================= */
router.get(
  "/",
  protect,
  getDecorations
);

/* =========================
   ADMIN → ADD DECORATION
========================= */
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  addDecoration
);

/* =========================
   CLIENT → UPLOAD DECORATION
========================= */
router.post(
  "/client",
  protect,
  upload.single("image"),
  addClientDecoration
);

/* =========================
   ADMIN → SET PRICE + APPROVE
========================= */
router.put(
  "/price/:id",
  protect,
  adminOnly,
  setDecorationPrice
);

/* =========================
   UPDATE DECORATION
   (name / image only)
========================= */
router.put(
  "/:id",
  protect,
  upload.single("image"),
  updateDecoration
);

/* =========================
   DELETE DECORATION
========================= */
router.delete(
  "/:id",
  protect,
  deleteDecoration
);

module.exports = router;
