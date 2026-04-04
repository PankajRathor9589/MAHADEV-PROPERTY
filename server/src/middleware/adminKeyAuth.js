import { AppError } from "./errorHandler.js";

export const validateAdminKey = (req, res, next) => {
  const adminKey = String(req.body?.adminKey || "").trim();

  if (!process.env.ADMIN_SECRET_KEY) {
    return next(new AppError(500, "ADMIN_SECRET_KEY is not configured."));
  }

  if (!adminKey) {
    return next(new AppError(400, "Admin key is required."));
  }

  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  return next();
};
