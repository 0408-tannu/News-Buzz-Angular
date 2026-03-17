import express from "express";
const router = express.Router();
import cuser from "../controllers/cuser.js";
const { logInPost, signUpPost, isUserExistWhenSignUp, getUserProfile, updateUserProfile } = cuser;
import { checkAuth } from "../middleware/checkAuth.js";

router.post("/login", logInPost);

router.post("/signup", signUpPost);

router.post("/isuserexistwhensignup", isUserExistWhenSignUp);

router.get("/userprofile/get", checkAuth, getUserProfile);

router.post("/userprofile/update", checkAuth, updateUserProfile);

export { router };
