const express = require("express");
const router = express.Router();

const {
  create,
  getAll,
  remove
} = require("../controllers/eventTypeController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// ADMIN → Create event type
router.post("/", protect, adminOnly, create);

// CLIENT → Get all event types
router.get("/", protect, getAll);

// ADMIN → Delete event type
router.delete("/:id", protect, adminOnly, remove);

module.exports = router;
