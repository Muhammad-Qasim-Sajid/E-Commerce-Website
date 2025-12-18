import { Router } from "express";
import { addOrder, deleteOrder, editOrderStatus, editPaymentStatus, editShippingTrackingNumber, getAllOrders, getOrder, trackOrder } from "../controllers/order.controller.js";

const router = Router();

router.route("/add-order").post(addOrder);
router.route("/track-order").get(trackOrder);
router.route("/edit-payment-status/:id").patch(editPaymentStatus);
router.route("/edit-order-status/:id").patch(editOrderStatus);
router.route("/edit-shipping-tracking-number/:id").patch(editShippingTrackingNumber);
router.route("/get-order/:id").get(getOrder);
router.route("/get-all-orders").get(getAllOrders);
router.route("/delete-order/:id").delete(deleteOrder);

export default router;