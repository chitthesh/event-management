require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const cateringRoutes = require("./routes/cateringRoutes");
const itemRoutes = require("./routes/itemRoutes");
const adminRoutes = require("./routes/adminRoutes");
const eventTypeRoutes = require("./routes/eventTypeRoutes");
const decorationRoutes = require("./routes/decorationRoutes");

const app = express();

/* ✅ CONNECT DATABASE */
connectDB();

/* ✅ CORS — SUPPORT LOCAL + ALL VERCEL DEPLOYS */
app.use(
  cors({
    origin: function (origin, callback) {
      // allow Postman / mobile apps / curl
      if (!origin) return callback(null, true);

      // allow localhost
      if (origin.startsWith("http://localhost")) {
        return callback(null, true);
      }

      // allow ALL Vercel preview & production URLs
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
  })
);

/* ✅ PREFLIGHT SUPPORT */
app.options("*", cors());

/* ✅ BODY PARSER */
app.use(express.json());

/* ✅ ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/catering", cateringRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/event-types", eventTypeRoutes);
app.use("/api/decorations", decorationRoutes);

/* ✅ STATIC FILES */
app.use("/uploads", express.static("uploads"));

/* ✅ HEALTH CHECK */
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

/* ✅ GLOBAL ERROR HANDLER */
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.message);
  res.status(500).json({ message: err.message });
});

/* ✅ PORT FOR RENDER */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});