const EventType = require("../models/EventType");

// ADMIN → Create event type
exports.create = async (req, res) => {
  try {
    const eventType = new EventType(req.body);
    await eventType.save();
    res.status(201).json(eventType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CLIENT → Get all event types
exports.getAll = async (req, res) => {
  try {
    const types = await EventType.find();
    res.json(types);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN → Delete event type
exports.remove = async (req, res) => {
  try {
    await EventType.findByIdAndDelete(req.params.id);
    res.json({ message: "Event type deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
