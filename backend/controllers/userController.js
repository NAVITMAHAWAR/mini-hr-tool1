const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Leave = require("../models/Leave");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      console.log("Validation failed: Missing fields");
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });

    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
        field: "email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || "employee",
      dateOfJoining: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        dateOfJoining: user.dateOfJoining,
      },
      debug_hash: hashedPassword,
    });
  } catch (e) {
    console.error("Registration error:", e);

    if (e.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already exists (duplicate key error)",
      });
    }

    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: e.message,
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    const usedLeaves = await Leave.countDocuments({
      userId: user._id,
      status: "Approved",
    });
    const totalQuota = 20; // Ya DB se lo
    const leaveBalance = totalQuota - usedLeaves;

    // res.json({ token, user: { ...user.toObject(), leaveBalance } });

    if (!user) {
      console.log(`Login failed: No user with email ${email}`);
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log(`Login failed: Wrong password for ${email}`);
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userResponse = {
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.json({
      success: true,
      token,
      user: userResponse,
       user: { ...user.toObject(), leaveBalance }
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err.message, err.stack);
    res.status(500).json({
      success: false,
      message: "Something went wrong on server",
    });
  }
};
exports.getProfile = async (req, res) => {
  res.send(req.user);
};

exports.getLeaveBalance = async (req, res) => {
  const usedLeaves = await Leave.countDocuments({ userId: req.user._id, status: 'Approved' });
  const totalQuota = 20;  // Customize karo
  res.json({ leaveBalance: totalQuota - usedLeaves });
};