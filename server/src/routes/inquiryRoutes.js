import { Router } from "express";
import { getInquiries, updateInquiryStatus } from "../controllers/inquiryController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = Router();

router.get("/", protect, getInquiries);
router.patch("/:id/status", protect, authorizeRoles("agent", "admin"), updateInquiryStatus);

export default router;
