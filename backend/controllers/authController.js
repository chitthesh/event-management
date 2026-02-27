const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {
    console.log("📩 REGISTER BODY:", req.body);

    const { name, email, password } = req.body;

    /* ✅ VALIDATION */
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    /* ✅ CHECK EXISTING USER */
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    /* ✅ HASH PASSWORD */
    const hashedPassword = await bcrypt.hash(password, 10);

    /* ✅ CREATE USER */
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "client",
    });

    await user.save();

    console.log("✅ USER REGISTERED:", user.email);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (error) {
    console.error("🔥 REGISTER ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    console.log("📩 LOGIN BODY:", req.body);

    const { email, password } = req.body;

    /* ✅ VALIDATION */
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    /* ✅ FIND USER */
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    /* ✅ CHECK PASSWORD */
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    /* ✅ JWT SECRET CHECK */
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET missing in environment variables");
      return res.status(500).json({
        message: "Server configuration error",
      });
    }

    /* ✅ GENERATE TOKEN */
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("✅ USER LOGGED IN:", user.email);

    res.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("🔥 LOGIN ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};