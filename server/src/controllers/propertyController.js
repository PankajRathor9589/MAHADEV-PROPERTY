import fs from "node:fs/promises";
import path from "node:path";
import Inquiry from "../models/Inquiry.js";
import Property from "../models/Property.js";
import User from "../models/User.js";
import { AppError } from "../middleware/errorHandler.js";
import { propertyUploadDir } from "../middleware/upload.js";

const hasKey = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const toNumber = (value, fallback = 0) => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const toOptionalNumber = (value, fallback = null) => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
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
      const parsedValue = JSON.parse(value);
      if (Array.isArray(parsedValue)) {
        return parsedValue.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch (error) {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return fallback;
};

const parseRetainedImages = (value, fallback = []) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  let parsedValue = value;
  if (typeof value === "string") {
    try {
      parsedValue = JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  }

  if (!Array.isArray(parsedValue)) {
    return fallback;
  }

  return parsedValue
    .filter((item) => item && typeof item === "object" && item.filename && item.url)
    .map((item) => ({
      filename: String(item.filename),
      url: String(item.url)
    }));
};

const normalizeUploadedImages = (files = []) =>
  files.map((file) => ({
    filename: file.filename,
    url: `/uploads/properties/${file.filename}`
  }));

const removeFiles = async (filenames = []) => {
  await Promise.all(
    filenames.map(async (filename) => {
      if (!filename) {
        return;
      }

      const filePath = path.join(propertyUploadDir, filename);
      try {
        await fs.unlink(filePath);
      } catch (error) {
        if (error.code !== "ENOENT") {
          console.error(`Failed to remove file ${filename}`, error);
        }
      }
    })
  );
};

const getSortOption = (value) => {
  const sortBy = String(value || "latest");

  if (sortBy === "priceAsc") {
    return { price: 1, createdAt: -1 };
  }

  if (sortBy === "priceDesc") {
    return { price: -1, createdAt: -1 };
  }

  if (sortBy === "popular") {
    return { views: -1, createdAt: -1 };
  }

  return { createdAt: -1 };
};

const buildLocation = (input, current = {}) => {
  const currentCoordinates = current.coordinates || {};

  return {
    city: hasKey(input, "city") ? String(input.city || "").trim() : current.city,
    state: hasKey(input, "state") ? String(input.state || "").trim() : current.state,
    address: hasKey(input, "address") ? String(input.address || "").trim() : current.address,
    landmark: hasKey(input, "landmark") ? String(input.landmark || "").trim() : current.landmark || "",
    pincode: hasKey(input, "pincode") ? String(input.pincode || "").trim() : current.pincode || "",
    coordinates: {
      lat: hasKey(input, "latitude")
        ? toOptionalNumber(input.latitude, currentCoordinates.lat ?? null)
        : currentCoordinates.lat ?? null,
      lng: hasKey(input, "longitude")
        ? toOptionalNumber(input.longitude, currentCoordinates.lng ?? null)
        : currentCoordinates.lng ?? null
    }
  };
};

const buildPayload = (input, current = {}, user) => ({
  title: hasKey(input, "title") ? String(input.title || "").trim() : current.title,
  description: hasKey(input, "description")
    ? String(input.description || "").trim()
    : current.description,
  listingType: hasKey(input, "listingType")
    ? String(input.listingType || "").trim().toLowerCase()
    : current.listingType,
  category: hasKey(input, "category") ? String(input.category || "").trim() : current.category,
  price: hasKey(input, "price") ? toNumber(input.price, current.price) : current.price,
  bedrooms: hasKey(input, "bedrooms")
    ? toNumber(input.bedrooms, current.bedrooms || 0)
    : current.bedrooms || 0,
  bathrooms: hasKey(input, "bathrooms")
    ? toNumber(input.bathrooms, current.bathrooms || 0)
    : current.bathrooms || 0,
  area: hasKey(input, "area") ? toNumber(input.area, current.area) : current.area,
  amenities: hasKey(input, "amenities")
    ? parseArrayInput(input.amenities, current.amenities || [])
    : current.amenities || [],
  location: buildLocation(input, current.location || {}),
  contactName: hasKey(input, "contactName")
    ? String(input.contactName || "").trim()
    : current.contactName || user?.name || "",
  contactEmail: hasKey(input, "contactEmail")
    ? String(input.contactEmail || "")
        .trim()
        .toLowerCase()
    : current.contactEmail || user?.email || "",
  contactPhone: hasKey(input, "contactPhone")
    ? String(input.contactPhone || "").trim()
    : current.contactPhone || user?.phone || "",
  approvalStatus: hasKey(input, "approvalStatus")
    ? String(input.approvalStatus || "").trim().toLowerCase()
    : current.approvalStatus,
  rejectionReason: hasKey(input, "rejectionReason")
    ? String(input.rejectionReason || "").trim()
    : current.rejectionReason || ""
});

const canManageProperty = (property, user) => {
  if (!user) {
    return false;
  }

  return user.role === "admin" || property.postedBy.toString() === user._id.toString();
};

const canViewProperty = (property, user) => {
  if (property.approvalStatus === "approved") {
    return true;
  }

  if (!user) {
    return false;
  }

  return user.role === "admin" || property.postedBy.toString() === user._id.toString();
};

const populatePropertyQuery = (query) =>
  query.populate("postedBy", "name email phone role isActive createdAt");

export const getMyProperties = async (req, res, next) => {
  req.query.mine = "true";
  return getAllProperties(req, res, next);
};

export const createProperty = async (req, res, next) => {
  try {
    const payload = buildPayload(req.body, {}, req.user);
    payload.images = normalizeUploadedImages(req.files);
    payload.postedBy = req.user._id;

    if (!payload.contactName) {
      payload.contactName = req.user.name;
    }

    if (!payload.contactEmail) {
      payload.contactEmail = req.user.email;
    }

    if (!payload.contactPhone) {
      payload.contactPhone = req.user.phone || "";
    }

    if (req.user.role === "admin") {
      payload.approvalStatus = ["approved", "rejected"].includes(payload.approvalStatus)
        ? payload.approvalStatus
        : "approved";
      payload.rejectionReason = payload.approvalStatus === "rejected" ? payload.rejectionReason : "";
    } else {
      payload.approvalStatus = "pending";
      payload.rejectionReason = "";
    }

    const property = await Property.create(payload);
    const populatedProperty = await populatePropertyQuery(Property.findById(property._id));

    return res.status(201).json({
      success: true,
      message: "Property created successfully.",
      data: populatedProperty
    });
  } catch (error) {
    await removeFiles((req.files || []).map((file) => file.filename));
    return next(error);
  }
};

export const getAllProperties = async (req, res, next) => {
  try {
    const {
      search,
      city,
      state,
      listingType,
      category,
      minPrice,
      maxPrice,
      bedrooms,
      featured,
      sort = "latest",
      mine,
      page = 1,
      limit = 12
    } = req.query;

    const currentPage = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(50, Math.max(1, Number(limit) || 12));
    const filters = {};
    const andFilters = [];
    const requestingMine = mine === "true" && req.user;

    if (requestingMine) {
      filters.postedBy = req.user._id;
    } else {
      filters.approvalStatus = "approved";
    }

    if (city) {
      filters["location.city"] = new RegExp(String(city).trim(), "i");
    }

    if (state) {
      filters["location.state"] = new RegExp(String(state).trim(), "i");
    }

    if (listingType) {
      filters.listingType = String(listingType).trim().toLowerCase();
    }

    if (category) {
      filters.category = String(category).trim();
    }

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) {
        filters.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        filters.price.$lte = Number(maxPrice);
      }
    }

    if (bedrooms) {
      filters.bedrooms = { $gte: Number(bedrooms) };
    }

    if (featured === "true") {
      andFilters.push({
        isFeatured: true,
        $or: [{ featuredUntil: null }, { featuredUntil: { $gte: new Date() } }]
      });
    }

    if (search) {
      const searchRegex = new RegExp(String(search).trim(), "i");
      andFilters.push({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { category: searchRegex },
          { "location.city": searchRegex },
          { "location.state": searchRegex },
          { "location.address": searchRegex },
          { "location.landmark": searchRegex }
        ]
      });
    }

    if (andFilters.length > 0) {
      filters.$and = andFilters;
    }

    const [total, properties] = await Promise.all([
      Property.countDocuments(filters),
      populatePropertyQuery(
        Property.find(filters)
          .sort(getSortOption(sort))
          .skip((currentPage - 1) * pageSize)
          .limit(pageSize)
      )
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
    const property = await populatePropertyQuery(Property.findById(req.params.id));

    if (!property) {
      throw new AppError(404, "Property not found.");
    }

    if (!canViewProperty(property, req.user)) {
      throw new AppError(404, "Property not available.");
    }

    if (property.approvalStatus === "approved" && !canManageProperty(property, req.user)) {
      await Property.updateOne({ _id: property._id }, { $inc: { views: 1 } });
      property.views += 1;
    }

    return res.json({
      success: true,
      data: property
    });
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
      throw new AppError(403, "You are not allowed to update this property.");
    }

    const payload = buildPayload(req.body, property.toObject(), req.user);
    const newImages = normalizeUploadedImages(req.files);
    const retainedImages = hasKey(req.body, "retainedImages")
      ? parseRetainedImages(req.body.retainedImages, property.images)
      : property.images;

    if (hasKey(req.body, "retainedImages")) {
      const removedImages = property.images.filter(
        (image) => !retainedImages.some((retained) => retained.filename === image.filename)
      );
      await removeFiles(removedImages.map((image) => image.filename));
    }

    payload.images = [...retainedImages, ...newImages];

    if (req.user.role !== "admin") {
      // Any user-side edit should go back through moderation before becoming public again.
      payload.approvalStatus = "pending";
      payload.rejectionReason = "";
      payload.isFeatured = property.isFeatured;
      payload.featuredUntil = property.featuredUntil;
    } else if (!["pending", "approved", "rejected"].includes(payload.approvalStatus)) {
      payload.approvalStatus = property.approvalStatus;
    }

    const updatedProperty = await populatePropertyQuery(
      Property.findByIdAndUpdate(req.params.id, payload, {
        new: true,
        runValidators: true
      })
    );

    return res.json({
      success: true,
      message:
        req.user.role === "admin"
          ? "Property updated successfully."
          : "Property updated and sent for admin review.",
      data: updatedProperty
    });
  } catch (error) {
    await removeFiles((req.files || []).map((file) => file.filename));
    return next(error);
  }
};

