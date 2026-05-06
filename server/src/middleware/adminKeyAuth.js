import { AppError } from "./errorHandler.js";

export const validateAdminKey = (req, res, next) => {
  const adminKey = String(req.body?.key || req.body?.adminKey || "").trim();
  const configuredAdminKey = String(process.env.ADMIN_KEY || process.env.ADMIN_SECRET_KEY || "").trim();

  if (!configuredAdminKey) {
    return next(new AppError(500, "ADMIN_KEY is not configured."));
  }

  if (!adminKey) {
    return next(new AppError(400, "Admin key is required."));
  }

  if (adminKey !== configuredAdminKey) {
    return next(new AppError(403, "Invalid admin key."));
  }

  return next();
};
