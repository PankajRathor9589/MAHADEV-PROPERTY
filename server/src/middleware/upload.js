import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const propertyUploadDir = path.resolve(__dirname, "../../../uploads/properties");
fs.mkdirSync(propertyUploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, propertyUploadDir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname || "").toLowerCase();
    const baseName = path
      .basename(file.originalname || "property-image", extension)
      .replace(/[^a-zA-Z0-9_-]/g, "-");
    cb(null, `${Date.now()}-${baseName}${extension}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed."));
  }

  return cb(null, true);
};

const maxFileSizeMb = Number(process.env.MAX_FILE_SIZE_MB || 5);

export const uploadPropertyImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSizeMb * 1024 * 1024
  }
});
