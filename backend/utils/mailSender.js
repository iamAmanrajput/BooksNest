const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const mailSender = async (email, title, body) => {
  try {
    const response = await resend.emails.send({
      from: "NexLib <onboarding@resend.dev>",
      to: email,
      subject: title,
      html: body,
    });

    return response;
  } catch (error) {
    console.error("Mail error:", error);
    throw error;
  }
};

module.exports = mailSender;
