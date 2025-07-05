const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  changeAccountStatus,
  recentActivities,
} = require("../controllers/user.controller");
const { isLoggedIn, isAdmin } = require("../middlewares/verifyToken");

router.get("/getUsers", isLoggedIn, isAdmin, getAllUsers);
router.get("/recent-activities", isLoggedIn, isAdmin, recentActivities);
router.patch("/changeStatus/:id", isLoggedIn, isAdmin, changeAccountStatus);

module.exports = router;
