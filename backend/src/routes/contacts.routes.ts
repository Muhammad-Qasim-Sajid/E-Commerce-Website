import { Router } from "express";
import { addContact, deleteContact, getAllContacts } from "../controllers/contact.controller.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";
import { csrfProtect } from "../middlewares/csrfProtect.middleware.js";

const router = Router();

router.route("/add-contact").post(addContact);
router.route("/get-all-contacts").get(adminAuth, getAllContacts);
router.route("/delete-contact/:id").delete(adminAuth, csrfProtect, deleteContact);

export default router;