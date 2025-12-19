import { Router } from "express";
import { editShippingPrice, getShippingPrice } from "../controllers/shippingPrice.controller.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";

const router = Router();

router.route("/edit").post(adminAuth, editShippingPrice);
router.route("/get").get(getShippingPrice);

export default router;