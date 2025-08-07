const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const mailSender = async (email, title, body) => {
  try {
    //Create Transporter
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    //Send mail
    let info = await transporter.sendMail({
      from: "NexLib",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
    return info;
  } catch (error) {
    console.log(err.message);
  }
};

module.exports = mailSender;
