import { Router } from "express";
import passport from "passport";
import {googleCallBack} from "../controllers/googleAuth.controller.js";

const router = Router();

router.get("/google", passport.authenticate("google", {scope: ["profile", "email"],}));
router.get(
    "/google/callback", 
    passport.authenticate("google",
        //On failure → redirects to frontend /login
        //On success → calls googleCallBack
        {
        failureRedirect: "https://taskdeck-omega.vercel.app/login",
        session: false 
    }),googleCallBack);

export default router