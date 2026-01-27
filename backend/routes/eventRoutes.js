const router = require("express").Router();
const Event = require("../models/Event");

const {
  createEvent,
  getEvents,
  getAllEvents,
  updateStatus,
  deleteEvent,
  cancelEvent
} = require("../controllers/eventController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

/* ================= CLIENT ================= */

router.post("/create", protect, createEvent);

router.get("/:userId", protect, getEvents);

router.delete("/:id", protect, deleteEvent);

/* ❌ CANCEL EVENT */
router.put("/cancel/:id", protect, cancelEvent);


/* ================= ADMIN ================= */

/* GET ALL EVENTS */
router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllEvents
);

/* UPDATE STATUS */
router.put(
  "/status/:id",
  protect,
  adminOnly,
  updateStatus
);

/* 🔔 MARK AS READ */
router.put(
  "/read/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      await Event.findByIdAndUpdate(
        req.params.id,
        { unread: false }
      );

      res.json({
        message: "Marked as read"
      });

    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  }
);

module.exports = router;
