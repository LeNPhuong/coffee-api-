const nodemailer = require("nodemailer");

let sendEmail = async (otp) => {
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  let message = {
    from: `${process.env.EMAIL_USER}`,
    to: otp.email,
    subject: `Coffe House`,
    text: `Mã của bạn là : ${otp.message}`,
  };

  await transporter.sendMail(message);
};

module.exports = sendEmail;
