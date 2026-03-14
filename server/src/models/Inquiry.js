import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: "" },
    message: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new"
    }
  },
  { timestamps: true }
);

inquirySchema.index({ agent: 1, status: 1, createdAt: -1 });
inquirySchema.index({ buyer: 1, createdAt: -1 });
inquirySchema.index({ property: 1, createdAt: -1 });

const Inquiry = mongoose.model("Inquiry", inquirySchema);

export default Inquiry;
