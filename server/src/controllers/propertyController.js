import fs from "node:fs/promises";
import path from "node:path";
import Inquiry from "../models/Inquiry.js";
import Property from "../models/Property.js";
import User from "../models/User.js";
import { AppError } from "../middleware/errorHandler.js";
import { propertyUploadDir } from "../middleware/upload.js";

const hasKey = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const toNumber = (value, fallback) => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const converted = Number(value);
  return Number.isNaN(converted) ? fallback : converted;
};

const parseArrayInput = (value, fallback = []) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch (error) {
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
  }

  return fallback;
};

const normalizeUploadedImages = (files = []) =>
  files.map((file) => ({
    url: `/uploads/properties/${file.filename}`,
    filename: file.filename
  }));

const parseRetainedImages = (value, fallback = []) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  let parsed = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  }

  if (!Array.isArray(parsed)) {
    return fallback;
  }

  return parsed
    .filter((item) => item && typeof item === "object")
    .filter((item) => item.filename && item.url)
    .map((item) => ({ filename: item.filename, url: item.url }));
};

const removeFiles = async (filenames = []) => {
  await Promise.all(
    filenames.map(async (filename) => {
      if (!filename) return;

      const fullPath = path.join(propertyUploadDir, filename);
      try {
        await fs.unlink(fullPath);
      } catch (error) {
        if (error.code !== "ENOENT") {
          console.error(`Failed to delete image ${filename}`, error);
        }
      }
    })
  );
};

const buildPayload = (input, current = {}) => ({
  title: hasKey(input, "title") ? String(input.title || "").trim() : current.title,
  description: hasKey(input, "description")
    ? String(input.description || "").trim()
    : current.description,
  propertyType: hasKey(input, "propertyType")
    ? String(input.propertyType || "").trim()
    : current.propertyType,
  price: hasKey(input, "price") ? toNumber(input.price, current.price) : current.price,
  location: hasKey(input, "location") ? String(input.location || "").trim() : current.location,
  city: hasKey(input, "city") ? String(input.city || "").trim() : current.city,
  bedrooms: hasKey(input, "bedrooms") ? toNumber(input.bedrooms, current.bedrooms || 0) : current.bedrooms || 0,
  bathrooms: hasKey(input, "bathrooms")
    ? toNumber(input.bathrooms, current.bathrooms || 0)
    : current.bathrooms || 0,
  area: hasKey(input, "area") ? toNumber(input.area, current.area) : current.area,
  amenities: hasKey(input, "amenities")
    ? parseArrayInput(input.amenities, current.amenities || [])
    : current.amenities || [],
  status: hasKey(input, "status") ? input.status : current.status,
  rejectedReason: hasKey(input, "rejectedReason")
    ? String(input.rejectedReason || "").trim()
    : current.rejectedReason || ""
});

const canManageProperty = (property, user) => {
  if (!user) return false;
  if (user.role === "admin") return true;
  return property.agent.toString() === user._id.toString();
};

const canViewProperty = (property, user) => {
  if (property.status === "approved") return true;
  if (!user) return false;
  if (user.role === "admin") return true;
  return user.role === "agent" && property.agent.toString() === user._id.toString();
};

export const createProperty = async (req, res, next) => {
  try {
    const payload = buildPayload(req.body, {});
    payload.images = normalizeUploadedImages(req.files);
    payload.agent = req.user.role === "admin" && req.body.agentId ? req.body.agentId : req.user._id;

    if (req.user.role === "admin") {
      const moderationStatus = req.body.status || "approved";
      payload.status = moderationStatus === "rejected" ? "pending" : moderationStatus;
      if (payload.status === "approved") {
        payload.approvedBy = req.user._id;
        payload.approvedAt = new Date();
      }
    } else {
      payload.status = "pending";
      payload.approvedBy = null;
      payload.approvedAt = null;
    }

    const property = await Property.create(payload);
    const populated = await Property.findById(property._id).populate("agent", "name phone email role");

    return res.status(201).json({
      success: true,
      message: "Property created successfully.",
      data: populated
    });
  } catch (error) {
    return next(error);
  }
};

