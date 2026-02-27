import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = process.env.UPLOAD_DIR || "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/\s+/g, "-").toLowerCase();
    cb(null, `${name}-${Date.now()}${ext}`);
  }
});

const imageOnlyFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) return cb(null, true);
  return cb(new Error("Only image files are allowed"));
};

const mediaFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) return cb(null, true);
  return cb(new Error("Only image or video files are allowed"));
};

export const uploadImagesOnly = multer({
  storage,
  fileFilter: imageOnlyFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export const uploadMedia = multer({
  storage,
  fileFilter: mediaFilter,
  limits: { fileSize: 20 * 1024 * 1024 }
});
