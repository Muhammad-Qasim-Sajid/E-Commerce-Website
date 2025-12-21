import { Router } from "express";
import { addContact, deleteContact, getAllContacts, getReadContacts, getUnreadContacts, markReadContact, markUnreadContact } from "../controllers/contact.controller.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";
import { csrfProtect } from "../middlewares/csrfProtect.middleware.js";

const router = Router();

router.route("/add-contact").post(addContact);
router.route("/mark-read-contact/:id").post(adminAuth, csrfProtect, markReadContact);
router.route("/mark-unread-contact/:id").post(adminAuth, csrfProtect, markUnreadContact);
router.route("/get-all-contacts").get(adminAuth, getAllContacts);
router.route("/get-read-contacts").get(adminAuth, getReadContacts);
router.route("/get-unread-contacts").get(adminAuth, getUnreadContacts);
router.route("/delete-contact/:id").delete(adminAuth, csrfProtect, deleteContact);

export default router;