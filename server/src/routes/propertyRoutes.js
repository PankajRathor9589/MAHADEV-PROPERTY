import { Router } from "express";
import { createInquiry } from "../controllers/inquiryController.js";
import {
  createProperty,
  deleteProperty,
  getAllProperties,
  getMyProperties,
  getPropertySuggestions,
  getPropertyById,
  updateProperty,
  updatePropertyApproval,
  updatePropertyFeatured
} from "../controllers/propertyController.js";
import { authorizeRoles, optionalAuth, protect, requireAdminAccess } from "../middleware/auth.js";
import { uploadPropertyImages } from "../middleware/upload.js";

const router = Router();

router.get("/", optionalAuth, getAllProperties);
router.get("/suggestions/search", optionalAuth, getPropertySuggestions);
router.get("/mine", protect, requireAdminAccess, getMyProperties);
router.get("/:id", optionalAuth, getPropertyById);
router.post("/:id/inquiries", optionalAuth, createInquiry);
router.post("/", protect, requireAdminAccess, uploadPropertyImages.array("images", 10), createProperty);
router.put("/:id", protect, requireAdminAccess, uploadPropertyImages.array("images", 10), updateProperty);
router.delete("/:id", protect, requireAdminAccess, deleteProperty);
router.patch("/:id/approval", protect, authorizeRoles("admin"), updatePropertyApproval);
router.patch("/:id/featured", protect, authorizeRoles("admin"), updatePropertyFeatured);

export default router;
