import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

async function sendEmail(username, email, code, CheckUserExist) {
  console.log("sendEmail function called");

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASS,
    },
  });

  let mailOptions;

  if (CheckUserExist) {
    mailOptions = {
      from: `"NewsBuzz" <${process.env.EMAIL_USER}>`,
      to: `${email}`,
      subject: "Forget Password Verification Code",
      html: `<p>Dear User,</p>
           <p>We received a request to reset the password for your account on NewsBuzz. To proceed, please use the verification code below:</p>
           <h2>Verification Code: ${code}</h2>
           <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
           <p>Thank you for using NewsBuzz!</p>
           <p>Best regards,<br>The NewsBuzz Team</p>`,
    };
  } else {
    mailOptions = {
      from: `"NewsBuzz" <${process.env.EMAIL_USER}>`,
      to: `${email}`,
      subject: "Welcome to NewsBuzz - Email Verification",
      html: `
      <p>Dear ${username},</p>
      <p>Welcome to NewsBuzz! We're excited to have you on board.</p>
      <p>To verify your email address and activate your account, please use the verification code below:</p>
      <h2>Verification Code: ${code}</h2>
      <p>If you did not sign up for NewsBuzz, please ignore this email.</p>
      <p>Thank you for joining NewsBuzz!</p>
      <p>Best regards,<br>The NewsBuzz Team</p>`,
    };
  }

  try {
    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
}

export { sendEmail };