export const getAllProperties = async (req, res, next) => {
  try {
    const {
      search,
      city,
      minPrice,
      maxPrice,
      propertyType,
      minArea,
      maxArea,
      bedrooms,
      minBedrooms,
      status,
      mine,
      page = 1,
      limit = 12
    } = req.query;

    const filters = {};
    const authUser = req.user;
    const isAdmin = authUser?.role === "admin";
    const isAgent = authUser?.role === "agent";
    const requestingOwn = mine === "true";

    if (!isAdmin && !(isAgent && requestingOwn)) {
      filters.status = "approved";
    }

    if (isAgent && requestingOwn) {
      filters.agent = authUser._id;
    }

    if (isAdmin && req.query.agentId) {
      filters.agent = req.query.agentId;
    }

    if (status && (isAdmin || (isAgent && requestingOwn))) {
      filters.status = status;
    }

    if (city) {
      filters.city = new RegExp(city, "i");
    }

    if (propertyType) {
      filters.propertyType = propertyType;
    }

    if (search) {
      filters.$or = [
        { title: new RegExp(search, "i") },
        { location: new RegExp(search, "i") },
        { city: new RegExp(search, "i") },
        { description: new RegExp(search, "i") }
      ];
    }

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    if (minArea || maxArea) {
      filters.area = {};
      if (minArea) filters.area.$gte = Number(minArea);
      if (maxArea) filters.area.$lte = Number(maxArea);
    }

    if (bedrooms) {
      filters.bedrooms = Number(bedrooms);
    } else if (minBedrooms) {
      filters.bedrooms = { $gte: Number(minBedrooms) };
    }

    const currentPage = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(50, Math.max(1, Number(limit) || 12));

    const [total, properties] = await Promise.all([
      Property.countDocuments(filters),
      Property.find(filters)
        .populate("agent", "name phone email role")
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
    ]);

    return res.json({
      success: true,
      data: properties,
      pagination: {
        page: currentPage,
        limit: pageSize,
        total,
        pages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("agent", "name phone email role")
      .populate("approvedBy", "name email role");

    if (!property) {
      throw new AppError(404, "Property not found.");
    }

    if (!canViewProperty(property, req.user)) {
      throw new AppError(404, "Property not available.");
    }

    if (property.status === "approved" && (!req.user || !canManageProperty(property, req.user))) {
      await Property.updateOne({ _id: property._id }, { $inc: { views: 1 } });
      property.views += 1;
    }

    return res.json({ success: true, data: property });
  } catch (error) {
    return next(error);
  }
};

export const updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      throw new AppError(404, "Property not found.");
    }

    if (!canManageProperty(property, req.user)) {
      throw new AppError(403, "Not allowed to update this property.");
    }

    const payload = buildPayload(req.body, property.toObject());
    const newImages = normalizeUploadedImages(req.files);
    const retainedImages = hasKey(req.body, "retainedImages")
      ? parseRetainedImages(req.body.retainedImages, property.images)
      : property.images;

    if (hasKey(req.body, "retainedImages")) {
      const removedImages = property.images.filter(
        (existing) => !retainedImages.some((item) => item.filename === existing.filename)
      );
      await removeFiles(removedImages.map((image) => image.filename));
    }

    payload.images = [...retainedImages, ...newImages];

    if (req.user.role === "agent") {
      payload.status = "pending";
      payload.approvedBy = null;
      payload.approvedAt = null;
      payload.rejectedReason = "";
    }

    if (req.user.role === "admin" && payload.status === "approved") {
      payload.approvedBy = req.user._id;
      payload.approvedAt = new Date();
      payload.rejectedReason = "";
    }

    const updated = await Property.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    }).populate("agent", "name phone email role");

    return res.json({
      success: true,
      message: "Property updated successfully.",
      data: updated
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      throw new AppError(404, "Property not found.");
    }

    if (!canManageProperty(property, req.user)) {
      throw new AppError(403, "Not allowed to delete this property.");
    }

    await removeFiles(property.images.map((image) => image.filename));
    await Inquiry.deleteMany({ property: property._id });
    await User.updateMany({ favorites: property._id }, { $pull: { favorites: property._id } });
    await property.deleteOne();

    return res.json({ success: true, message: "Property deleted successfully." });
  } catch (error) {
    return next(error);
  }
};
