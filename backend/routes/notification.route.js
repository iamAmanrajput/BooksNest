const express = require("express");
const router = express.Router();

const {
  getUnreadNotificationCount,
  getNotifications,
  deleteNotifications,
} = require("../controllers/notification.controller");

const { isLoggedIn } = require("../middlewares/verifyToken");

// Get unread notification count (for badge)
router.get("/count", isLoggedIn, getUnreadNotificationCount);

// Get all notifications & mark them as read
router.get("/notifications", isLoggedIn, getNotifications);

// Delete all notifications
router.delete("/clear", isLoggedIn, deleteNotifications);

module.exports = router;
