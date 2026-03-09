import { Router } from "express";
import {
  getSellerAnalytics,
  getSellerInquiries,
  updateInquiryStatus
} from "../controllers/sellerController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = Router();

router.use(protect, authorizeRoles("seller"));

router.get("/analytics", getSellerAnalytics);
router.get("/inquiries", getSellerInquiries);
router.patch("/inquiries/:id/status", updateInquiryStatus);

export default router;
