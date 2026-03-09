import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};

const safeUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt
  };
};

const normalizeRole = (value) => {
  if (value === "admin" || value === "seller" || value === "visitor") {
    return value;
  }

  return "visitor";
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone = "", role: requestedRole, adminKey } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
    }

    const existing = await User.findOne({ email: String(email).toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered." });
    }

    const role = normalizeRole(requestedRole);

    if (role === "admin") {
      if (!process.env.ADMIN_REGISTRATION_KEY || adminKey !== process.env.ADMIN_REGISTRATION_KEY) {
        return res.status(403).json({ success: false, message: "Admin registration is not permitted." });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone || "").trim(),
      password: hashedPassword,
      role
    });

    const token = signToken(user);

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      token,
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
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const user = await User.findOne({ email: String(email).toLowerCase() }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "User account is disabled." });
    }

    const token = signToken(user);

    return res.json({
      success: true,
      message: "Login successful.",
      token,
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
