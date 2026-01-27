const router = require("express").Router();
const { getAnalytics } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { monthlyStats } = require("../controllers/adminController");

router.get("/analytics", protect, adminOnly, getAnalytics);
router.get(
  "/monthly-stats",
  protect,
  adminOnly,
  monthlyStats
);


module.exports = router;
