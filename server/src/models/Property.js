import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: String,
    price: Number,
    priceType: { type: String, enum: ['Sale', 'Rent'] },
    propertyType: { type: String, enum: ['Flat', 'Plot', 'House', 'Commercial', 'Agricultural Land'] },
    areaSqFt: Number,
    bedrooms: Number,
    bathrooms: Number,
    status: { type: String, enum: ['Available', 'Sold', 'Rented'], default: 'Available' },
    description: String,
    highlights: [String],
    nearbyPlaces: [String],
    images: [String],
    videoTourUrl: String,
    floorPlanImage: String,
    location: {
      city: String,
      area: String,
      pincode: String,
      fullAddress: String,
      coordinates: { lat: Number, lng: Number }
    },
    agent: {
      name: String,
      photo: String,
      agencyName: { type: String, default: 'Mahadev Property' },
      phone: String,
      whatsapp: String,
      officeAddress: String,
      experienceYears: Number,
      rating: Number,
      verified: { type: Boolean, default: true }
    },
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Property', propertySchema);
