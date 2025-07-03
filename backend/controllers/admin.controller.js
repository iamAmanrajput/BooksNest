const Admin = require("../models/admin.model");
const jwt = require("jsonwebtoken");

module.exports.adminSignup = async (req, res) => {
  let { userName, password } = req.body;

  userName = userName?.trim()?.toLowerCase();

  // Validate input
  if (!userName || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long",
    });
  }

  if (userName.length < 3 || userName.length > 10) {
    return res.status(400).json({
      success: false,
      message: "Username must be between 3 and 10 characters long",
    });
  }

  try {
    const existingAdmin = await Admin.findOne({ userName });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const newAdmin = await Admin.create({
      userName,
      password, // will be hashed via pre-save hook
    });

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      user: {
        _id: newAdmin._id,
        userName: newAdmin.userName,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error("Admin Registration Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

module.exports.adminSignin = async (req, res) => {
  let { userName, password } = req.body;

  userName = userName?.trim()?.toLowerCase();

  // Validate input
  if (!userName || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  try {
    const admin = await Admin.findOne({ userName }).select("+password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isPasswordMatched = await admin.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const payload = {
      _id: admin._id,
      role: admin.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "Admin sign in successfully",
      token,
      user: {
        _id: admin._id,
        userName: admin.userName,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("admin Sign in Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

module.exports.adminLogout = async (req, res) => {
  try {
    // Clear the JWT cookie
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });

    return res
      .status(200)
      .json({ success: true, message: "Successfully logged out" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Logout failed" });
  }
};
