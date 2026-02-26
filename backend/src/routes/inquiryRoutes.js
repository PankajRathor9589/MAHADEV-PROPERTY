import express from "express";
import { createInquiry, listInquiries, updateInquiryStatus } from "../controllers/inquiryController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", createInquiry);
router.get("/", protect, adminOnly, listInquiries);
router.patch("/:id/status", protect, adminOnly, updateInquiryStatus);

export default router;
