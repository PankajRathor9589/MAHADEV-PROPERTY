import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    reason: { type: String, enum: ['fake listing', 'sold', 'wrong info', 'scam'] },
    details: String
  },
  { timestamps: true }
);

export default mongoose.model('Report', reportSchema);
