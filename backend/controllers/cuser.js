import { db } from '../config/firebase.js';
import { FieldValue } from 'firebase-admin/firestore';
import jsonwebtoken from "jsonwebtoken";
import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';

dotenv.config();

const usersCol = db.collection('users');
const quickSearchesCol = db.collection('quickSearches');
const verificationCodesCol = db.collection('verificationCodes');

const logInPost = async (req, res) => {
  console.log("[LOGIN] Request received, body:", JSON.stringify(req.body));

  const { email, password } = req.body;

  if (!email || !password) {
    console.log("[LOGIN] Missing fields - email:", !!email, "password:", !!password);
    return res.status(210).json({ success: false, message: "All fields required" });
  }

  console.log("[LOGIN] Looking up user:", email);

  const snapshot = await usersCol.where('email', '==', email).limit(1).get();

  if (snapshot.empty) {
    console.log("[LOGIN] User not found:", email);
    return res.status(210).json({ success: false, message: "User not exist" });
  }

  const userDoc = snapshot.docs[0];
  const userExist = { ...userDoc.data(), _id: userDoc.id };
  console.log("[LOGIN] User found:", userExist.username);

  const decryptedPwd = CryptoJS.AES.decrypt(password, process.env.PWD_SECRET).toString(CryptoJS.enc.Utf8);
  const decrypteuserExistPwd = CryptoJS.AES.decrypt(userExist.password, process.env.PWD_SECRET).toString(CryptoJS.enc.Utf8);

  if (decryptedPwd !== decrypteuserExistPwd || decryptedPwd === "" || decrypteuserExistPwd === "") {
    console.log("[LOGIN] Invalid password for:", email);
    return res.status(210).json({ success: false, message: "Invalid password" });
  }

  const token = jsonwebtoken.sign({ id: userExist._id, username: userExist.username }, process.env.JWT_SECRET);
  console.log("[LOGIN] Success for:", email);

  return res.status(202).json({ success: true, message: "User signed in successfully", token: token });
};


const signUpPost = async (req, res) => {
  console.log("[SIGNUP] Request received, body:", JSON.stringify(req.body));

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    console.log("[SIGNUP] Missing fields - username:", !!username, "email:", !!email, "password:", !!password);
    return res.status(210).json({ success: false, message: "Please fill all the fields" });
  }
  try {
    console.log("[SIGNUP] Checking if user exists:", email);
    const snapshot = await usersCol.where('email', '==', email).limit(1).get();

    if (!snapshot.empty) {
      console.log("[SIGNUP] User already exists:", email);
      return res.status(210).json({ success: false, error: "User already exists" });
    }

    console.log("[SIGNUP] Creating user:", username, email);
    const userRef = await usersCol.add({
      username, email, password,
      topics: [],
      createdAt: FieldValue.serverTimestamp(),
    });

    await quickSearchesCol.add({
      user_id: userRef.id,
      quickSearchText: ['AI', 'FINANCE', 'TECH', 'EDUCATION', 'ENTERTAINMENT', 'CLIMATE CHANGE', 'SOCIETY', 'CULTURE', 'SPORTS'],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    const token = jsonwebtoken.sign({ id: userRef.id, username }, process.env.JWT_SECRET);

    await verificationCodesCol.add({
      username,
      email,
      code: "123456",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    console.log("[SIGNUP] Success for:", email, "userId:", userRef.id);
    return res.status(202).json({ success: true, message: "user registered successfully", token: token });
  } catch (err) {
    console.error("[SIGNUP] Error:", err);
    return res.status(210).json({ success: false, message: "Error in signup", err: err.message });
  }
};


const getUserProfile = async (req, res) => {
  try {
    const userDoc = await usersCol.doc(req.user.id).get();
    if (!userDoc.exists) {
      return res.status(210).json({ success: false, message: "User not found" });
    }
    const user = { ...userDoc.data(), _id: userDoc.id };
    delete user.password;
    return res.status(202).json({ success: true, user: user });
  } catch (error) {
    return res.status(210).json({ success: false, message: error.message });
  }
}


const updateUserProfile = async (req, res) => {
  try {
    const userRef = usersCol.doc(req.user.id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(210).json({ success: false, message: "User not found" });
    }

    await userRef.update(req.body);
    return res.status(202).json({ success: true, message: "Profile Updated Successfully" });
  } catch (error) {
    return res.status(210).json({ success: false, message: error.message });
  }
}


const isUserExistWhenSignUp = async (req, res) => {
  console.log("[CHECK_USER] Checking email:", req.body.email);
  const { email } = req.body;
  const snapshot = await usersCol.where('email', '==', email).limit(1).get();
  if (!snapshot.empty) {
    console.log("[CHECK_USER] User already exists:", email);
    return res.status(210).json({ success: false, message: "User already exists" });
  }
  console.log("[CHECK_USER] User does not exist:", email);
  return res.status(202).json({ success: true, message: "User does not exist" });
}

export default { logInPost, signUpPost, isUserExistWhenSignUp, getUserProfile, updateUserProfile };
