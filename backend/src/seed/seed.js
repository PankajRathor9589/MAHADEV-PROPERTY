import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Property } from "../models/Property.js";
import { User } from "../models/User.js";

dotenv.config();
await connectDB();

const run = async () => {
  await Promise.all([Property.deleteMany({}), User.deleteMany({})]);

  const admin = await User.create({
    name: "Admin User",
    email: "admin@mahadevproperty.com",
    password: "Admin@123",
    role: "admin",
    phone: "9999999999"
  });

  const dealerInfo = {
    name: "Rahul Singh",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300",
    agencyName: "Mahadev Property",
    phone: "9876543210",
    whatsapp: "919876543210",
    officeAddress: "Main Road, Indore",
    experienceYears: 12,
    rating: 4.8,
    isVerified: true
  };

  const properties = [
    {
      title: "Premium 3BHK Flat in Vijay Nagar",
      price: 6500000,
      listingType: "Sale",
      propertyType: "Flat",
      areaSqft: 1600,
      bedrooms: 3,
      bathrooms: 2,
      availabilityStatus: "Available",
      description: "Spacious premium flat near metro connectivity and schools.",
      highlights: ["Parking", "24x7 Water", "Lift", "Power Backup"],
      nearbyPlaces: ["School", "Hospital", "Market", "Bus Stand"],
      images: [
        "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200"
      ],
      floorPlanImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      videoTourUrl: "https://www.youtube.com/watch?v=1L4A6z31drA",
      location: {
        city: "Indore",
        locality: "Vijay Nagar",
        pincode: "452010",
        address: "Scheme 54, Vijay Nagar, Indore",
        coordinates: { lat: 22.7533, lng: 75.8937 }
      },
      dealer: dealerInfo,
      isFeatured: true,
      isTrending: true,
      views: 240
    },
    {
      title: "Residential Plot near Bypass",
      price: 2800000,
      listingType: "Sale",
      propertyType: "Plot",
      areaSqft: 2400,
      bedrooms: 0,
      bathrooms: 0,
      availabilityStatus: "Available",
      description: "Corner plot with 40-feet road access ideal for home construction.",
      highlights: ["Boundary Wall", "Road Access", "Electricity", "Water Line"],
      nearbyPlaces: ["Market", "Temple", "Bus Stand"],
      images: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200",
        "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1200"
      ],
      floorPlanImage: "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=800",
      location: {
        city: "Ujjain",
        locality: "Dewas Road",
        pincode: "456010",
        address: "Near Outer Bypass, Ujjain",
        coordinates: { lat: 23.1793, lng: 75.7849 }
      },
      dealer: dealerInfo,
      isFeatured: true,
      isTrending: false,
      views: 132
    },
    {
      title: "2BHK Rental House in Freeganj",
      price: 18000,
      listingType: "Rent",
      propertyType: "House",
      areaSqft: 1100,
      bedrooms: 2,
      bathrooms: 2,
      availabilityStatus: "Rented",
      description: "Independent ground floor house with garden and parking.",
      highlights: ["Garden", "Parking", "Water", "Nearby School"],
      nearbyPlaces: ["School", "Hospital", "Railway Station"],
      images: [
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200",
        "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=1200"
      ],
      floorPlanImage: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800",
      location: {
        city: "Ujjain",
        locality: "Freeganj",
        pincode: "456010",
        address: "Near Freeganj Square, Ujjain",
        coordinates: { lat: 23.1824, lng: 75.7764 }
      },
      dealer: dealerInfo,
      isFeatured: false,
      isTrending: true,
      views: 189
    }
  ];

  await Property.insertMany(properties);

  console.log("Seed complete");
  console.log("Admin login: admin@mahadevproperty.com / Admin@123");
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
