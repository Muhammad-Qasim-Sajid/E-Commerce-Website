import { Router } from "express";
import { addProduct, deleteProduct, editProduct, getAllProducts, getProduct } from "../controllers/product.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";

const router = Router();

router.route("/add-product").post(adminAuth, upload.array("variantImages"), addProduct);
router.route("/edit-product/:id").post(adminAuth, upload.array("variantImages"), editProduct);
router.route("/get-product/:id").get(getProduct);
router.route("/get-all-products").get(getAllProducts);
router.route("/delete-product/:id").delete(adminAuth, deleteProduct);

export default router;