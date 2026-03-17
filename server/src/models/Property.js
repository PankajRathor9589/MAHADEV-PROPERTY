import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    filename: { type: String, required: true }
  },
  { _id: false }
);

const locationSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
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
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    listingType: {
      type: String,
      enum: ["sale", "rent"],
      required: true
    },
    category: {
      type: String,
      enum: ["Apartment", "Villa", "House", "Plot", "Commercial", "Studio", "Farm House"],
      default: "Apartment"
    },
    price: { type: Number, required: true, min: 0 },
    bedrooms: { type: Number, min: 0, default: 0 },
    bathrooms: { type: Number, min: 0, default: 0 },
    area: { type: Number, required: true, min: 0 },
    amenities: { type: [String], default: [] },
    location: locationSchema,
    images: { type: [imageSchema], default: [] },
    contactName: { type: String, required: true, trim: true },
    contactEmail: { type: String, trim: true, lowercase: true, default: "" },
    contactPhone: { type: String, required: true, trim: true },
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
