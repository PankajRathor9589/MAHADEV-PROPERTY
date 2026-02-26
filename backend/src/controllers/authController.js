import { User } from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

export const signup = async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "Email already exists" });

  const user = await User.create({ name, email, password, phone });
  return res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token: generateToken(user)
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  return res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token: generateToken(user)
  });
};

export const me = async (req, res) => {
  return res.json({ user: req.user });
};
