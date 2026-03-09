import { Router } from "express";
import {
  createProperty,
  createPropertyInquiry,
  deleteProperty,
  getAllProperties,
  getPropertyById,
  markPropertySold,
  updateProperty,
  updatePropertyApproval
} from "../controllers/propertyController.js";
import { authorizeRoles, optionalAuth, protect } from "../middleware/auth.js";
import { uploadPropertyImages } from "../middleware/upload.js";

const router = Router();

router.get("/", optionalAuth, getAllProperties);
router.get("/:id", optionalAuth, getPropertyById);

router.post(
  "/",
  protect,
  authorizeRoles("seller", "admin"),
  uploadPropertyImages.array("images", 12),
  createProperty
);
router.put(
  "/:id",
  protect,
  authorizeRoles("seller", "admin"),
  uploadPropertyImages.array("images", 12),
  updateProperty
);
router.delete("/:id", protect, authorizeRoles("seller", "admin"), deleteProperty);
router.patch("/:id/sold", protect, authorizeRoles("seller", "admin"), markPropertySold);
router.patch("/:id/approval", protect, authorizeRoles("admin"), updatePropertyApproval);
router.post("/:id/inquiries", createPropertyInquiry);

export default router;