export const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      throw new AppError(404, "Property not found.");
    }

    if (req.user.role !== "admin") {
      throw new AppError(403, "Only admins can delete properties.");
    }

    await removeFiles(property.images.map((image) => image.filename));
    await Inquiry.deleteMany({ property: property._id });
    await User.updateMany({ favorites: property._id }, { $pull: { favorites: property._id } });
    await property.deleteOne();

    return res.json({
      success: true,
      message: "Property deleted successfully."
    });
  } catch (error) {
    return next(error);
  }
};

export const updatePropertyApproval = async (req, res, next) => {
  try {
    const { approvalStatus, rejectionReason = "" } = req.body;

    if (!["approved", "rejected", "pending"].includes(String(approvalStatus))) {
      throw new AppError(400, "approvalStatus must be approved, rejected, or pending.");
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      throw new AppError(404, "Property not found.");
    }

    property.approvalStatus = String(approvalStatus);
    property.rejectionReason =
      property.approvalStatus === "rejected" ? String(rejectionReason || "").trim() : "";

    await property.save();

    const populatedProperty = await populatePropertyQuery(Property.findById(property._id));

    return res.json({
      success: true,
      message: `Property marked as ${property.approvalStatus}.`,
      data: populatedProperty
    });
  } catch (error) {
    return next(error);
  }
};

export const updatePropertyFeatured = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      throw new AppError(404, "Property not found.");
    }

    const isFeatured = req.body.isFeatured === true || req.body.isFeatured === "true";
    const featuredDays = Math.max(1, Number(req.body.featuredDays) || 30);

    property.isFeatured = isFeatured;
    property.featuredUntil = isFeatured
      ? new Date(Date.now() + featuredDays * 24 * 60 * 60 * 1000)
      : null;

    await property.save();

    const populatedProperty = await populatePropertyQuery(Property.findById(property._id));

    return res.json({
      success: true,
      message: isFeatured ? "Property marked as featured." : "Featured status removed.",
      data: populatedProperty
    });
  } catch (error) {
    return next(error);
  }
};
