const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "due_reminder", // due date near or passed
        "queue_notification", // book assigned from queue
        "fine_alert", // fine exists
        "book_available", // book became available
        "queue_reminder", // 2 din pehle reminder
        "request_approved", // book issued by admin / book returned by admin
        "request_rejected", // request rejected
        "overdue_alert",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
