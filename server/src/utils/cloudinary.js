import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { propertyUploadDir } from "../middleware/upload.js";

const getCloudinaryConfig = () => ({
  cloudName: String(process.env.CLOUDINARY_CLOUD_NAME || "").trim(),
  apiKey: String(process.env.CLOUDINARY_API_KEY || "").trim(),
  apiSecret: String(process.env.CLOUDINARY_API_SECRET || "").trim(),
  folder: String(process.env.CLOUDINARY_FOLDER || "sagar-infra/properties").trim()
});

const sanitizeBaseName = (value = "property-image") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "property-image";

const isCloudinaryUrl = (value = "") => /res\.cloudinary\.com/i.test(String(value));

const signPayload = (payload, apiSecret) => {
  const serializedPayload = Object.entries(payload)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(`${serializedPayload}${apiSecret}`)
    .digest("hex");
};

const uploadFileToCloudinary = async (file) => {
  const { cloudName, apiKey, apiSecret, folder } = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const extension = path.extname(file.originalname || "").toLowerCase();
  const baseName = sanitizeBaseName(path.basename(file.originalname || "property-image", extension));
  const publicId = `${folder}/${Date.now()}-${baseName}`;
  const payload = {
    folder,
    public_id: publicId,
    timestamp
  };
  const signature = signPayload(payload, apiSecret);
  const formData = new FormData();

  formData.append("file", new Blob([file.buffer], { type: file.mimetype }), file.originalname || `${baseName}${extension}`);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("folder", folder);
  formData.append("public_id", publicId);
  formData.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudinary upload failed: ${errorText}`);
  }

  const result = await response.json();

  return {
    filename: result.public_id,
    url: result.secure_url
  };
};

const storeFileLocally = async (file) => {
  const extension = path.extname(file.originalname || "").toLowerCase();
  const baseName = sanitizeBaseName(path.basename(file.originalname || "property-image", extension));
  const fileName = `${Date.now()}-${baseName}${extension}`;
  const filePath = path.join(propertyUploadDir, fileName);

  await fs.writeFile(filePath, file.buffer);

  return {
    filename: fileName,
    url: `/uploads/properties/${fileName}`
  };
};

const destroyCloudinaryAsset = async (publicId) => {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = signPayload({ public_id: publicId, timestamp }, apiSecret);
  const formData = new FormData();

  formData.append("public_id", publicId);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudinary delete failed: ${errorText}`);
  }
};

export const isCloudinaryConfigured = () => {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  return Boolean(cloudName && apiKey && apiSecret);
};

export const storeUploadedImages = async (files = []) => {
  if (!files.length) {
    return [];
  }

  return Promise.all(files.map((file) => (isCloudinaryConfigured() ? uploadFileToCloudinary(file) : storeFileLocally(file))));
};

export const removeStoredImages = async (images = []) => {
  await Promise.all(
    images.map(async (image) => {
      if (!image?.url && !image?.filename) {
        return;
      }

      try {
        if (image.url?.startsWith("/uploads/")) {
          await fs.unlink(path.join(propertyUploadDir, image.filename));
          return;
        }

        if (isCloudinaryConfigured() && (isCloudinaryUrl(image.url) || String(image.filename || "").includes("/"))) {
          await destroyCloudinaryAsset(String(image.filename || ""));
        }
      } catch (error) {
        if (error.code !== "ENOENT") {
          console.error(`Failed to remove stored image ${image.filename || image.url}`, error);
        }
      }
    })
  );
};
