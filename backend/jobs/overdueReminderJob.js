const cron = require("node-cron");
const mailSender = require("../utils/mailSender");
const Notification = require("../models/notification.model");
const { getOverdueBooks } = require("../services/bookService");
const {
  overdueEmailTemplate,
} = require("../templates/overdueRemainderEmailTemplate");

function startOverdueReminderJob() {
  // Runs every day at 9:00 AM
  cron.schedule("0 9 * * *", async () => {
    try {
      const records = await getOverdueBooks();

      for (const record of records) {
        try {
          await Promise.all([
            // Email
            mailSender(
              record.userId.email,
              "❗ Overdue Book Alert",
              overdueEmailTemplate(
                record.userId.name,
                record.bookId.title,
                record.dueDate.toLocaleDateString("en-IN")
              )
            ),

            // In-app notification
            Notification.create({
              user: record.userId._id,
              type: "overdue_alert",
              title: "Overdue Book",
              message: `Your book "${record.bookId.title}" is overdue. Please return it to avoid more fines.`,
            }),
          ]);
        } catch (mailErr) {
          console.error(`Failed for ${record.userId.email}:`, mailErr.message);
        }
      }
    } catch (err) {
      console.error("Error in Overdue Reminder Job:", err.message);
    }
  });
}

module.exports = startOverdueReminderJob;
