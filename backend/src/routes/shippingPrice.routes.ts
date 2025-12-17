import { Router } from "express";
import { editShippingPrice, getShippingPrice } from "../controllers/shippingPrice.controller.js";

const router = Router();

router.route("/edit").post(editShippingPrice);
router.route("/get").get(getShippingPrice);

export default router;