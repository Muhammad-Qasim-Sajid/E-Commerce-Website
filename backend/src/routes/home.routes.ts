import { Router } from "express";
import { editHomePage, getHomePage } from "../controllers/home.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/edit-home").post(upload.single('heroImage'), editHomePage);
router.route("/get-home").get(getHomePage);

export default router;