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
    description: { type: String, required: true, trim: true },
    propertyType: { type: String, trim: true, default: "Apartment" },
    price: { type: Number, required: true, min: 0 },
    location: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    bedrooms: { type: Number, default: 0, min: 0 },
    bathrooms: { type: Number, default: 0, min: 0 },
    area: { type: Number, required: true, min: 0 },
    amenities: { type: [String], default: [] },
    images: { type: [imageSchema], default: [] },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    rejectedReason: { type: String, trim: true, default: "" },
    views: { type: Number, default: 0 },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    approvedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

propertySchema.index({ status: 1, city: 1, propertyType: 1, createdAt: -1 });
propertySchema.index({ agent: 1, createdAt: -1 });
propertySchema.index({ title: "text", description: "text", city: "text", location: "text", propertyType: "text" });

const Property = mongoose.model("Property", propertySchema);

export default Property;
