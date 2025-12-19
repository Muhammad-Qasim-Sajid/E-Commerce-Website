import { Router } from "express";
import { addContact, deleteContact, editContact, getAllContacts, getReadContacts, getUnreadContacts } from "../controllers/contact.controller.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";

const router = Router();

router.route("/add-contact").post(addContact);
router.route("/edit-contact/:id").post(adminAuth, editContact);
router.route("/get-all-contacts").get(adminAuth, getAllContacts);
router.route("/get-read-contacts").get(adminAuth, getReadContacts);
router.route("/get-unread-contacts").get(adminAuth, getUnreadContacts);
router.route("/delete-contact/:id").delete(adminAuth, deleteContact);

export default router;