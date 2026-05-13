import { Router } from "express";
import { getRecentActivityLogs } from "../controllers/activity.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/recent").get(verifyJWT, getRecentActivityLogs);

export default router;
