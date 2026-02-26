import express from "express";
import {
  createProperty,
  deleteProperty,
  getFeaturedProperties,
  getPropertyById,
  getPropertyBySlug,
  getTrendingProperties,
  listProperties,
  similarProperties,
  updateProperty
} from "../controllers/propertyController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", listProperties);
router.get("/featured/list", getFeaturedProperties);
router.get("/trending/list", getTrendingProperties);
router.get("/:id/similar", similarProperties);
router.get("/slug/:slug", getPropertyBySlug);
router.get("/id/:id", getPropertyById);
router.post("/", protect, adminOnly, createProperty);
router.put("/:id", protect, adminOnly, updateProperty);
router.delete("/:id", protect, adminOnly, deleteProperty);

export default router;
