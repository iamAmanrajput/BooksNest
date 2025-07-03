const cron = require("node-cron");
const mailSender = require("../utils/mailSender");
const { getBooksDueInTwoDays } = require("../services/bookService");

function startDueReminderJob() {
  cron.schedule("0 8 * * *", async () => {
    try {
      const records = await getBooksDueInTwoDays();

      for (const record of records) {
        try {
          await mailSender(
            record.userId.email,
            "📚 Book Due Soon",
            `Hi ${record.userId.name}, your book "${
              record.bookId.title
            }" is due on ${record.dueDate.toDateString()}. Please return or renew it before the due date.`
          );
        } catch (mailErr) {
          console.error(
            `Mail failed for ${record.userId.email}:`,
            mailErr.message
          );
        }
      }
    } catch (err) {
      console.error("Error in Due Reminder Job:", err.message);
    }
  });
}

module.exports = startDueReminderJob;
