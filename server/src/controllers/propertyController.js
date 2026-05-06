import { Types, isValidObjectId } from "mongoose";
import Inquiry from "../models/Inquiry.js";
import Property from "../models/Property.js";
import User from "../models/User.js";
import { AppError } from "../middleware/errorHandler.js";
import { removeStoredAssets, removeStoredImages, storeUploadedImages } from "../utils/cloudinary.js";

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

const uniqueStrings = (values = []) => [...new Set(values.map((item) => String(item || "").trim()).filter(Boolean))];

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

const parseMediaInput = (value, fallback = []) => {
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
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      type: ["image", "video", "youtube"].includes(String(item.type || "").trim())
        ? String(item.type).trim()
        : "image",
      url: String(item.url || item.path || "").trim(),
      filename: String(item.filename || "").trim(),
      label: String(item.label || "").trim()
    }))
    .filter((item) => item.url);
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

const normalizeCategory = (value, fallback = "Plot") => {
  const normalized = String(value || fallback).trim();

  if (["Flat", "Apartment"].includes(normalized)) {
    return "Apartment";
  }

  if (["Farm", "Farm Land", "Farm House"].includes(normalized)) {
    return "Farm House";
  }

  return normalized || fallback;
};

const toSlug = (value = "property") =>
  String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "property";

const buildPropertySlug = (title, identifier) => `${toSlug(title)}-${String(identifier).slice(-6).toLowerCase()}`;

const buildLocation = (input, current = {}) => {
  const currentCoordinates = current.coordinates || {};
  const locationLabel = String(input.location || input.locationText || "").trim();
  const nextAddress = hasKey(input, "address")
    ? String(input.address || "").trim()
    : locationLabel || current.address || "";
  const nextCity = hasKey(input, "city")
    ? String(input.city || "").trim()
    : current.city || "Sagar";
  const nextState = hasKey(input, "state")
    ? String(input.state || "").trim()
    : current.state || "Madhya Pradesh";

  return {
    city: nextCity,
    state: nextState,
    address: nextAddress,
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
    : current.description || "",
  listingType: hasKey(input, "listingType")
    ? String(input.listingType || "").trim().toLowerCase()
    : current.listingType || "sale",
  category: hasKey(input, "type")
    ? normalizeCategory(input.type, current.category || "Plot")
    : hasKey(input, "category")
      ? normalizeCategory(input.category, current.category || "Plot")
      : current.category || "Plot",
  price: hasKey(input, "price") ? toNumber(input.price, current.price ?? 0) : current.price ?? 0,
  bedrooms: hasKey(input, "bedrooms")
    ? toNumber(input.bedrooms, current.bedrooms || 0)
    : current.bedrooms || 0,
  bathrooms: hasKey(input, "bathrooms")
    ? toNumber(input.bathrooms, current.bathrooms || 0)
    : current.bathrooms || 0,
  area: hasKey(input, "area") ? toNumber(input.area, current.area ?? 0) : current.area ?? 0,
  amenities: hasKey(input, "amenities")
    ? parseArrayInput(input.amenities, current.amenities || [])
    : current.amenities || [],
  videos: hasKey(input, "videos")
    ? uniqueStrings(parseArrayInput(input.videos, current.videos || []))
    : current.videos || [],
  youtubeUrl: hasKey(input, "youtubeUrl")
    ? String(input.youtubeUrl || "").trim()
    : current.youtubeUrl || "",
  videoTourUrl: hasKey(input, "videoTourUrl")
    ? String(input.videoTourUrl || "").trim()
    : current.videoTourUrl || "",
  location: buildLocation(input, current.location || {}),
  contactName: hasKey(input, "contactName")
    ? String(input.contactName || "").trim()
    : current.contactName || user?.name || "Prashant Rathor",
  contactEmail: hasKey(input, "contactEmail")
    ? String(input.contactEmail || "")
        .trim()
        .toLowerCase()
    : current.contactEmail || user?.email || "",
  contactPhone: hasKey(input, "contactPhone")
    ? String(input.contactPhone || "").trim()
    : current.contactPhone || user?.phone || process.env.ADMIN_SESSION_PHONE || "7692016188",
  approvalStatus: hasKey(input, "approvalStatus")
    ? String(input.approvalStatus || "").trim().toLowerCase()
    : current.approvalStatus || "approved",
  rejectionReason: hasKey(input, "rejectionReason")
    ? String(input.rejectionReason || "").trim()
    : current.rejectionReason || ""
});

