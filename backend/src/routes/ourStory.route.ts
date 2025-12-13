import { Router } from "express";
import { editOurStoryPage, getOurStoryPage } from "../controllers/ourStory.controller.js";

const router = Router();

router.route("/edit-our-story").post(editOurStoryPage);
router.route("/get-our-story").get(getOurStoryPage);

export default router;