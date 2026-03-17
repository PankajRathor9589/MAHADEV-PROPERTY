import { Router } from "express";
import { createInquiry } from "../controllers/inquiryController.js";
import {
  createProperty,
  deleteProperty,
  getAllProperties,
  getMyProperties,
  getPropertyById,
  updateProperty,
  updatePropertyApproval,
  updatePropertyFeatured
} from "../controllers/propertyController.js";
import { authorizeRoles, optionalAuth, protect } from "../middleware/auth.js";
import { uploadPropertyImages } from "../middleware/upload.js";

const router = Router();

router.get("/", optionalAuth, getAllProperties);
router.get("/mine", protect, getMyProperties);
router.get("/:id", optionalAuth, getPropertyById);
router.post("/:id/inquiries", optionalAuth, createInquiry);
router.post("/", protect, uploadPropertyImages.array("images", 10), createProperty);
router.put("/:id", protect, uploadPropertyImages.array("images", 10), updateProperty);
router.delete("/:id", protect, deleteProperty);
router.patch("/:id/approval", protect, authorizeRoles("admin"), updatePropertyApproval);
router.patch("/:id/featured", protect, authorizeRoles("admin"), updatePropertyFeatured);

export default router;
