// const router = require("express").Router();
// const { getQuickSearch, addQuickSearch, deleteQuickSearch } = require("../controllers/cquicksearch");

import express from "express";
const router = express.Router();
import { getQuickSearch, addQuickSearch, deleteQuickSearch, updateQuickSearch } from "../controllers/cquicksearch.js";


router.get("/get", getQuickSearch);

router.post("/add", addQuickSearch);

router.post("/delete", deleteQuickSearch);

router.post("/update", updateQuickSearch);


// export default router;;

export { router };
