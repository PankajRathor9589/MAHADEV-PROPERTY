import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Property } from "../models/Property.js";
import { User } from "../models/User.js";

dotenv.config();
await connectDB();

const dealerInfo = {
  name: "Prashant Rathore",
  photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300",
  agencyName: "Mahadev Property",
  phone: "917692016188",
  whatsapp: "917692016188",
  officeAddress: "Jaisinagar Tehsil, District Sagar, Madhya Pradesh, India",
  experienceYears: 12,
  rating: 4.9,
  isVerified: true
};

const listing = ({
  title,
  price,
  propertyType,
  areaValue,
  areaUnit,
  landStatus,
  bedrooms = 0,
  bathrooms = 0,
  tehsil,
  village,
  locality,
  pincode,
  address,
  lat,
  lng,
  highlights,
  nearbyPlaces,
  images,
  isFeatured = false,
  isTrending = false,
  recentlySold = false,
  availabilityStatus = "Available",
  views = 120
}) => ({
  title,
  price,
  listingType: "Sale",
  propertyType,
  areaValue,
  areaUnit,
  landStatus,
  bedrooms,
  bathrooms,
  availabilityStatus,
  description:
    "Verified local property managed by Mahadev Property with complete location support, transparent pricing, and on-site visit assistance.",
  highlights,
  nearbyPlaces,
  images,
  youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
  location: {
    district: "Sagar",
    tehsil,
    village,
    city: "Sagar",
    locality,
    pincode,
    address,
    coordinates: { lat, lng }
  },
  dealer: dealerInfo,
  isFeatured,
  isTrending,
  recentlySold,
  views
});

