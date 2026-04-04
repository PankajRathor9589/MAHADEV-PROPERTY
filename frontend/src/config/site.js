import { DEMO_CATEGORIES, DEMO_CREDENTIALS, DEMO_MEDIA } from "../data/demoData";

export const BRAND = {
  name: "Mahadev Property",
  tagline: "Curated homes, investment plots, and premium commercial addresses across fast-moving Indian markets."
};

export const SITE_URL = import.meta.env.VITE_SITE_URL || "http://localhost:5173";
export const DEFAULT_MAP_QUERY = "Bhopal, Madhya Pradesh, India";

export const CONTACT = {
  phone: "+91 76920 16188",
  phoneRaw: "917692016188",
  whatsappRaw: "917692016188",
  email: "hello@mahadevproperty.com",
  address: "Jaisinagar Road, Sagar, Madhya Pradesh, India"
};

export const OWNER_PROFILE = {
  name: "Mahadev Property",
  phone: CONTACT.phone,
  phoneRaw: CONTACT.phoneRaw,
  whatsappRaw: CONTACT.whatsappRaw
};

export const GOOGLE_MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(DEFAULT_MAP_QUERY)}`;

export const PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "Plot",
  "House",
  "Commercial",
  "Farmhouse"
];

export const PROPERTY_TYPE_OPTIONS = ["All Types", ...PROPERTY_TYPES];

export const HERO_STATS = [
  { label: "Verified projects", value: "1,240+" },
  { label: "Buyer leads closed", value: "18.6K" },
  { label: "Cities and growth corridors", value: "24" }
];

export const PRICE_RANGES = [
  { label: "Any Budget", value: "" },
  { label: "Up to 25 Lakh", maxPrice: "2500000" },
  { label: "25 - 50 Lakh", minPrice: "2500000", maxPrice: "5000000" },
  { label: "50 Lakh - 1 Cr", minPrice: "5000000", maxPrice: "10000000" },
  { label: "1 Cr+", minPrice: "10000000" }
];

export const CITIES = [
  "Sagar",
  "Bhopal",
  "Indore",
  "Jabalpur",
  "Khurai",
  "Bina",
  "Rehli",
  "Rahatgarh"
];

export const DEFAULT_AMENITIES = [
  "Natural light",
  "Parking ready",
  "Water connection",
  "Secure access"
];

export const CATEGORY_CARDS = DEMO_CATEGORIES;
export const HERO_MEDIA = DEMO_MEDIA;
export const DEMO_LOGIN_HINTS = DEMO_CREDENTIALS.filter((account) => account.role !== "Admin");

export const TRUST_BADGES = [
  "Agent-assisted buying",
  "Map-first discovery",
  "Verified property moderation",
  "Fast WhatsApp contact"
];
