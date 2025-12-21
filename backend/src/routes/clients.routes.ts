import { Router } from "express";
import { getClients } from "../controllers/client.controller.js";

const router = Router();

router.route("/get").get(getClients);

export default router;