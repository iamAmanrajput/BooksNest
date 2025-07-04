const cron = require("node-cron");
const mailSender = require("../utils/mailSender");
const Notification = require("../models/notification.model");
const { getBooksDueInTwoDays } = require("../services/bookService");
const { dueEmailTemplate } = require("../templates/dueRemainderEmailTemplate");

function startDueReminderJob() {
  cron.schedule("0 8 * * *", async () => {
    try {
      const records = await getBooksDueInTwoDays();

      for (const record of records) {
        try {
          await Promise.all([
            mailSender(
              record.userId.email,
              "📚 Book Due Soon",
              dueEmailTemplate(
                record.userId.name,
                record.bookId.title,
                record.dueDate.toLocaleDateString("en-IN")
              )
            ),
            Notification.create({
              user: record.userId._id,
              type: "due_reminder",
              title: "Book Due Soon",
              message:
                "Your book is due in 2 days. Return or renew to avoid late fees.",
            }),
          ]);
        } catch (mailErr) {
          console.error(`Failed for ${record.userId.email}:`, mailErr.message);
        }
      }
    } catch (err) {
      console.error("Error in Due Reminder Job:", err.message);
    }
  });
}

module.exports = startDueReminderJob;
