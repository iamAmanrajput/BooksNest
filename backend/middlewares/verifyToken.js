const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

exports.isLoggedIn = async (req, res, next) => {
  try {
    // Get token from cookie, body, or header
    const token =
      req.cookies?.accessToken ||
      req.body?.accessToken ||
      req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Authentication failed, please try again",
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (!req?.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    next();
  } catch (error) {
    console.error("isAdmin middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "User role verification failed. Please try again.",
    });
  }
};

exports.isUser = async (req, res, next) => {
  try {
    if (!req?.user || req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Access denied. User only.",
      });
    }

    next();
  } catch (error) {
    console.error("isUser middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "User role verification failed. Please try again.",
    });
  }
};
