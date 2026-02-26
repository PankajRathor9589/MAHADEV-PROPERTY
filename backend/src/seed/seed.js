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
    name: "Prashant Rathor",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300",
    agencyName: "Mahadev Property",
    phone: "917692016188",
    whatsapp: "917692016188",
    officeAddress: "Vijay Nagar, Indore, Madhya Pradesh",
    experienceYears: 11,
    rating: 4.9,
    isVerified: true
  };

  const properties = [
    {
      title: "Spacious 3BHK Independent House in Vijay Nagar",
      price: 12500000,
      listingType: "Sale",
      propertyType: "Independent House",
      areaSqft: 2100,
      bedrooms: 3,
      bathrooms: 3,
      availabilityStatus: "Available",
      description:
        "Well-maintained family home in Scheme 54 with fast access to schools, shopping zones, and business districts.",
      highlights: ["Corner plot", "Modular kitchen", "24x7 water supply", "Two-level layout", "Wide internal road"],
      nearbyPlaces: ["Meghdoot Garden", "C21 Mall", "Bombay Hospital", "Brilliant Convention Center"],
      images: [
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1400",
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1400",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1400"
      ],
      floorPlanImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      location: {
        city: "Indore",
        locality: "Vijay Nagar",
        pincode: "452010",
        address: "Scheme No. 54, Near Meghdoot Garden, Vijay Nagar, Indore",
        coordinates: { lat: 22.7533, lng: 75.8937 }
      },
      dealer: dealerInfo,
      isFeatured: true,
      isTrending: true,
      views: 342
    },
    {
      title: "Premium 5BHK Luxury Villa on Super Corridor",
      price: 28500000,
      listingType: "Sale",
      propertyType: "Luxury Villa",
      areaSqft: 4200,
      bedrooms: 5,
      bathrooms: 5,
      availabilityStatus: "Available",
      description:
        "Premium villa with refined interiors, private landscaped zone, and excellent airport plus IT corridor connectivity.",
      highlights: ["Private lawn", "Home automation ready", "Italian marble", "Clubhouse access", "Gated township"],
      nearbyPlaces: ["TCS Campus", "Airport Road", "Prestige University", "Malls and cafes"],
      images: [
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1400",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400",
        "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=1400",
        "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1400"
      ],
      location: {
        city: "Indore",
        locality: "Super Corridor",
        pincode: "452005",
        address: "Near Brilliant Convention Center, Super Corridor, Indore",
        coordinates: { lat: 22.8106, lng: 75.9025 }
      },
      dealer: dealerInfo,
      isFeatured: true,
      isTrending: true,
      views: 410
    },
    {
      title: "Modern 2BHK Apartment near C21 Mall",
      price: 5200000,
      listingType: "Sale",
      propertyType: "Apartment",
      areaSqft: 1120,
      bedrooms: 2,
      bathrooms: 2,
      availabilityStatus: "Available",
      description:
        "Ideal 2BHK for professionals and small families looking for comfortable living in a prime urban extension.",
      highlights: ["Open-view balcony", "Lift and power backup", "Children play zone", "Gym access"],
      nearbyPlaces: ["C21 Mall", "Apollo Hospital", "Vijay Nagar Square", "Restaurants and banks"],
      images: [
        "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1400",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1400",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1400"
      ],
      location: {
        city: "Indore",
        locality: "Vijay Nagar Extension",
        pincode: "452010",
        address: "Apollo DB City, Nipania, Vijay Nagar Extension, Indore",
        coordinates: { lat: 22.7699, lng: 75.9108 }
      },
      dealer: dealerInfo,
      isFeatured: false,
      isTrending: true,
      views: 298
    },
    {
      title: "Ready-to-Move 3BHK Apartment at Bengali Square",
      price: 7800000,
      listingType: "Sale",
      propertyType: "Apartment",
      areaSqft: 1560,
      bedrooms: 3,
      bathrooms: 3,
      availabilityStatus: "Available",
      description:
        "Spacious apartment with practical layout, ideal for families looking for daily convenience and strong connectivity.",
      highlights: ["Vaastu friendly", "Large living area", "24x7 security", "Rooftop amenities"],
      nearbyPlaces: ["Bengali Square Junction", "Kanadia Road Market", "Schools", "Hospitals"],
      images: [
        "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=1400",
        "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=1400",
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1400",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1400"
      ],
      location: {
        city: "Indore",
        locality: "Bengali Square",
        pincode: "452016",
        address: "Kanadia Road, Near Bengali Square Junction, Indore",
        coordinates: { lat: 22.7048, lng: 75.9134 }
      },
      dealer: dealerInfo,
      isFeatured: true,
      isTrending: true,
      views: 320
    },
    {
      title: "High-Footfall Commercial Shop on AB Bypass Road",
      price: 6900000,
      listingType: "Sale",
      propertyType: "Commercial Shop",
      areaSqft: 640,
      bedrooms: 0,
      bathrooms: 1,
      availabilityStatus: "Available",
      description:
        "Ground-floor commercial unit with strong visibility and steady residential catchment suitable for retail operations.",
      highlights: ["Main road frontage", "Signage visibility", "High footfall zone", "Ground floor access"],
      nearbyPlaces: ["AB Bypass", "Residential townships", "Fuel station", "Bus connectivity"],
      images: [
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400",
        "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1400",
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400",
        "https://images.unsplash.com/photo-1555529771-35a4e5d977f8?w=1400"
      ],
      location: {
        city: "Indore",
        locality: "AB Bypass Road",
        pincode: "452012",
        address: "Ground Floor Retail Arcade, AB Bypass Road, Indore",
        coordinates: { lat: 22.7365, lng: 75.8798 }
      },
      dealer: dealerInfo,
      isFeatured: false,
      isTrending: true,
      views: 268
    },
    {
      title: "Serene 4BHK Farmhouse near Rau",
      price: 18500000,
      listingType: "Sale",
      propertyType: "Farmhouse",
      areaSqft: 7800,
      bedrooms: 4,
      bathrooms: 4,
      availabilityStatus: "Available",
      description:
        "Peaceful farmhouse with open greens and private outdoor zones, suitable for weekend stays and family events.",
      highlights: ["Large private garden", "Borewell water", "Caretaker room", "Boundary wall"],
      nearbyPlaces: ["Rau Circle", "Khandwa Road", "Educational institutes", "Resorts"],
      images: [
        "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?w=1400",
        "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=1400",
        "https://images.unsplash.com/photo-1472224371017-08207f84aaae?w=1400",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1400"
      ],
      location: {
        city: "Indore",
        locality: "Rau",
        pincode: "453331",
        address: "Khandwa Road Stretch, Near Rau Circle, Indore",
        coordinates: { lat: 22.6239, lng: 75.8091 }
      },
      dealer: dealerInfo,
      isFeatured: false,
      isTrending: true,
      views: 226
    },
    {
      title: "Affordable 2BHK Budget Home in Rau",
      price: 3450000,
      listingType: "Sale",
      propertyType: "Budget Home",
      areaSqft: 890,
      bedrooms: 2,
      bathrooms: 2,
      availabilityStatus: "Available",
      description:
        "Value-for-money budget home for first-time buyers looking for reliable connectivity and low maintenance.",
      highlights: ["Gated campus", "Public transport nearby", "Low maintenance", "Family-friendly block"],
      nearbyPlaces: ["Rau-Pithampur Road", "Local schools", "Daily market", "ATM and clinics"],
      images: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1400",
        "https://images.unsplash.com/photo-1575517111478-7f6afd0973db?w=1400",
        "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=1400",
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1400"
      ],
      location: {
        city: "Indore",
        locality: "Rau",
        pincode: "453331",
        address: "Silver Spring Township, Rau-Pithampur Road, Indore",
        coordinates: { lat: 22.6408, lng: 75.8054 }
      },
      dealer: dealerInfo,
      isFeatured: true,
      isTrending: false,
      views: 214
    },
    {
      title: "Elegant 3BHK Independent House at MR-10 Bypass",
      price: 9800000,
      listingType: "Sale",
      propertyType: "Independent House",
      areaSqft: 1850,
      bedrooms: 3,
      bathrooms: 3,
      availabilityStatus: "Available",
      description:
        "Contemporary independent house in a preferred township with quick reach to major roads and business belts.",
      highlights: ["Renovated interiors", "Wooden wardrobes", "Wide frontage", "Good rental demand"],
      nearbyPlaces: ["MR-10 Corridor", "Bypass access", "Parks", "Schools and hospitals"],
      images: [
        "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1400",
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1400",
        "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1400",
        "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1400"
      ],
      location: {
        city: "Indore",
        locality: "Bypass Road",
        pincode: "452016",
        address: "Shalimar Township, Near MR-10 Bypass, Indore",
        coordinates: { lat: 22.7444, lng: 75.9221 }
      },
      dealer: dealerInfo,
      isFeatured: false,
      isTrending: false,
      views: 190
    },
    {
      title: "Premium 3BHK Apartment on Super Corridor",
      price: 8650000,
      listingType: "Sale",
      propertyType: "Apartment",
      areaSqft: 1685,
      bedrooms: 3,
      bathrooms: 3,
      availabilityStatus: "Available",
      description:
        "Move-in ready premium apartment for modern families seeking upgraded amenities near IT and airport corridor.",
      highlights: ["Smart lock", "Air-conditioned bedrooms", "Pool and clubhouse", "High-speed elevators"],
      nearbyPlaces: ["TCS Campus", "Airport", "Schools", "Retail stores"],
      images: [
        "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1400",
        "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=1400",
        "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1400",
        "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=1400"
      ],
      location: {
        city: "Indore",
        locality: "Super Corridor",
        pincode: "452005",
        address: "Near TCS Campus, Super Corridor, Indore",
        coordinates: { lat: 22.7984, lng: 75.8969 }
      },
      dealer: dealerInfo,
      isFeatured: true,
      isTrending: true,
      views: 357
    },
    {
      title: "Designer 4BHK Luxury Villa near Bengali Square",
      price: 23200000,
      listingType: "Sale",
      propertyType: "Luxury Villa",
      areaSqft: 3600,
      bedrooms: 4,
      bathrooms: 4,
      availabilityStatus: "Available",
      description:
        "Designer villa with premium finishes, private deck spaces, and easy access to top schools and lifestyle hotspots.",
      highlights: ["Double-height lobby", "Private terrace deck", "Servant room", "Premium gated enclave"],
      nearbyPlaces: ["Saket Club", "Bengali Square", "Hospitals", "Education hubs"],
      images: [
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1400",
        "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1400",
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1400",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1400"
      ],
      location: {
        city: "Indore",
        locality: "Bengali Square",
        pincode: "452016",
        address: "Saket Club Road Extension, Bengali Square, Indore",
        coordinates: { lat: 22.7006, lng: 75.9092 }
      },
      dealer: dealerInfo,
      isFeatured: true,
      isTrending: true,
      views: 388
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
