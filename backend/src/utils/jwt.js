import jwt from "jsonwebtoken";

export const generateToken = (user, extraPayload = {}, options = {}) =>
  jwt.sign(
    {
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
      ...extraPayload
    },
    process.env.JWT_SECRET,
    { expiresIn: options.expiresIn || process.env.JWT_EXPIRES_IN || "7d" }
  );
