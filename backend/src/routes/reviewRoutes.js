import express from "express";
import { createOrUpdateReview, deleteReview, listPropertyReviews, markHelpful } from "../controllers/reviewController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/:propertyId", listPropertyReviews);
router.post("/:propertyId", protect, createOrUpdateReview);
router.post("/helpful/:id", markHelpful);
router.delete("/:id", protect, adminOnly, deleteReview);

export default router;
