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

connectDB();

const app = express();

/* ✅ CORS CONFIG — VERY IMPORTANT */
const allowedOrigins = [
  "http://localhost:5173",
  "https://event-management-harc8sa4i-chittheshs-projects.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

/* ✅ HANDLE PREFLIGHT */
app.options("*", cors());

app.use(express.json());

/* ✅ ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/catering", cateringRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/event-types", eventTypeRoutes);
app.use("/api/decorations", decorationRoutes);

/* ✅ STATIC UPLOADS */
app.use("/uploads", express.static("uploads"));

/* ✅ PORT FIX FOR RENDER */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));