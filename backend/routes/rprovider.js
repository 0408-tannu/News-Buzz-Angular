import express from "express";
const router = express.Router();
import { getAllProviders, getFollowingProviders } from "../controllers/cprovider.js";
import { checkAuth } from "../middleware/checkAuth.js";

router.get("/get_all_providers", getAllProviders);
router.get("/get_following_providers", checkAuth, getFollowingProviders);

export { router };
