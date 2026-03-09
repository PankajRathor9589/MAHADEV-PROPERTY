import fs from "node:fs/promises";
import path from "node:path";
import Inquiry from "../models/Inquiry.js";
import Property from "../models/Property.js";
import { propertyUploadDir } from "../middleware/upload.js";

const hasKey = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const toNumber = (value, fallback) => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const converted = Number(value);
  return Number.isNaN(converted) ? fallback : converted;
};

const toBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value === "boolean") {
    return value;
  }

  const normalized = String(value).toLowerCase();
  if (normalized === "true" || normalized === "1" || normalized === "yes") {
    return true;
  }

  if (normalized === "false" || normalized === "0" || normalized === "no") {
    return false;
  }

  return fallback;
};

const parseArrayInput = (value, fallback = []) => {
  if (value === undefined || value === null) {
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
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return fallback;
};

const normalizeUploadedImages = (files = []) => {
  return files.map((file) => ({
    url: `/uploads/properties/${file.filename}`,
    filename: file.filename
  }));
};

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
      if (!filename) {
        return;
      }

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

const buildPayload = (input, current = {}) => {
  const currentLocation = current.location || {};
  const currentFeatures = current.features || {};

  return {
    title: hasKey(input, "title") ? String(input.title || "").trim() : current.title,
    propertyType: hasKey(input, "propertyType") ? input.propertyType : current.propertyType,
    price: hasKey(input, "price") ? toNumber(input.price, current.price) : current.price,
    areaSqFt: hasKey(input, "areaSqFt") ? toNumber(input.areaSqFt, current.areaSqFt) : current.areaSqFt,
    location: {
      state: hasKey(input, "state") ? String(input.state || "").trim() : currentLocation.state,
      city: hasKey(input, "city") ? String(input.city || "").trim() : currentLocation.city,
      locality: hasKey(input, "locality")
        ? String(input.locality || "").trim()
        : currentLocation.locality,
      address: hasKey(input, "address") ? String(input.address || "").trim() : currentLocation.address,
      pincode: hasKey(input, "pincode") ? String(input.pincode || "").trim() : currentLocation.pincode,
      latitude: hasKey(input, "latitude")
        ? toNumber(input.latitude, currentLocation.latitude)
        : currentLocation.latitude,
      longitude: hasKey(input, "longitude")
        ? toNumber(input.longitude, currentLocation.longitude)
        : currentLocation.longitude,
      mapPinUrl: hasKey(input, "mapPinUrl")
        ? String(input.mapPinUrl || "").trim()
        : currentLocation.mapPinUrl || ""
    },
    features: {
      bedrooms: hasKey(input, "bedrooms")
        ? toNumber(input.bedrooms, currentFeatures.bedrooms || 0)
        : currentFeatures.bedrooms || 0,
      bathrooms: hasKey(input, "bathrooms")
        ? toNumber(input.bathrooms, currentFeatures.bathrooms || 0)
        : currentFeatures.bathrooms || 0,
      parking: hasKey(input, "parking")
        ? toBoolean(input.parking, Boolean(currentFeatures.parking))
        : Boolean(currentFeatures.parking),
      waterSupply: hasKey(input, "waterSupply")
        ? toBoolean(input.waterSupply, Boolean(currentFeatures.waterSupply))
        : hasKey(input, "water")
          ? toBoolean(input.water, Boolean(currentFeatures.waterSupply))
          : Boolean(currentFeatures.waterSupply),
      electricity: hasKey(input, "electricity")
        ? toBoolean(input.electricity, Boolean(currentFeatures.electricity))
        : Boolean(currentFeatures.electricity),
      roadAccess: hasKey(input, "roadAccess")
        ? toBoolean(input.roadAccess, Boolean(currentFeatures.roadAccess))
        : Boolean(currentFeatures.roadAccess)
    },
    description: hasKey(input, "description")
      ? String(input.description || "").trim()
      : current.description,
    nearbyPlaces: hasKey(input, "nearbyPlaces")
      ? parseArrayInput(input.nearbyPlaces, [])
      : current.nearbyPlaces || [],
    contactPhone: hasKey(input, "contactPhone")
      ? String(input.contactPhone || "").trim()
      : current.contactPhone || "",
    isSold: hasKey(input, "isSold") ? toBoolean(input.isSold, Boolean(current.isSold)) : Boolean(current.isSold),
    listingStatus: hasKey(input, "listingStatus") ? input.listingStatus : current.listingStatus,
    rejectedReason: hasKey(input, "rejectedReason")
      ? String(input.rejectedReason || "").trim()
      : current.rejectedReason || ""
  };
};

const canManageProperty = (property, user) => {
  if (!user) {
    return false;
  }

  if (user.role === "admin") {
    return true;
  }

  return property.seller.toString() === user._id.toString();
};

const canViewProperty = (property, user) => {
  if (property.listingStatus === "approved") {
    return true;
  }

  if (!user) {
    return false;
  }

  if (user.role === "admin") {
    return true;
  }

  return user.role === "seller" && property.seller.toString() === user._id.toString();
};

export const createProperty = async (req, res, next) => {
  try {
    const payload = buildPayload(req.body, {});
    payload.images = normalizeUploadedImages(req.files);
    payload.seller = req.user.role === "admin" && req.body.sellerId ? req.body.sellerId : req.user._id;

    if (req.user.role === "admin") {
      const listingStatus = req.body.listingStatus || "approved";
      payload.listingStatus = listingStatus === "rejected" ? "pending" : listingStatus;
      if (payload.listingStatus === "approved") {
        payload.approvedBy = req.user._id;
        payload.approvedAt = new Date();
      }
    } else {
      payload.listingStatus = "pending";
      payload.approvedBy = null;
      payload.approvedAt = null;
    }

    const property = await Property.create(payload);
    const populated = await Property.findById(property._id).populate("seller", "name phone email");

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
      state,
      city,
      locality,
      propertyType,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      bedrooms,
      minBedrooms,
      status,
      mine,
      includeSold,
      page = 1,
      limit = 12
    } = req.query;

    const filters = {};
    const authUser = req.user;
    const isAdmin = authUser?.role === "admin";
    const isSeller = authUser?.role === "seller";
    const requestingOwn = mine === "true";

    if (!isAdmin && !(isSeller && requestingOwn)) {
      filters.listingStatus = "approved";
    }

    if (isSeller && requestingOwn) {
      filters.seller = authUser._id;
    }

    if (isAdmin && req.query.sellerId) {
      filters.seller = req.query.sellerId;
    }

    if (status && (isAdmin || (isSeller && requestingOwn))) {
      filters.listingStatus = status;
    }

    if (includeSold !== "true") {
      filters.isSold = false;
    }

    if (propertyType) {
      filters.propertyType = propertyType;
    }

    if (state) {
      filters["location.state"] = new RegExp(state, "i");
    }

    if (city) {
      filters["location.city"] = new RegExp(city, "i");
    }

    if (locality) {
      filters["location.locality"] = new RegExp(locality, "i");
    }

    if (search) {
      filters.$or = [
        { title: new RegExp(search, "i") },
        { "location.locality": new RegExp(search, "i") },
        { "location.city": new RegExp(search, "i") },
        { description: new RegExp(search, "i") }
      ];
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

    if (minArea || maxArea) {
      filters.areaSqFt = {};
      if (minArea) {
        filters.areaSqFt.$gte = Number(minArea);
      }
      if (maxArea) {
        filters.areaSqFt.$lte = Number(maxArea);
      }
    }

    if (bedrooms) {
      filters["features.bedrooms"] = Number(bedrooms);
    } else if (minBedrooms) {
      filters["features.bedrooms"] = { $gte: Number(minBedrooms) };
    }

    const currentPage = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(50, Math.max(1, Number(limit) || 12));

    const [total, properties] = await Promise.all([
      Property.countDocuments(filters),
      Property.find(filters)
        .populate("seller", "name phone email")
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
      .populate("seller", "name phone email")
      .populate("approvedBy", "name email");

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found." });
    }

    if (!canViewProperty(property, req.user)) {
      return res.status(404).json({ success: false, message: "Property not available." });
    }

    const canIncrementView = property.listingStatus === "approved";
    if (canIncrementView && (!req.user || !canManageProperty(property, req.user))) {
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
      return res.status(404).json({ success: false, message: "Property not found." });
    }

    if (!canManageProperty(property, req.user)) {
      return res.status(403).json({ success: false, message: "Not allowed to update this property." });
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

    if (req.user.role === "seller") {
      payload.listingStatus = "pending";
      payload.approvedBy = null;
      payload.approvedAt = null;
      payload.rejectedReason = "";
    }

    if (req.user.role === "admin" && payload.listingStatus === "approved") {
      payload.approvedBy = req.user._id;
      payload.approvedAt = new Date();
      payload.rejectedReason = "";
    }

    const updated = await Property.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    }).populate("seller", "name phone email");

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
      return res.status(404).json({ success: false, message: "Property not found." });
    }

    if (!canManageProperty(property, req.user)) {
      return res.status(403).json({ success: false, message: "Not allowed to delete this property." });
    }

    await removeFiles(property.images.map((image) => image.filename));
    await Inquiry.deleteMany({ property: property._id });
    await property.deleteOne();

    return res.json({ success: true, message: "Property deleted successfully." });
  } catch (error) {
    return next(error);
  }
};

