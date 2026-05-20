import User from "../models/User.js";
import { AppError } from "../middleware/errorHandler.js";

export const ensureAdminSessionUser = async ({ password } = {}) => {
  const sessionEmail = String(process.env.ADMIN_SESSION_EMAIL || "admin.session@sagarinfra.local")
    .trim()
    .toLowerCase();
  const sessionName = String(process.env.ADMIN_SESSION_NAME || "Sagar Infra Admin").trim();
  const sessionPhone = String(process.env.ADMIN_SESSION_PHONE || "7692016188").trim();
  const sessionPassword = String(password || process.env.ADMIN_PASSWORD || process.env.ADMIN_KEY || "").trim();

  if (!sessionPassword || sessionPassword.length < 6) {
    throw new AppError(500, "ADMIN_PASSWORD or ADMIN_KEY must be configured with at least 6 characters.");
  }

  const existingUser = await User.findOne({ email: sessionEmail }).select("+password");

  if (existingUser) {
    if (existingUser.role !== "admin") {
      throw new AppError(409, "Reserved admin session email is already in use.");
    }

    let shouldSave = false;

    if (!existingUser.isActive) {
      existingUser.isActive = true;
      shouldSave = true;
    }

    if (!existingUser.phone && sessionPhone) {
      existingUser.phone = sessionPhone;
      shouldSave = true;
    }

    const passwordMatches = await existingUser.matchPassword(sessionPassword);
    if (!passwordMatches) {
      existingUser.password = sessionPassword;
      shouldSave = true;
    }

    if (shouldSave) {
      await existingUser.save();
    }

    return existingUser;
  }

  return User.create({
    name: sessionName,
    email: sessionEmail,
    phone: sessionPhone,
    password: sessionPassword,
    role: "admin",
    isActive: true
  });
};
