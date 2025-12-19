import { Router } from "express";
import { editFaqs, getFaqs } from "../controllers/faqs.controller.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";

const router = Router();

router.route("/edit-faqs").post(adminAuth, editFaqs);
router.route("/get-faqs").get(getFaqs);

export default router;