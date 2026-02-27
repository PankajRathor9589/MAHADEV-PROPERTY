import express from "express";
import { createAlert, listAlerts, updateAlertStatus } from "../controllers/alertController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", createAlert);
router.get("/", protect, adminOnly, listAlerts);
router.patch("/:id/status", protect, adminOnly, updateAlertStatus);

export default router;
