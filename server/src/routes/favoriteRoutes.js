import { Router } from "express";
import { addFavorite, getFavorites, removeFavorite } from "../controllers/favoriteController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.get("/", getFavorites);
router.post("/:propertyId", addFavorite);
router.delete("/:propertyId", removeFavorite);

export default router;
