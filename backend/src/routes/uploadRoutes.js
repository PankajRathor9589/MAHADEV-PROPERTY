import express from "express";
import { uploadImages } from "../controllers/uploadController.js";
import { adminOnly, protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/images", protect, adminOnly, upload.array("images", 10), uploadImages);

export default router;
