const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message: "Authorization token missing"
      });
    }

    const token = req.headers.authorization.split(" ")[1];

    // ❌ REMOVE fallback
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      email: user.email
    };

    next();

  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

exports.adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access only"
    });
  }
  next();
};
