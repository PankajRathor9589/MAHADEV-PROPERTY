import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    buyerName: { type: String, required: true, trim: true },
    buyerPhone: { type: String, required: true, trim: true },
    buyerEmail: { type: String, trim: true, lowercase: true, default: "" },
    message: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new"
    }
  },
  { timestamps: true }
);

inquirySchema.index({ seller: 1, status: 1, createdAt: -1 });
inquirySchema.index({ property: 1, createdAt: -1 });

const Inquiry = mongoose.model("Inquiry", inquirySchema);

export default Inquiry;
