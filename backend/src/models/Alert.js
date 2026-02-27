import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    preferredLocation: { type: String, trim: true },
    propertyType: { type: String, trim: true },
    minPrice: { type: Number },
    maxPrice: { type: Number },
    status: { type: String, enum: ["active", "paused", "closed"], default: "active" }
  },
  { timestamps: true }
);

export const Alert = mongoose.model("Alert", alertSchema);
