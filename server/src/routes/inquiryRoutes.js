import { Router } from "express";
import { createLead, getInquiries, updateInquiryStatus } from "../controllers/inquiryController.js";
import { optionalAuth, protect } from "../middleware/auth.js";

const router = Router();

router.post("/", optionalAuth, createLead);
router.use(protect);
router.get("/", getInquiries);
router.patch("/:id/status", updateInquiryStatus);

export default router;
