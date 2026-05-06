import { AppError } from "../middleware/errorHandler.js";
import { removeStoredAssets, storeUploadedMedia } from "../utils/cloudinary.js";

export const uploadMediaFiles = async (req, res, next) => {
  let storedAssets = [];

  try {
    const files = req.files || [];

    if (files.length === 0) {
      throw new AppError(400, "At least one media file is required.");
    }

    storedAssets = await storeUploadedMedia(files);

    return res.status(201).json({
      success: true,
      items: storedAssets.map((item, index) => ({
        type: item.type,
        url: item.url,
        path: item.url,
        filename: item.filename,
        label: item.type === "video" ? `Video ${index + 1}` : `Image ${index + 1}`
      }))
    });
  } catch (error) {
    await removeStoredAssets(storedAssets);
    return next(error);
  }
};
