import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['inquiry', 'callback', 'site-visit'] },
    name: String,
    phone: String,
    message: String,
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    visitDate: Date,
    status: { type: String, default: 'New' }
  },
  { timestamps: true }
);

export default mongoose.model('Lead', leadSchema);
