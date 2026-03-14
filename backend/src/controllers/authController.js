import { User } from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, phone, role, adminKey } = req.body;

    // check existing email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // admin registration protection
    if (role === "admin") {
      if (!adminKey || adminKey !== process.env.ADMIN_REGISTRATION_KEY) {
        return res.status(403).json({
          message: "Invalid admin registration key"
        });
      }
    }

    // create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || "buyer"
    });

    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
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

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: generateToken(user)
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


export const me = async (req, res) => {
  return res.json({ user: req.user });
};