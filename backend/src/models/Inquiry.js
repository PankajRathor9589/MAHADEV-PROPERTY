import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    message: { type: String, trim: true },
    leadType: { type: String, enum: ["inquiry", "callback", "site-visit"], default: "inquiry" },
    preferredDate: { type: Date },
    status: { type: String, enum: ["new", "in-progress", "closed"], default: "new" }
  },
  { timestamps: true }
);

export const Inquiry = mongoose.model("Inquiry", inquirySchema);
