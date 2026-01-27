const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    /* 1️⃣ CHECK TOKEN */
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message: "Authorization token missing"
      });
    }

    /* 2️⃣ EXTRACT TOKEN */
    const token = req.headers.authorization.split(" ")[1];

    /* 3️⃣ VERIFY TOKEN */
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secretkey"
    );

    /* 4️⃣ FETCH USER */
    const user = await User.findById(decoded.id)
      .select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    /* 5️⃣ ATTACH USER */
    req.user = {
      id: user._id.toString(), // ✅ STANDARD ID
      role: user.role,
      email: user.email
    };

    next();

  } catch (error) {
    console.error(
      "AUTH MIDDLEWARE ERROR:",
      error.message
    );

    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

/* =====================
   ADMIN ONLY
===================== */
exports.adminOnly = (req, res, next) => {
  if (
    !req.user ||
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      message: "Admin access only"
    });
  }

  next();
};
