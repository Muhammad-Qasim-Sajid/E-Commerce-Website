import { Router } from "express";
import { adminCreate, adminLogin, adminLogout, isAdmin } from "../controllers/admin.controller.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";
import { csrfProtect } from "../middlewares/csrfProtect.middleware.js";

const router = Router();

router.route("/create").post(adminCreate)
router.route("/login").post(adminLogin);
router.route("/is-admin").get(isAdmin);
router.route("/logout").post(adminAuth, csrfProtect, adminLogout);

export default router;