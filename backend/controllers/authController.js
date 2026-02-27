const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {
    console.log("📩 REGISTER BODY:", req.body);

    let { name, email, password } = req.body;

    /* ✅ SANITIZE INPUT */
    name = name?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();

    /* ✅ VALIDATION */
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    /* ✅ CHECK EXISTING USER */
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    /* ✅ HASH PASSWORD */
    const hashedPassword = await bcrypt.hash(password, 10);

    /* ✅ CREATE USER */
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "client",
    });

    console.log("✅ USER REGISTERED:", user.email);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (error) {
    console.error("🔥 REGISTER ERROR:", error);

    /* ✅ HANDLE DUPLICATE KEY ERROR */
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    console.log("📩 LOGIN BODY:", req.body);

    let { email, password } = req.body;

    email = email?.trim().toLowerCase();
    password = password?.trim();

    /* ✅ VALIDATION */
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    /* ✅ FIND USER */
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    /* ✅ CHECK PASSWORD */
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    /* ✅ JWT SECRET CHECK */
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET missing");
      return res.status(500).json({
        success: false,
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

    res.status(200).json({
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
      message: "Server error",
    });
  }
};