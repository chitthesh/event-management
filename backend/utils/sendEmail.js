const nodemailer = require("nodemailer");

exports.sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "projectcleint@gmail.com",
      pass: "eiav ppzx jdyj iivq" // Google app password
    }
  });

  await transporter.sendMail({
    from: "Eventify <poojarychitthesh@gmail.com>",
    to,
    subject,
    text
  });
};
