import { db } from '../config/firebase.js';
import {sendEmail} from '../algorithms/SendEmail.js';
import dotenv from 'dotenv';

dotenv.config();

const verificationCodesCol = db.collection('verificationCodes');
const usersCol = db.collection('users');

const ForgotPassword = async (req, res) => {
  const { username, email, CheckUserExist } = req.body;

  const randomNumber = Math.floor(Math.random() * 1000000);
  const code = String(randomNumber).padStart(6, '0');

  if (CheckUserExist) {
    const snapshot = await verificationCodesCol.where('email', '==', email).limit(1).get();

    if (snapshot.empty) {
      return res.status(210).json({ success: false, message: "User associated with this email doesn't exist" });
    }

    await snapshot.docs[0].ref.update({ code });
  }

  try {
    await sendEmail(username, email, code, CheckUserExist);
    console.log('Email sent successfully');
  } catch (err) {
    console.error('Failed to send email:', err);
    return res.status(210).json({ success: false, message: "Failed to send verification email. Please try again." });
  }

  return res.status(202).json({ success: true, message: "Verification code sent successfully", code: code });
};

const ForgotPasswordVarifyCode = async (req, res) => {
  const { email, code } = req.body;

  console.log(email, code);

  const snapshot = await verificationCodesCol.where('email', '==', email).limit(1).get();

  if (snapshot.empty) {
    return res.status(210).json({ success: false, message: "User associated with this email doesn't exist" });
  }

  const result = snapshot.docs[0].data();

  const enteredCode = code.join('');

  if (result.code !== enteredCode) {
    return res.status(210).json({ success: false, message: "Invalid verification code" });
  }

  return res.status(202).json({ success: true, message: "verification successfully" });
}

const ForgotPasswordResetPassword = async (req, res) => {
  const { email, password } = req.body;

  const snapshot = await usersCol.where('email', '==', email).limit(1).get();

  if (snapshot.empty) {
    return res.status(210).json({ success: false, message: "User associated with this email doesn't exist" });
  }

  await snapshot.docs[0].ref.update({ password });

  return res.status(202).json({ success: true, message: "Password reset successfully" });
}

export { ForgotPassword, ForgotPasswordVarifyCode, ForgotPasswordResetPassword };
