import mongoose from "mongoose";

const toSlug = (value = "property") =>
  String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "property";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    filename: { type: String, required: true }
  },
  { _id: false }
);

const locationSchema = new mongoose.Schema(
  {
    city: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    landmark: { type: String, trim: true, default: "" },
    pincode: { type: String, trim: true, default: "" },
    coordinates: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null }
    }
  },
  { _id: false }
);

const propertySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    listingType: {
      type: String,
      enum: ["sale", "rent"],
      default: "sale"
    },
    category: {
      type: String,
      enum: ["Apartment", "Villa", "House", "Plot", "Commercial", "Studio", "Farm House"],
      default: "Plot"
    },
    price: { type: Number, required: true, min: 0 },
    bedrooms: { type: Number, min: 0, default: 0 },
    bathrooms: { type: Number, min: 0, default: 0 },
    area: { type: Number, min: 0, default: 0 },
    amenities: { type: [String], default: [] },
    location: locationSchema,
    images: { type: [imageSchema], default: [] },
    contactName: { type: String, trim: true, default: "" },
    contactEmail: { type: String, trim: true, lowercase: true, default: "" },
    contactPhone: { type: String, trim: true, default: "" },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    rejectionReason: { type: String, trim: true, default: "" },
    isFeatured: { type: Boolean, default: false },
    featuredUntil: { type: Date, default: null },
    views: { type: Number, default: 0, min: 0 }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      }
    }
  }
);

propertySchema.virtual("isFeaturedActive").get(function isFeaturedActive() {
  if (!this.isFeatured) {
    return false;
  }

  if (!this.featuredUntil) {
    return true;
  }

  return this.featuredUntil >= new Date();
});

propertySchema.pre("validate", function ensureSlug(next) {
  if (!this.slug && this.title && this._id) {
    this.slug = `${toSlug(this.title)}-${String(this._id).slice(-6).toLowerCase()}`;
  }

  next();
});

propertySchema.index({
  approvalStatus: 1,
  listingType: 1,
  category: 1,
  "location.city": 1,
  price: 1,
  createdAt: -1
});
propertySchema.index({ postedBy: 1, createdAt: -1 });
propertySchema.index({
  title: "text",
  description: "text",
  category: "text",
  "location.city": "text",
  "location.state": "text",
  "location.address": "text",
  "location.landmark": "text"
});

const Property = mongoose.model("Property", propertySchema);

export default Property;
