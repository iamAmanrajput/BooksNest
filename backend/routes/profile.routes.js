const express = require("express");
const router = express.Router();

const {
  getProfileStats,
  getCurrentUserData,
} = require("../controllers/profile.controller");
const { isLoggedIn, isAdmin } = require("../middlewares/verifyToken");

router.get("/stats", isLoggedIn, getProfileStats);
router.get("/currentUser", isLoggedIn, getCurrentUserData);

module.exports = router;
