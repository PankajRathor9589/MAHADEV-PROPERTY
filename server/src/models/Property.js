import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    filename: { type: String, required: true }
  },
  { _id: false }
);

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    propertyType: {
      type: String,
      required: true,
      enum: ["Plot", "House", "Flat", "Commercial", "Agricultural Land"]
    },
    price: { type: Number, required: true, min: 0 },
    areaSqFt: { type: Number, required: true, min: 0 },
    location: {
      state: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      locality: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      pincode: { type: String, required: true, trim: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      mapPinUrl: { type: String, trim: true, default: "" },
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point"
        },
        coordinates: {
          type: [Number],
          default: [0, 0]
        }
      }
    },
    features: {
      bedrooms: { type: Number, default: 0, min: 0 },
      bathrooms: { type: Number, default: 0, min: 0 },
      parking: { type: Boolean, default: false },
      waterSupply: { type: Boolean, default: false },
      electricity: { type: Boolean, default: false },
      roadAccess: { type: Boolean, default: false }
    },
    images: { type: [imageSchema], default: [] },
    description: { type: String, required: true, trim: true },
    nearbyPlaces: { type: [String], default: [] },
    contactPhone: { type: String, trim: true, default: "" },
    isSold: { type: Boolean, default: false },
    listingStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    rejectedReason: { type: String, trim: true, default: "" },
    views: { type: Number, default: 0 },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    approvedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

propertySchema.index({ listingStatus: 1, isSold: 1, createdAt: -1 });
propertySchema.index({ propertyType: 1, price: 1, areaSqFt: 1 });
propertySchema.index({ seller: 1, createdAt: -1 });
propertySchema.index({ "location.coordinates": "2dsphere" });

propertySchema.pre("save", function setCoordinates(next) {
  if (
    this.location &&
    Number.isFinite(this.location.latitude) &&
    Number.isFinite(this.location.longitude)
  ) {
    this.location.coordinates = {
      type: "Point",
      coordinates: [this.location.longitude, this.location.latitude]
    };
  }

  next();
});

const Property = mongoose.model("Property", propertySchema);

export default Property;
