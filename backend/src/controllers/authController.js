import crypto from "crypto";
import { User } from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

const ADMIN_SESSION_EMAIL = "admin.session@sagarinfra.local";
const ADMIN_SESSION_NAME = "Prashant Rathor";
const ADMIN_SESSION_PHONE = "7692016188";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  isActive: user.isActive !== false
});

const normalizeRole = (role) => {
  const normalized = String(role || "buyer").trim().toLowerCase();

  if (["buyer", "user", "visitor"].includes(normalized)) {
    return "buyer";
  }

  if (normalized === "agent") {
    return "agent";
  }

  if (normalized === "admin") {
    return "admin";
  }

  return "buyer";
};

const ensureAdminSessionUser = async () => {
  const email = String(process.env.ADMIN_SESSION_EMAIL || ADMIN_SESSION_EMAIL).trim().toLowerCase();
  const phone = String(process.env.ADMIN_SESSION_PHONE || ADMIN_SESSION_PHONE).trim();
  const existing = await User.findOne({ email }).select("+password");

  if (existing) {
    if (existing.role !== "admin") {
      throw new Error("Reserved admin session email is already assigned to a non-admin user.");
    }

    const updates = {};

    if (existing.isActive === false) {
      updates.isActive = true;
    }

    if (!existing.phone && phone) {
      updates.phone = phone;
    }

    if (Object.keys(updates).length > 0) {
      Object.assign(existing, updates);
      await existing.save();
    }

    return existing;
  }

  return User.create({
    name: String(process.env.ADMIN_SESSION_NAME || ADMIN_SESSION_NAME).trim(),
    email,
    phone,
    password: crypto.randomBytes(32).toString("hex"),
    role: "admin",
    isActive: true
  });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const normalizedRole = normalizeRole(role);

    // check existing email
    const existing = await User.findOne({ email: String(email || "").trim().toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (normalizedRole === "admin") {
      return res.status(403).json({
        message: "Admin accounts cannot be created here. Use the secure admin access page instead."
      });
    }

    // create user
    const user = await User.create({
      name,
      email: String(email || "").trim().toLowerCase(),
      password,
      phone,
      role: normalizedRole
    });

    return res.status(201).json({
      user: sanitizeUser(user),
      token: generateToken(user)
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: String(email || "").trim().toLowerCase() });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({ message: "This account is inactive." });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        message: "Admin access requires the secure admin key login."
      });
    }

    return res.json({
      user: sanitizeUser(user),
      token: generateToken(user)
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const user = await ensureAdminSessionUser();

    return res.json({
      user: sanitizeUser(user),
      token: generateToken(user, { authType: "admin_key" }, { expiresIn: process.env.ADMIN_SESSION_EXPIRES_IN || "8h" })
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


export const me = async (req, res) => {
  return res.json({ user: sanitizeUser(req.user) });
};