const buildMediaEntries = ({ images = [], videos = [], youtubeUrl = "", requestedMedia = [] }) => {
  const requestedVideoByUrl = new Map(
    requestedMedia
      .filter((item) => item.type === "video" && item.url)
      .map((item) => [item.url, item])
  );
  const requestedYoutubeByUrl = new Map(
    requestedMedia
      .filter((item) => item.type === "youtube" && item.url)
      .map((item) => [item.url, item])
  );
  const resolvedYoutubeUrl = youtubeUrl || requestedMedia.find((item) => item.type === "youtube")?.url || "";

  return [
    ...images
      .filter((item) => item?.url)
      .map((item) => ({
        type: "image",
        url: String(item.url),
        filename: String(item.filename || ""),
        label: ""
      })),
    ...uniqueStrings(videos).map((url, index) => {
      const requestedItem = requestedVideoByUrl.get(url);

      return {
        type: "video",
        url,
        filename: String(requestedItem?.filename || ""),
        label: String(requestedItem?.label || `Video ${index + 1}`)
      };
    }),
    ...(resolvedYoutubeUrl
      ? [
          {
            type: "youtube",
            url: resolvedYoutubeUrl,
            filename: "",
            label: String(requestedYoutubeByUrl.get(resolvedYoutubeUrl)?.label || "YouTube Tour")
          }
        ]
      : [])
  ];
};

const validatePropertyPayload = (payload, { requireImages = false } = {}) => {
  const errors = [];

  if (!payload.title) {
    errors.push("Title is required.");
  } else if (payload.title.length < 4) {
    errors.push("Title must be at least 4 characters.");
  }

  if (!payload.description) {
    errors.push("Description is required.");
  } else if (payload.description.length < 20) {
    errors.push("Description must be at least 20 characters.");
  }

  if (!Number.isFinite(payload.price) || payload.price <= 0) {
    errors.push("Price must be greater than 0.");
  }

  if (!payload.location?.address && !payload.location?.city) {
    errors.push("Location is required.");
  }

  if (requireImages && (!Array.isArray(payload.images) || payload.images.length === 0)) {
    errors.push("At least one property image is required.");
  }

  if (errors.length > 0) {
    throw new AppError(400, "Validation failed.", errors);
  }
};

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

const findPropertyQuery = (identifier) => {
  if (isValidObjectId(identifier)) {
    return { _id: identifier };
  }

  return { slug: String(identifier).trim().toLowerCase() };
};

const findProperty = (identifier) => Property.findOne(findPropertyQuery(identifier));

export const getMyProperties = async (req, res, next) => {
  req.query.mine = "true";
  return getAllProperties(req, res, next);
};

export const createProperty = async (req, res, next) => {
  let storedImages = [];

  try {
    storedImages = await storeUploadedImages(req.files || []);
    const payload = buildPayload(req.body, {}, req.user);
    const requestedMedia = hasKey(req.body, "media") ? parseMediaInput(req.body.media, []) : [];
    payload._id = new Types.ObjectId();
    payload.slug = buildPropertySlug(payload.title, payload._id);
    payload.images = storedImages;
    payload.videos = uniqueStrings([...payload.videos, payload.videoTourUrl]);
    payload.videoTourUrl = payload.videoTourUrl || payload.videos[0] || "";
    payload.media = buildMediaEntries({
      images: payload.images,
      videos: payload.videos,
      youtubeUrl: payload.youtubeUrl,
      requestedMedia
    });
    payload.postedBy = req.user._id;

    if (!payload.contactName) {
      payload.contactName = req.user.name;
    }

    if (!payload.contactEmail) {
      payload.contactEmail = req.user.email;
    }

    if (!payload.contactPhone) {
      payload.contactPhone = req.user.phone || process.env.ADMIN_SESSION_PHONE || "";
    }

    payload.approvalStatus = ["approved", "rejected", "pending"].includes(payload.approvalStatus)
      ? payload.approvalStatus
      : "approved";
    payload.rejectionReason = payload.approvalStatus === "rejected" ? payload.rejectionReason : "";

    validatePropertyPayload(payload, { requireImages: true });

    const property = await Property.create(payload);
    const populatedProperty = await populatePropertyQuery(Property.findById(property._id));

    return res.status(201).json({
      success: true,
      message: "Property created successfully.",
      data: populatedProperty
    });
  } catch (error) {
    await removeStoredImages(storedImages);
    return next(error);
  }
};

