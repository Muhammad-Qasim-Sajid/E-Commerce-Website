import { Router } from "express";
import { addOrder, deleteOrder, editOrderStatus, editPaymentStatus, editTrackingNumber, getAllOrders, getOrder } from "../controllers/order.controller.js";

const router = Router();

router.route("/add-order").post(addOrder);
router.route("/edit-payment-status/:id").post(editPaymentStatus);
router.route("/edit-order-status/:id").post(editOrderStatus);
router.route("/edit-tracking-number/:id").post(editTrackingNumber);
router.route("/get-order/:id").get(getOrder);
router.route("/get-all-orders").get(getAllOrders);
router.route("/delete-order/:id").delete(deleteOrder);

export default router;