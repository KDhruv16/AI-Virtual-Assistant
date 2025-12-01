import express from "express";
import { login, logOut, signUp } from "../controller/Auth.js";


const router = express.Router();

router.post("/signin",login);
router.post("/signup",signUp);
router.get("/logout",logOut);


export default router