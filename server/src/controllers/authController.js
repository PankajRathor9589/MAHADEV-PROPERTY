import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AppError } from "../middleware/errorHandler.js";
import { ensureAdminSessionUser } from "../utils/adminSession.js";

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });

const sanitizeUser = (user) => (typeof user?.toJSON === "function" ? user.toJSON() : user);

export const register = async (req, res, next) => {
  try {
    const { name, email, phone = "", password } = req.body;

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

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      phone: String(phone || "").trim(),
      password: String(password),
      role: "user"
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
