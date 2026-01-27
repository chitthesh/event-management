const Event = require("../models/Event");
const Decoration = require("../models/Decoration");
const { sendEmail } = require("../utils/sendEmail");
const User = require("../models/User");

/* 🔐 SAFE EMAIL */
const sendEmailSafe = async (to, subject, text) => {
  if (!to) return;
  try {
    await sendEmail(to, subject, text);
  } catch (err) {
    console.log("Email skipped:", err.message);
  }
};

/* =========================
   CLIENT → CREATE EVENT
========================= */
exports.createEvent = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      eventType,
      eventDate,
      guests = 0,
      cateringServices = [],
      items = [], // ✅ ADMIN DECORATIONS ONLY
      totalCost
    } = req.body;

    if (!eventType || !eventDate) {
      return res.status(400).json({
        message: "Event type & date required"
      });
    }

    const event = new Event({
      userId: req.user.id,
      eventType,
      eventDate,
      guests,
      cateringServices,
      items,
      totalCost,
      status: "Pending",
      message: "Waiting for admin confirmation",
      unread: true
    });

    await event.save();

    /* 📧 EMAIL ADMINS */
    const admins = await User.find({ role: "admin" });

    for (const admin of admins) {
      await sendEmailSafe(
        admin.email,
        "New Event Request",
        `New event requested for ${eventDate}`
      );
    }

    res.status(201).json(event);

  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   CLIENT → GET OWN EVENTS
========================= */
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({
      userId: req.params.userId
    })
      .populate("eventType", "name")
      .populate("cateringServices", "name pricePerPlate")
      .populate("items", "name price image")
      .sort({ createdAt: -1 });

    /* 🔥 ATTACH CLIENT DECORATIONS */
    const enrichedEvents = await Promise.all(
      events.map(async (event) => {
        const clientDecorations = await Decoration.find({
          eventId: event._id,
          createdBy: "client"
        }).select("name image status adminPrice");

        return {
          ...event.toObject(),
          clientDecorations
        };
      })
    );

    res.json(enrichedEvents);

  } catch (error) {
    console.error("GET EVENTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ADMIN → GET ALL EVENTS
========================= */
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("userId", "name email")
      .populate("eventType", "name")
      .populate("cateringServices", "name pricePerPlate")
      .populate("items", "name price image")
      .sort({ createdAt: -1 });

    /* 🔥 ATTACH CLIENT DECORATIONS */
    const enrichedEvents = await Promise.all(
      events.map(async (event) => {
        const clientDecorations = await Decoration.find({
          eventId: event._id,
          createdBy: "client"
        }).select("name image status adminPrice");

        return {
          ...event.toObject(),
          clientDecorations
        };
      })
    );

    res.json(enrichedEvents);

  } catch (error) {
    console.error("GET ALL EVENTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ADMIN → UPDATE EVENT STATUS
========================= */
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    let message = "";
    if (status === "Approved")
      message = "🎉 Event approved. Decoration feasibility confirmed.";
    if (status === "Rejected")
      message = "❌ Event rejected due to decoration/date constraints.";
    if (status === "Completed")
      message = "✅ Event completed successfully.";

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status, message, unread: true },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const user = await User.findById(event.userId);

    await sendEmailSafe(
      user?.email,
      `Event ${status}`,
      message
    );

    res.json(event);

  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   CLIENT → DELETE EVENT
========================= */
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({ message: "Not found" });

    if (event.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    await event.deleteOne();

    /* 🧹 DELETE CLIENT DECORATIONS */
    await Decoration.deleteMany({
      eventId: event._id,
      createdBy: "client"
    });

    res.json({ message: "Event deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   CLIENT → CANCEL EVENT
========================= */
exports.cancelEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({ message: "Not found" });

    if (event.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    if (!["Pending", "Approved"].includes(event.status)) {
      return res.status(400).json({
        message: "Cannot cancel this event"
      });
    }

    const today = new Date();
    const eventDate = new Date(event.eventDate);
    const diffDays =
      (eventDate - today) / (1000 * 60 * 60 * 24);

    if (diffDays < 2) {
      return res.status(400).json({
        message: "Cancel only before 2 days"
      });
    }

    event.status = "Cancelled";
    event.message = "⚠ Event cancelled by client";
    event.unread = true;

    await event.save();

    const user = await User.findById(event.userId);

    await sendEmailSafe(
      user?.email,
      "Event Cancelled",
      "Your event has been cancelled successfully."
    );

    res.json({ message: "Event cancelled successfully" });

  } catch (error) {
    console.error("CANCEL ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
