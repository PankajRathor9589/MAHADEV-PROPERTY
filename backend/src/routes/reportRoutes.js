import express from "express";
import { createReport, listReports, updateReportStatus } from "../controllers/reportController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/:propertyId", protect, createReport);
router.get("/", protect, adminOnly, listReports);
router.patch("/:id/status", protect, adminOnly, updateReportStatus);

export default router;
