import { Router } from "express";
import {
  createProperty,
  deleteProperty,
  getAllProperties,
  getPropertyById,
  updateProperty
} from "../controllers/propertyController.js";
import { createInquiry } from "../controllers/inquiryController.js";
import { authorizeRoles, optionalAuth, protect } from "../middleware/auth.js";
import { uploadPropertyImages } from "../middleware/upload.js";

const router = Router();

router.get("/", optionalAuth, getAllProperties);
router.get("/:id", optionalAuth, getPropertyById);

router.post(
  "/",
  protect,
  authorizeRoles("agent", "admin"),
  uploadPropertyImages.array("images", 12),
  createProperty
);
router.put(
  "/:id",
  protect,
  authorizeRoles("agent", "admin"),
  uploadPropertyImages.array("images", 12),
  updateProperty
);
router.delete("/:id", protect, authorizeRoles("agent", "admin"), deleteProperty);
router.post("/:id/inquiries", optionalAuth, createInquiry);

export default router;
