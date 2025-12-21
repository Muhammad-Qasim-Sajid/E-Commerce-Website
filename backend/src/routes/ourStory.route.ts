import { Router } from "express";
import { editOurStoryPage, getOurStoryPage } from "../controllers/ourStory.controller.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";
import { csrfProtect } from "../middlewares/csrfProtect.middleware.js";

const router = Router();

router.route("/edit").post(adminAuth, csrfProtect, editOurStoryPage);
router.route("/get").get(getOurStoryPage);

export default router;