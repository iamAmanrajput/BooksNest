const Notification = require("../models/notification.model");

// get unread notifications count
exports.getUnreadNotificationCount = async (req, res) => {
  try {
    const userId = req.user._id;
    const notificationCount = await Notification.countDocuments({
      user: userId,
      isRead: false,
    });

    return res.status(200).json({ success: true, data: notificationCount });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// get all Notifications
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ user: userId })
      .select("type title message isRead createdAt")
      .sort({ createdAt: -1 })
      .lean();

    await Notification.updateMany(
      { user: userId, isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("Error in getNotifications:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Delete all notifications for a user
exports.deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.deleteMany({ user: userId });

    return res
      .status(200)
      .json({ success: true, message: "Notifications cleared successfully" });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
