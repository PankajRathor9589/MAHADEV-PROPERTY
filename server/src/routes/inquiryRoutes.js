import { Router } from "express";
import { getInquiries, updateInquiryStatus } from "../controllers/inquiryController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.get("/", getInquiries);
router.patch("/:id/status", updateInquiryStatus);

export default router;
