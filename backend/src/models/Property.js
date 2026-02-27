import mongoose from "mongoose";
import slugify from "slugify";
import {
  AREA_UNITS,
  AVAILABILITY_STATUS,
  LAND_STATUS,
  PROPERTY_TYPES
} from "../utils/constants.js";

const mediaSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["image", "video", "youtube"], required: true },
    url: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    price: { type: Number, required: true },
    listingType: { type: String, enum: ["Sale", "Rent"], default: "Sale" },
    propertyType: { type: String, enum: PROPERTY_TYPES, required: true },
    areaSqft: { type: Number },
    areaValue: { type: Number, required: true },
    areaUnit: { type: String, enum: AREA_UNITS, default: "sqft" },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    availabilityStatus: { type: String, enum: AVAILABILITY_STATUS, default: "Available" },
    landStatus: { type: String, enum: LAND_STATUS, default: "Ready to Move" },
    description: { type: String, required: true },
    highlights: [{ type: String }],
    nearbyPlaces: [{ type: String }],
    images: [{ type: String }],
    videos: [{ type: String }],
    videoTourUrl: { type: String },
    youtubeUrl: { type: String },
    media: [mediaSchema],
    floorPlanImage: { type: String },
    location: {
      district: { type: String, required: true, trim: true },
      tehsil: { type: String, required: true, trim: true },
      village: { type: String, trim: true, default: "" },
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
    isTrending: { type: Boolean, default: false },
    recentlySold: { type: Boolean, default: false }
  },
  { timestamps: true }
);

propertySchema.pre("validate", function preValidate(next) {
  if (!this.slug && this.title) {
    this.slug = `${slugify(this.title, { lower: true, strict: true })}-${Date.now()}`;
  }

  if (!this.areaValue && this.areaSqft) {
    this.areaValue = this.areaSqft;
    this.areaUnit = "sqft";
  }

  if (!this.areaSqft && this.areaValue) {
    this.areaSqft = this.areaUnit === "acre"
      ? Math.round(this.areaValue * 43560)
      : this.areaValue;
  }

  const mergedImages = Array.isArray(this.images) ? this.images : [];
  const mergedVideos = Array.isArray(this.videos) ? this.videos : [];
  const mergedMedia = Array.isArray(this.media) ? [...this.media] : [];

  mergedImages.forEach((url) => {
    if (!mergedMedia.some((entry) => entry.type === "image" && entry.url === url)) {
      mergedMedia.push({ type: "image", url });
    }
  });

  mergedVideos.forEach((url) => {
    if (!mergedMedia.some((entry) => entry.type === "video" && entry.url === url)) {
      mergedMedia.push({ type: "video", url });
    }
  });

  if (this.youtubeUrl && !mergedMedia.some((entry) => entry.type === "youtube" && entry.url === this.youtubeUrl)) {
    mergedMedia.push({ type: "youtube", url: this.youtubeUrl });
  }

  this.media = mergedMedia;

  next();
});

export const Property = mongoose.model("Property", propertySchema);
