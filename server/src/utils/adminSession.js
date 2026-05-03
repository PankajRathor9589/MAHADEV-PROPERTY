import crypto from "node:crypto";
import User from "../models/User.js";
import { AppError } from "../middleware/errorHandler.js";

export const ensureAdminSessionUser = async () => {
  const sessionEmail = String(process.env.ADMIN_SESSION_EMAIL || "admin.session@sagarinfra.local")
    .trim()
    .toLowerCase();
  const sessionName = String(process.env.ADMIN_SESSION_NAME || "Sagar Infra Admin").trim();
  const sessionPhone = String(process.env.ADMIN_SESSION_PHONE || "7692016188").trim();
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

    if (shouldSave) {
      await existingUser.save();
    }

    return existingUser;
  }

  return User.create({
    name: sessionName,
    email: sessionEmail,
    phone: sessionPhone,
    password: crypto.randomBytes(32).toString("hex"),
    role: "admin",
    isActive: true
  });
};
