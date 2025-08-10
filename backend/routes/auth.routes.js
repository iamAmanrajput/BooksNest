const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
} = require("../controllers/auth.controller");
const { isLoggedIn } = require("../middlewares/verifyToken");

router.post("/register", register);

router.get("/verify", verifyEmail);

router.post("/login", login);

router.get("/logout", isLoggedIn, logout);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

module.exports = router;
