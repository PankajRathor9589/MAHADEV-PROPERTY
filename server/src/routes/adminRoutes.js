import { Router } from "express";
import {
  getAdminAnalytics,
  getAllInquiries,
  getSellers,
  updateSellerStatus
} from "../controllers/adminController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = Router();

router.use(protect, authorizeRoles("admin"));

router.get("/analytics", getAdminAnalytics);
router.get("/sellers", getSellers);
router.patch("/sellers/:id/status", updateSellerStatus);
router.get("/inquiries", getAllInquiries);

export default router;
