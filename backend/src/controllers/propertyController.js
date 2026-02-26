import { Property } from "../models/Property.js";
import { calcPagination } from "../utils/pagination.js";

const buildFilters = (query) => {
  const filters = {};

  if (query.city) filters["location.city"] = new RegExp(query.city, "i");
  if (query.locality) filters["location.locality"] = new RegExp(query.locality, "i");
  if (query.propertyType) filters.propertyType = query.propertyType;
  if (query.availabilityStatus) filters.availabilityStatus = query.availabilityStatus;
  if (query.bhk) filters.bedrooms = Number(query.bhk);

  if (query.minPrice || query.maxPrice) {
    filters.price = {};
    if (query.minPrice) filters.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filters.price.$lte = Number(query.maxPrice);
  }

  if (query.minArea || query.maxArea) {
    filters.areaSqft = {};
    if (query.minArea) filters.areaSqft.$gte = Number(query.minArea);
    if (query.maxArea) filters.areaSqft.$lte = Number(query.maxArea);
  }

  if (query.nearby) filters.nearbyPlaces = { $in: [new RegExp(query.nearby, "i")] };

  return filters;
};

export const listProperties = async (req, res) => {
  const { page, limit, skip } = calcPagination(req.query.page, req.query.limit);
  const filters = buildFilters(req.query);

  const [items, total] = await Promise.all([
    Property.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Property.countDocuments(filters)
  ]);

  return res.json({
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
};

export const getFeaturedProperties = async (req, res) => {
  const items = await Property.find({ isFeatured: true, availabilityStatus: "Available" }).limit(8);
  return res.json({ items });
};

export const getTrendingProperties = async (req, res) => {
  const items = await Property.find({ isTrending: true }).sort({ views: -1 }).limit(8);
  return res.json({ items });
};

export const getPropertyBySlug = async (req, res) => {
  const property = await Property.findOne({ slug: req.params.slug });
  if (!property) return res.status(404).json({ message: "Property not found" });

  property.views += 1;
  await property.save();

  return res.json({ item: property });
};

export const getPropertyById = async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) return res.status(404).json({ message: "Property not found" });
  return res.json({ item: property });
};

export const createProperty = async (req, res) => {
  const property = await Property.create(req.body);
  return res.status(201).json({ item: property });
};

export const updateProperty = async (req, res) => {
  const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!property) return res.status(404).json({ message: "Property not found" });
  return res.json({ item: property });
};

export const deleteProperty = async (req, res) => {
  const property = await Property.findByIdAndDelete(req.params.id);
  if (!property) return res.status(404).json({ message: "Property not found" });
  return res.json({ message: "Property deleted" });
};

export const similarProperties = async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) return res.status(404).json({ message: "Property not found" });

  const items = await Property.find({
    _id: { $ne: property._id },
    propertyType: property.propertyType,
    "location.city": property.location.city
  })
    .limit(4)
    .sort({ createdAt: -1 });

  return res.json({ items });
};
