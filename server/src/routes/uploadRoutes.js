import { Router } from "express";
import { uploadMediaFiles } from "../controllers/uploadController.js";
import { protect, requireAdminAccess } from "../middleware/auth.js";
import { uploadPropertyMedia } from "../middleware/upload.js";

const router = Router();

router.post("/media", protect, requireAdminAccess, uploadPropertyMedia.array("files", 6), uploadMediaFiles);

export default router;
