import { Router } from "express";
import { getAgentAnalytics, getAgentProperties } from "../controllers/sellerController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = Router();

router.use(protect, authorizeRoles("agent"));

router.get("/analytics", getAgentAnalytics);
router.get("/properties", getAgentProperties);

export default router;
