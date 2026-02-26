import mongoose from "mongoose";
import slugify from "slugify";
import { AVAILABILITY_STATUS, PROPERTY_TYPES } from "../utils/constants.js";

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    price: { type: Number, required: true },
    listingType: { type: String, enum: ["Sale", "Rent"], default: "Sale" },
    propertyType: { type: String, enum: PROPERTY_TYPES, required: true },
    areaSqft: { type: Number, required: true },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    availabilityStatus: { type: String, enum: AVAILABILITY_STATUS, default: "Available" },
    description: { type: String, required: true },
    highlights: [{ type: String }],
    nearbyPlaces: [{ type: String }],
    images: [{ type: String }],
    videoTourUrl: { type: String },
    floorPlanImage: { type: String },
    location: {
      city: { type: String, required: true, trim: true },
      locality: { type: String, required: true, trim: true },
      pincode: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
      }
    },
    dealer: {
      name: { type: String, required: true },
      photo: { type: String },
      agencyName: { type: String, default: "Mahadev Property" },
      phone: { type: String, required: true },
      whatsapp: { type: String, required: true },
      officeAddress: { type: String, required: true },
      experienceYears: { type: Number, default: 1 },
      rating: { type: Number, min: 1, max: 5, default: 4.5 },
      isVerified: { type: Boolean, default: true }
    },
    views: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false }
  },
  { timestamps: true }
);

propertySchema.pre("validate", function preValidate(next) {
  if (!this.slug && this.title) {
    this.slug = `${slugify(this.title, { lower: true, strict: true })}-${Date.now()}`;
  }
  next();
});

export const Property = mongoose.model("Property", propertySchema);