export const markPropertySold = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found." });
    }

    if (!canManageProperty(property, req.user)) {
      return res.status(403).json({ success: false, message: "Not allowed to modify this property." });
    }

    property.isSold = true;
    await property.save();

    return res.json({
      success: true,
      message: "Property marked as sold.",
      data: property
    });
  } catch (error) {
    return next(error);
  }
};

export const updatePropertyApproval = async (req, res, next) => {
  try {
    const { status, rejectedReason = "" } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be approved or rejected." });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found." });
    }

    property.listingStatus = status;

    if (status === "approved") {
      property.approvedBy = req.user._id;
      property.approvedAt = new Date();
      property.rejectedReason = "";
    } else {
      property.approvedBy = null;
      property.approvedAt = null;
      property.rejectedReason = String(rejectedReason || "").trim();
    }

    await property.save();

    const populated = await Property.findById(property._id).populate("seller", "name phone email");

    return res.json({
      success: true,
      message: `Property ${status} successfully.`,
      data: populated
    });
  } catch (error) {
    return next(error);
  }
};

export const createPropertyInquiry = async (req, res, next) => {
  try {
    const { buyerName, buyerPhone, buyerEmail = "", message = "" } = req.body;

    if (!buyerName || !buyerPhone) {
      return res.status(400).json({ success: false, message: "Buyer name and phone are required." });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found." });
    }

    if (property.listingStatus !== "approved") {
      return res.status(400).json({ success: false, message: "Inquiries are accepted only for approved listings." });
    }

    const inquiry = await Inquiry.create({
      property: property._id,
      seller: property.seller,
      buyerName: String(buyerName).trim(),
      buyerPhone: String(buyerPhone).trim(),
      buyerEmail: String(buyerEmail || "").trim().toLowerCase(),
      message: String(message || "").trim()
    });

    return res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully.",
      data: inquiry
    });
  } catch (error) {
    return next(error);
  }
};
