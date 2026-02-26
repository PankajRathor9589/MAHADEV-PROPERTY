import express from "express";
import { getDashboardStats, healthCheck } from "../controllers/adminController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/health", healthCheck);
router.get("/stats", protect, adminOnly, getDashboardStats);

export default router;
