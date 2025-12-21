import { Router } from "express";
import { editFaqs, getFaqs } from "../controllers/faqs.controller.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";
import { csrfProtect } from "../middlewares/csrfProtect.middleware.js";

const router = Router();

router.route("/edit").post(adminAuth, csrfProtect, editFaqs);
router.route("/get").get(getFaqs);

export default router;