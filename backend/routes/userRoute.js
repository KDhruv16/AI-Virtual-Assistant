import express from "express";
import { askToAssistant, getCurrentUser, updateAssistant } from "../controller/User.js";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js"
const router = express.Router();

router.get("/current", isAuth, getCurrentUser);
router.post("/update",isAuth,upload.single("assistantImage"),updateAssistant)
router.post("/asktoassistant",isAuth,askToAssistant);

export default router;
