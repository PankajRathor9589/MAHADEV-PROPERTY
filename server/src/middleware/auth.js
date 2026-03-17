import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AppError } from "./errorHandler.js";

const userSelectFields = "name email phone role isActive favorites createdAt";

const getTokenFromRequest = (req) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    return null;
  }

  return header.slice(7);
};

const resolveUserFromToken = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return User.findById(decoded.id).select(userSelectFields);
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      req.user = null;
      return next();
    }

    const user = await resolveUserFromToken(token);
    req.user = user && user.isActive ? user : null;
    return next();
  } catch (error) {
    req.user = null;
    return next();
  }
};

export const protect = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      throw new AppError(401, "Authentication required.");
    }

    const user = await resolveUserFromToken(token);

    if (!user || !user.isActive) {
      throw new AppError(401, "Invalid or inactive user.");
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error.statusCode ? error : new AppError(401, "Invalid or expired token."));
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(403, "Access denied."));
    }

    return next();
  };
};
