import { Router } from "express";
import { editFaqs, getFaqs } from "../controllers/faqs.controller.js";

const router = Router();

router.route("/edit-faqs").post(editFaqs);
router.route("/get-faqs").get(getFaqs);

export default router;