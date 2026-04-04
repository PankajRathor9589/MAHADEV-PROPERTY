import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AppError } from "../middleware/errorHandler.js";

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });

const sanitizeUser = (user) => (typeof user?.toJSON === "function" ? user.toJSON() : user);

const ensureAdminSessionUser = async () => {
  const sessionEmail = String(process.env.ADMIN_SESSION_EMAIL || "admin.session@sagarinfra.local")
    .trim()
    .toLowerCase();
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
    name: "Sagar Infra Admin",
    email: sessionEmail,
    phone: sessionPhone,
    password: crypto.randomBytes(32).toString("hex"),
    role: "admin",
    isActive: true
  });
};

const normalizeRole = (value) => {
  const normalized = String(value || "user").trim().toLowerCase();

  if (["buyer", "visitor", "seller", "agent"].includes(normalized)) {
    return "user";
  }

  return normalized === "admin" ? "admin" : "user";
};

export const register = async (req, res, next) => {
  try {
    const { name, email, phone = "", password, role: requestedRole, adminKey } = req.body;

    if (!name || !email || !password) {
      throw new AppError(400, "Name, email, and password are required.");
    }

    if (String(password).trim().length < 6) {
      throw new AppError(400, "Password must be at least 6 characters.");
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw new AppError(409, "An account with this email already exists.");
    }

    const role = normalizeRole(requestedRole);
    if (role === "admin") {
      if (!process.env.ADMIN_REGISTRATION_KEY || adminKey !== process.env.ADMIN_REGISTRATION_KEY) {
        throw new AppError(403, "Admin registration is not allowed.");
      }
    }

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      phone: String(phone || "").trim(),
      password: String(password),
      role
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token: signToken(user),
      user: sanitizeUser(user)
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(400, "Email and password are required.");
    }

    const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select("+password");
    if (!user) {
      throw new AppError(401, "Invalid email or password.");
    }

    const isValidPassword = await user.matchPassword(String(password));
    if (!isValidPassword) {
      throw new AppError(401, "Invalid email or password.");
    }

    if (!user.isActive) {
      throw new AppError(403, "Your account is currently disabled.");
    }

    return res.json({
      success: true,
      message: "Login successful.",
      token: signToken(user),
      user: sanitizeUser(user)
    });
  } catch (error) {
    return next(error);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const user = await ensureAdminSessionUser();
    const token = jwt.sign({ id: user._id, role: "admin", authType: "admin_key" }, process.env.JWT_SECRET, {
      expiresIn: process.env.ADMIN_SESSION_EXPIRES_IN || "8h"
    });

    return res.json({
      success: true,
      message: "Admin access granted.",
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return next(error);
  }
};

export const getMe = async (req, res) => {
  return res.json({
    success: true,
    user: sanitizeUser(req.user)
  });
};
