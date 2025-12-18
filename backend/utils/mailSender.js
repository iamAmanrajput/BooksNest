const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const mailSender = async (email, title, body) => {
  try {
    const info = await transporter.sendMail({
      from: "NexLib",
      to: email,
      subject: title,
      html: body,
    });

    return info;
  } catch (error) {
    console.error("Mail error:", error.message);
    throw error;
  }
};

module.exports = mailSender;
