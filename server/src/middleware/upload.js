import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const propertyUploadDir = path.resolve(__dirname, "../../../uploads/properties");
fs.mkdirSync(propertyUploadDir, { recursive: true });

const imageOnlyFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed."));
  }

  return cb(null, true);
};

const mediaFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/") && !file.mimetype.startsWith("video/")) {
    return cb(new Error("Only image or video files are allowed."));
  }

  return cb(null, true);
};

const createMemoryUpload = (fileFilter, maxFileSizeMb) =>
  multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
      fileSize: maxFileSizeMb * 1024 * 1024
    }
  });

export const uploadPropertyImages = createMemoryUpload(
  imageOnlyFilter,
  Number(process.env.MAX_FILE_SIZE_MB || 5)
);

export const uploadPropertyMedia = createMemoryUpload(
  mediaFilter,
  Number(process.env.MAX_MEDIA_FILE_SIZE_MB || process.env.MAX_FILE_SIZE_MB || 20)
);