const properties = [
  listing({
    title: "Residential Plot in Sagar City Near Makronia",
    price: 3200000,
    propertyType: "Plot",
    areaValue: 1800,
    areaUnit: "sqft",
    landStatus: "Open Land",
    tehsil: "Sagar",
    village: "Makronia",
    locality: "Sagar City",
    pincode: "470004",
    address: "Makronia Extension, Sagar City, Madhya Pradesh",
    lat: 23.8209,
    lng: 78.7394,
    highlights: ["Corner plot", "30 ft road", "Registry ready", "Electricity nearby"],
    nearbyPlaces: ["Makronia Market", "Schools", "Bus stand"],
    images: [
      "https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=1400",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400"
    ],
    isFeatured: true,
    isTrending: true,
    views: 420
  }),
  listing({
    title: "Ready House in Jaisinagar Main Road",
    price: 4800000,
    propertyType: "House",
    areaValue: 1500,
    areaUnit: "sqft",
    landStatus: "Ready to Move",
    bedrooms: 3,
    bathrooms: 2,
    tehsil: "Jaisinagar",
    village: "Jaisinagar",
    locality: "Jaisinagar Bazar",
    pincode: "470125",
    address: "Near Tehsil Office, Jaisinagar, Sagar",
    lat: 23.8351,
    lng: 78.7608,
    highlights: ["Water connection", "Parking space", "Family locality"],
    nearbyPlaces: ["Tehsil Office", "Temple", "Local market"],
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1400",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1400"
    ],
    isFeatured: true,
    isTrending: true,
    views: 390
  }),
  listing({
    title: "Farm Land in Rahatgarh Near Highway",
    price: 7600000,
    propertyType: "Farm Land",
    areaValue: 2.2,
    areaUnit: "acre",
    landStatus: "Open Land",
    tehsil: "Rahatgarh",
    village: "Dhakrai",
    locality: "Rahatgarh",
    pincode: "470119",
    address: "State Highway belt, Rahatgarh, Sagar",
    lat: 23.7884,
    lng: 78.4062,
    highlights: ["Borewell", "Road touch", "Fertile soil"],
    nearbyPlaces: ["Rahatgarh Fort", "Highway", "Warehouses"],
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400",
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1400"
    ],
    isTrending: true,
    views: 318
  }),
  listing({
    title: "Commercial Plot in Khurai Industrial Side",
    price: 9100000,
    propertyType: "Commercial",
    areaValue: 2800,
    areaUnit: "sqft",
    landStatus: "Open Land",
    tehsil: "Khurai",
    village: "Khurai",
    locality: "Khurai City",
    pincode: "470117",
    address: "Near Industrial Road, Khurai, Sagar",
    lat: 24.0433,
    lng: 78.3308,
    highlights: ["Main road frontage", "Retail potential", "Legal title clear"],
    nearbyPlaces: ["Railway station", "Industrial zone", "Banks"],
    images: [
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1400",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400"
    ],
    isFeatured: true,
    views: 355
  }),
  listing({
    title: "Affordable Plot in Bina Township",
    price: 2350000,
    propertyType: "Plot",
    areaValue: 1320,
    areaUnit: "sqft",
    landStatus: "Open Land",
    tehsil: "Bina",
    village: "Bina",
    locality: "Bina Railway Colony",
    pincode: "470113",
    address: "Near Bina junction township, Bina",
    lat: 24.1898,
    lng: 78.1944,
    highlights: ["Budget range", "Water line available", "Growing area"],
    nearbyPlaces: ["Bina Junction", "Schools", "Hospital"],
    images: [
      "https://images.unsplash.com/photo-1625571479765-77796f5f5020?w=1400",
      "https://images.unsplash.com/photo-1591382386627-349b692688ff?w=1400"
    ],
    isTrending: true,
    views: 287
  }),
  listing({
    title: "3BHK House in Deori Prime Locality",
    price: 4200000,
    propertyType: "House",
    areaValue: 1380,
    areaUnit: "sqft",
    landStatus: "Ready to Move",
    bedrooms: 3,
    bathrooms: 2,
    tehsil: "Deori",
    village: "Deori",
    locality: "Deori Nagar",
    pincode: "470226",
    address: "Ward 7, Deori, Sagar district",
    lat: 23.3892,
    lng: 79.0167,
    highlights: ["Renovated interior", "Nearby school", "Covered parking"],
    nearbyPlaces: ["Bus stand", "Market", "Hospital"],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1400"
    ],
    views: 260
  }),
  listing({
    title: "Farm Land in Banda Tehsil with Water Source",
    price: 6800000,
    propertyType: "Farm Land",
    areaValue: 1.8,
    areaUnit: "acre",
    landStatus: "Open Land",
    tehsil: "Banda",
    village: "Banda",
    locality: "Banda Rural",
    pincode: "470335",
    address: "Agricultural belt, Banda, Sagar",
    lat: 24.0329,
    lng: 78.9645,
    highlights: ["Tube well", "Black soil", "Road approach"],
    nearbyPlaces: ["Mandi", "Village market", "Temple"],
    images: [
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1400",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400"
    ],
    views: 244
  }),
  listing({
    title: "Commercial Space in Shahgarh Market",
    price: 5600000,
    propertyType: "Commercial",
    areaValue: 1100,
    areaUnit: "sqft",
    landStatus: "Ready to Move",
    tehsil: "Shahgarh",
    village: "Shahgarh",
    locality: "Main Chowk",
    pincode: "470339",
    address: "Main market road, Shahgarh, Sagar district",
    lat: 24.3138,
    lng: 79.1189,
    highlights: ["Ground floor", "Busy market", "Shutter frontage"],
    nearbyPlaces: ["Main chowk", "Bank", "Bus stop"],
    images: [
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=1400",
      "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1400"
    ],
    views: 231
  }),
  listing({
    title: "Open Plot in Malthone Expansion Area",
    price: 1980000,
    propertyType: "Plot",
    areaValue: 1200,
    areaUnit: "sqft",
    landStatus: "Open Land",
    tehsil: "Malthone",
    village: "Malthone",
    locality: "Malthone",
    pincode: "470441",
    address: "Near local panchayat road, Malthone",
    lat: 24.2449,
    lng: 78.8621,
    highlights: ["Affordable", "Road side", "Title verified"],
    nearbyPlaces: ["Village center", "Shops", "School"],
    images: [
      "https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=1400",
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400"
    ],
    views: 205
  }),
  listing({
    title: "Family House in Rehli with Wide Frontage",
    price: 3950000,
    propertyType: "House",
    areaValue: 1460,
    areaUnit: "sqft",
    landStatus: "Ready to Move",
    bedrooms: 3,
    bathrooms: 2,
    tehsil: "Rehli",
    village: "Rehli",
    locality: "Rehli Nagar",
    pincode: "470227",
    address: "Near block office, Rehli, Sagar",
    lat: 23.6368,
    lng: 79.0734,
    highlights: ["Ready registry", "Wide road", "Public transport nearby"],
    nearbyPlaces: ["Block office", "Hospital", "School"],
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1400",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1400"
    ],
    views: 242
  }),
  listing({
    title: "Fertile Farm Land in Garhakota Region",
    price: 7350000,
    propertyType: "Farm Land",
    areaValue: 2.5,
    areaUnit: "acre",
    landStatus: "Open Land",
    tehsil: "Garhakota",
    village: "Garhakota",
    locality: "Garhakota Outskirts",
    pincode: "470229",
    address: "Near Sonar river side, Garhakota, Sagar",
    lat: 23.7814,
    lng: 79.1431,
    highlights: ["Canal water access", "Boundary demarcated", "Good approach road"],
    nearbyPlaces: ["River belt", "Village mandi", "Highway connector"],
    images: [
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1400",
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1400"
    ],
    isTrending: true,
    views: 301
  }),
  listing({
    title: "Recently Sold Plot in Kesli Main Area",
    price: 1750000,
    propertyType: "Plot",
    areaValue: 1050,
    areaUnit: "sqft",
    landStatus: "Open Land",
    tehsil: "Kesli",
    village: "Kesli",
    locality: "Kesli",
    pincode: "470235",
    address: "Near market square, Kesli, Sagar",
    lat: 23.4098,
    lng: 78.8195,
    highlights: ["Good investment zone", "Town access", "Clear records"],
    nearbyPlaces: ["Bus stop", "Weekly market", "School"],
    images: [
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1400",
      "https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?w=1400"
    ],
    availabilityStatus: "Sold",
    recentlySold: true,
    views: 188
  })
];

const run = async () => {
  await Promise.all([Property.deleteMany({}), User.deleteMany({})]);

  await User.create({
    name: "Admin User",
    email: "admin@mahadevproperty.com",
    password: "Admin@123",
    role: "admin",
    phone: "917692016188"
  });

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
