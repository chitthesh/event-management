const Event = require("../models/Event");
const User = require("../models/User");

/* 📊 DASHBOARD ANALYTICS */
exports.getAnalytics = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const completedEvents = await Event.countDocuments({
      status: "Completed"
    });
    const users = await User.countDocuments();

    const revenueData = await Event.aggregate([
      { $match: { status: "Completed" } },
      { $group: { _id: null, total: { $sum: "$totalCost" } } }
    ]);

    const revenue = revenueData[0]?.total || 0;

    res.json({
      totalEvents,
      completedEvents,
      users,
      revenue
    });
  } catch (error) {
    console.error("ANALYTICS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


/* 📊 MONTHLY STATS */
exports.monthlyStats = async (req, res) => {
  try {
    const stats = await Event.aggregate([
      {
        $group: {
          _id: { $month: "$eventDate" },
          totalRevenue: { $sum: "$totalCost" },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(stats);
  } catch (error) {
    console.error("MONTHLY STATS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
