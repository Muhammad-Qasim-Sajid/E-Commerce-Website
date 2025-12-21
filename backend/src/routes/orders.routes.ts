import { Router } from "express";
import { addOrder, deleteOrder, editOrderStatus, editPaymentStatus, editShippingTrackingNumber, getAllOrders, getOrder, trackOrder } from "../controllers/order.controller.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";
import { csrfProtect } from "../middlewares/csrfProtect.middleware.js";

const router = Router();

router.route("/add-order").post(addOrder);
router.route("/track-order").get(trackOrder);
router.route("/edit-payment-status/:id").patch(adminAuth, csrfProtect, editPaymentStatus);
router.route("/edit-order-status/:id").patch(adminAuth, csrfProtect, editOrderStatus);
router.route("/edit-shipping-tracking-number/:id").patch(adminAuth, csrfProtect, editShippingTrackingNumber);
router.route("/get-order/:id").get(adminAuth, getOrder);
router.route("/get-all-orders").get(adminAuth, getAllOrders);
router.route("/delete-order/:id").delete(adminAuth, csrfProtect, deleteOrder);

export default router;