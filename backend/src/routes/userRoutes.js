import express from "express";
import { addRecentlyViewed, getUserCollections, toggleCompare, toggleFavorite } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/collections", protect, getUserCollections);
router.post("/favorites/:propertyId", protect, toggleFavorite);
router.post("/recent/:propertyId", protect, addRecentlyViewed);
router.post("/compare/:propertyId", protect, toggleCompare);

export default router;
