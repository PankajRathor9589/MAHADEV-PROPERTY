import { Router } from "express";
import {
  getAdminAnalytics,
  getAgents,
  getModerationQueue,
  moderateProperty,
  updateAgentStatus
} from "../controllers/adminController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = Router();

router.use(protect, authorizeRoles("admin"));

router.get("/analytics", getAdminAnalytics);
router.get("/agents", getAgents);
router.patch("/agents/:id/status", updateAgentStatus);
router.get("/properties", getModerationQueue);
router.patch("/properties/:id/moderate", moderateProperty);

export default router;
