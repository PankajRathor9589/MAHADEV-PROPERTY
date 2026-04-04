import express from "express";
import {
  getAdminAnalytics,
  getAdminProperties,
  getDashboardStats,
  getUsers,
  healthCheck,
  moderateProperty,
  updateAgentStatus
} from "../controllers/adminController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/health", healthCheck);
router.use(protect, adminOnly);
router.get("/stats", getDashboardStats);
router.get("/analytics", getAdminAnalytics);
router.get("/users", getUsers);
router.patch("/agents/:id/status", updateAgentStatus);
router.get("/properties", getAdminProperties);
router.patch("/properties/:id/moderate", moderateProperty);

export default router;
