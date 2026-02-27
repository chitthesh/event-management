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

/* ✅ ALLOWED ORIGINS */
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://event-management-harc8sa4i-chittheshs-projects.vercel.app", // your live frontend
];

/* ✅ CORS CONFIG (PRODUCTION SAFE) */
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
  })
);

/* ✅ HANDLE PREFLIGHT */
app.options("*", cors());

/* ✅ BODY PARSER */
app.use(express.json());

/* ✅ API ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/catering", cateringRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/event-types", eventTypeRoutes);
app.use("/api/decorations", decorationRoutes);

/* ✅ STATIC FILES (IMAGE UPLOADS) */
app.use("/uploads", express.static("uploads"));

/* ✅ HEALTH CHECK ROUTE (for browser test) */
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

/* ✅ GLOBAL ERROR HANDLER (PREVENTS CRASHES) */
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.message);
  res.status(500).json({ message: "Server Error" });
});

/* ✅ PORT FOR RENDER */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);