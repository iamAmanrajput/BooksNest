const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  changeAccountStatus,
  recentActivities,
  usersStats,
} = require("../controllers/user.controller");
const { isLoggedIn, isAdmin } = require("../middlewares/verifyToken");

router.get("/users", isLoggedIn, isAdmin, getAllUsers);
router.get("/recent-activities", isLoggedIn, isAdmin, recentActivities);
router.get("/users/stats", isLoggedIn, isAdmin, usersStats);
router.patch("/changeStatus", isLoggedIn, isAdmin, changeAccountStatus);

module.exports = router;
