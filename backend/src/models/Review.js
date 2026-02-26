import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true },
    helpfulCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

reviewSchema.index({ property: 1, user: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);
