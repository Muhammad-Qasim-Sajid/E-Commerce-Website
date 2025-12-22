import { Router } from "express";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";
import { csrfProtect } from "../middlewares/csrfProtect.middleware.js";
import { getDashboard } from "../controllers/dashboard.controller.js";

const router = Router();

router.route("/get").get(adminAuth, csrfProtect, getDashboard);

export default router;