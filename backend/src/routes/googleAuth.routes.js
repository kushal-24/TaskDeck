import { Router } from "express";
import passport from "passport";
import {googleCallBack} from "../controllers/googleAuth.controller.js";

const router = Router();

router.get("/google", passport.authenticate("google", {scope: ["profile", "email"],}));
router.get("/google/callback", passport.authenticate("google", { session: false }),googleCallBack);

export default router