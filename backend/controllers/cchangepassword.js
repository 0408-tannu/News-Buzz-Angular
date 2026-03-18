import { db } from '../config/firebase.js';
import CryptoJS from 'crypto-js';

const usersCol = db.collection('users');

const ChangePassword = async (req, res) => {
  const { CurrentPassword, password } = req.body;

  const userDoc = await usersCol.doc(req.user.id).get();

  if (!userDoc.exists) {
    return res.status(210).json({ success: false, message: "User associated with this email doesn't exist" });
  }

  const user = userDoc.data();

  const decrypteuserExistPwd = CryptoJS.AES.decrypt(user.password, "news-aggregator-secret").toString(CryptoJS.enc.Utf8);
  const decryptCurrentPassword = CryptoJS.AES.decrypt(CurrentPassword, "news-aggregator-secret").toString(CryptoJS.enc.Utf8);

  if (decryptCurrentPassword !== decrypteuserExistPwd) {
    return res.status(210).json({ success: false, message: "Enter Correct password" });
  }

  await usersCol.doc(req.user.id).update({ password });

  return res.status(202).json({ success: true, message: "Password reset successfully" });
}

export { ChangePassword };
