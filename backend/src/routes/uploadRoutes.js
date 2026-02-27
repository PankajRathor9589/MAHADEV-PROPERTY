import express from "express";
import { uploadImages, uploadMediaFiles } from "../controllers/uploadController.js";
import { adminOnly, protect } from "../middleware/auth.js";
import { uploadImagesOnly, uploadMedia } from "../middleware/upload.js";

const router = express.Router();

router.post("/images", protect, adminOnly, uploadImagesOnly.array("images", 10), uploadImages);
router.post("/media", protect, adminOnly, uploadMedia.array("files", 12), uploadMediaFiles);

export default router;