export const getAllProperties = async (req, res, next) => {
  try {
    const {
      search,
      location,
      city,
      state,
      listingType,
      type,
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
    const isAdminScope = req.user?.role === "admin" && req.query.scope === "all";

    if (requestingMine) {
      filters.postedBy = req.user._id;
    } else if (!isAdminScope) {
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

    const resolvedCategory = type || category;
    if (resolvedCategory) {
      filters.category = normalizeCategory(resolvedCategory);
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

    if (location) {
      const locationRegex = new RegExp(String(location).trim(), "i");
      andFilters.push({
        $or: [
          { "location.city": locationRegex },
          { "location.state": locationRegex },
          { "location.address": locationRegex },
          { "location.landmark": locationRegex }
        ]
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
    const property = await populatePropertyQuery(Property.findOne(findPropertyQuery(req.params.id)));

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
  let storedImages = [];

  try {
    const property = await findProperty(req.params.id);

    if (!property) {
      throw new AppError(404, "Property not found.");
    }

    if (!canManageProperty(property, req.user)) {
      throw new AppError(403, "You are not allowed to update this property.");
    }

    const payload = buildPayload(req.body, property.toObject(), req.user);
    const requestedMedia = hasKey(req.body, "media")
      ? parseMediaInput(req.body.media, property.media || [])
      : property.media || [];
    storedImages = await storeUploadedImages(req.files || []);
    const retainedImages = hasKey(req.body, "retainedImages")
      ? parseRetainedImages(req.body.retainedImages, property.images)
      : property.images;
    const retainedVideos = hasKey(req.body, "retainedVideos")
      ? uniqueStrings(parseArrayInput(req.body.retainedVideos, property.videos || []))
      : property.videos || [];
    const removedImages = property.images.filter(
      (image) => !retainedImages.some((retained) => retained.filename === image.filename)
    );
    const removedVideoAssets = property.media?.length
      ? property.media
          .filter((item) => item.type === "video" && !retainedVideos.includes(item.url))
          .map((item) => ({
            url: item.url,
            filename: item.filename,
            type: "video"
          }))
      : (property.videos || []).filter((url) => !retainedVideos.includes(url)).map((url) => ({ url, type: "video" }));

    payload.slug = property.slug || buildPropertySlug(payload.title, property._id);
    payload.images = [...retainedImages, ...storedImages];
    payload.videos = uniqueStrings([
      ...(hasKey(req.body, "videos") ? parseArrayInput(req.body.videos, retainedVideos) : retainedVideos),
      payload.videoTourUrl
    ]);
    payload.videoTourUrl = payload.videoTourUrl || payload.videos[0] || "";
    payload.media = buildMediaEntries({
      images: payload.images,
      videos: payload.videos,
      youtubeUrl: payload.youtubeUrl,
      requestedMedia
    });

    if (!["pending", "approved", "rejected"].includes(payload.approvalStatus)) {
      payload.approvalStatus = property.approvalStatus;
    }

    payload.isFeatured = property.isFeatured;
    payload.featuredUntil = property.featuredUntil;

    validatePropertyPayload(payload, { requireImages: true });

    const updatedProperty = await populatePropertyQuery(
      Property.findByIdAndUpdate(property._id, payload, {
        new: true,
        runValidators: true
      })
    );

    if (hasKey(req.body, "retainedImages") && removedImages.length > 0) {
      await removeStoredImages(removedImages);
    }

    if (hasKey(req.body, "retainedVideos") && removedVideoAssets.length > 0) {
      await removeStoredAssets(removedVideoAssets);
    }

    return res.json({
      success: true,
      message: "Property updated successfully.",
      data: updatedProperty
    });
  } catch (error) {
    await removeStoredImages(storedImages);
    return next(error);
  }
};

export const deleteProperty = async (req, res, next) => {
  try {
    const property = await findProperty(req.params.id);

    if (!property) {
      throw new AppError(404, "Property not found.");
    }

    if (req.user.role !== "admin") {
      throw new AppError(403, "Only admins can delete properties.");
    }

    await removeStoredAssets([
      ...property.images.map((image) => ({ ...image, type: "image" })),
      ...(property.media?.length
        ? property.media
            .filter((item) => item.type === "video")
            .map((item) => ({
              url: item.url,
              filename: item.filename,
              type: "video"
            }))
        : (property.videos || []).map((url) => ({ url, type: "video" })))
    ]);
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

    const property = await findProperty(req.params.id);
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
    const property = await findProperty(req.params.id);
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
