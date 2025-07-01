const express = require("express");
const router = express.Router();

const {
  getProfileStats,
  getCurrentUserData,
  updateProfile,
  updatePassword,
  updateProfilePic,
} = require("../controllers/profile.controller");
const { isLoggedIn, isAdmin } = require("../middlewares/verifyToken");

router.get("/stats", isLoggedIn, getProfileStats);
router.get("/currentUser", isLoggedIn, getCurrentUserData);
router.patch("/updateProfile", isLoggedIn, updateProfile);
router.patch("/updatePassword", isLoggedIn, updatePassword);
router.patch("/updateProfilePic", isLoggedIn, updateProfilePic);

module.exports = router;
