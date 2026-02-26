import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    helpfulCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);
