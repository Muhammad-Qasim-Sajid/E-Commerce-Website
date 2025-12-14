import { Router } from "express";
import { addContact, deleteContact, editContact, getAllContacts, getReadContacts, getUnreadContacts } from "../controllers/contact.controller.js";

const router = Router();

router.route("/add-contact").post(addContact);
router.route("/edit-contact/:id").post(editContact);
router.route("/get-all-contacts").get(getAllContacts);
router.route("/get-read-contacts").get(getReadContacts);
router.route("/get-unread-contacts").get(getUnreadContacts);
router.route("/delete-contact/:id").post(deleteContact);

export default router;