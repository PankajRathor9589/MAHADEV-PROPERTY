import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AppError } from "../middleware/errorHandler.js";

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });

const safeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isActive: user.isActive,
  favorites: user.favorites || [],
  createdAt: user.createdAt
});

const normalizeRole = (value) => {
  const normalized = String(value || "buyer").toLowerCase();

  if (normalized === "seller") return "agent";
  if (normalized === "visitor") return "buyer";

  if (["buyer", "agent", "admin"].includes(normalized)) {
    return normalized;
  }

  return "buyer";
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone = "", role: requestedRole, adminKey } = req.body;

    if (!name || !email || !password) {
      throw new AppError(400, "Name, email, and password are required.");
    }

    if (String(password).length < 6) {
      throw new AppError(400, "Password must be at least 6 characters.");
    }

    const existing = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (existing) {
      throw new AppError(409, "Email already registered.");
    }

    const role = normalizeRole(requestedRole);
    if (role === "admin") {
      if (!process.env.ADMIN_REGISTRATION_KEY || adminKey !== process.env.ADMIN_REGISTRATION_KEY) {
        throw new AppError(403, "Admin registration is not permitted.");
      }
    }

    const user = await User.create({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone || "").trim(),
      password: String(password),
      role
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      token: signToken(user),
      user: safeUser(user)
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

    const isValid = await user.matchPassword(password);
    if (!isValid) {
      throw new AppError(401, "Invalid email or password.");
    }

    if (!user.isActive) {
      throw new AppError(403, "User account is disabled.");
    }

    return res.json({
      success: true,
      message: "Login successful.",
      token: signToken(user),
      user: safeUser(user)
    });
  } catch (error) {
    return next(error);
  }
};

export const getMe = async (req, res) => {
  return res.json({
    success: true,
    user: safeUser(req.user)
  });
};
