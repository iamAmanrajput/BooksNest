const cron = require("node-cron");
const mailSender = require("../utils/mailSender");
const { getOverdueBooks } = require("../services/bookService");

function startOverdueReminderJob() {
  cron.schedule("0 9 * * *", async () => {
    try {
      const records = await getOverdueBooks();

      for (const record of records) {
        try {
          await mailSender(
            record.userId.email,
            "❗ Overdue Book Alert",
            `Hi ${record.userId.name},\n\nYour book "${
              record.bookId.title
            }" was due on ${record.dueDate.toDateString()} and is now overdue.\nPlease return it as soon as possible to avoid fines.\n\nThank you,\nLibrary Team`
          );
        } catch (mailErr) {
          console.error(
            `Failed to send mail to ${record.userId.email}:`,
            mailErr.message
          );
        }
      }
    } catch (err) {
      console.error("Error in Overdue Reminder Job:", err.message);
    }
  });
}

module.exports = startOverdueReminderJob;
