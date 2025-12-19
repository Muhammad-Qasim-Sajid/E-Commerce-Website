import { Router } from "express";
import { editOurStoryPage, getOurStoryPage } from "../controllers/ourStory.controller.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";

const router = Router();

router.route("/edit-our-story").post(adminAuth, editOurStoryPage);
router.route("/get-our-story").get(getOurStoryPage);

export default router;