const propertyImages = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80"
];

export const DEMO_MEDIA = {
  heroVideo: "https://cdn.coverr.co/videos/coverr-modern-apartment-building-5176/1080p.mp4",
  propertyImages,
  realEstateGif: "https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif"
};

export const DEMO_USERS = [
  {
    id: "demo-buyer-1",
    name: "Aarav Mehta",
    email: "buyer@mahadevproperty.com",
    phone: "+91 98111 22334",
    role: "buyer",
    password: "demo123",
    isActive: true,
    agencyName: ""
  },
  {
    id: "demo-agent-1",
    name: "Riya Sharma",
    email: "agent@mahadevproperty.com",
    phone: "+91 98220 45122",
    role: "agent",
    password: "demo123",
    isActive: true,
    agencyName: "PrimeSquare Realty",
    whatsapp: "919822045122"
  },
  {
    id: "demo-admin-1",
    name: "Karan Verma",
    email: "admin@mahadevproperty.com",
    phone: "+91 98989 10011",
    role: "admin",
    password: "demo123",
    isActive: true,
    agencyName: "Mahadev Property",
    whatsapp: "919898910011"
  },
  {
    id: "demo-agent-2",
    name: "Neha Kapoor",
    email: "neha.agent@mahadevproperty.com",
    phone: "+91 97777 66221",
    role: "agent",
    password: "demo123",
    isActive: true,
    agencyName: "UrbanNest Advisors",
    whatsapp: "919777766221"
  }
];

const imageSet = (...indexes) =>
  indexes.map((index, imageIndex) => ({
    url: propertyImages[index],
    filename: `demo-property-${index}-${imageIndex}.jpg`
  }));

export const DEMO_PROPERTIES = [
  {
    id: "demo-prop-1",
    title: "Skyline Crest Residences",
    description:
      "A modern 3 BHK residence with wide balconies, premium wood finishes, and an amenity floor designed for families who want space and city access.",
    price: 12500000,
    location: "Arera Colony, near 10 No. Market",
    city: "Bhopal",
    bedrooms: 3,
    bathrooms: 3,
    area: 1890,
    images: imageSet(0, 3, 1),
    agent: DEMO_USERS[1],
    status: "approved",
    propertyType: "Apartment",
    amenities: ["Clubhouse", "Visitor parking", "Power backup", "Jogging track"],
    views: 312,
    createdAt: "2026-03-14T09:15:00.000Z"
  },
  {
    id: "demo-prop-2",
    title: "Palm Court Villa",
    description:
      "A sunlit villa inside a gated enclave with landscaped greens, double-height living space, and a quiet residential lane perfect for long-term family living.",
    price: 24800000,
    location: "Vijay Nagar Extension",
    city: "Indore",
    bedrooms: 4,
    bathrooms: 4,
    area: 2840,
    images: imageSet(3, 0, 2),
    agent: DEMO_USERS[3],
    status: "approved",
    propertyType: "Villa",
    amenities: ["Private lawn", "Covered parking", "CCTV", "Servant room"],
    views: 451,
    createdAt: "2026-03-13T12:30:00.000Z"
  },
  {
    id: "demo-prop-3",
    title: "Lakeview Heights",
    description:
      "Premium high-rise apartment with an open kitchen, skyline deck, and fast access to schools, malls, and the city business district.",
    price: 9800000,
    location: "Scheme No. 54",
    city: "Indore",
    bedrooms: 3,
    bathrooms: 2,
    area: 1620,
    images: imageSet(1, 0, 3),
    agent: DEMO_USERS[1],
    status: "approved",
    propertyType: "Apartment",
    amenities: ["Swimming pool", "Gym", "Children play zone", "Security lobby"],
    views: 286,
    createdAt: "2026-03-12T07:00:00.000Z"
  },
  {
    id: "demo-prop-4",
    title: "Riverside Plot Enclave",
    description:
      "A ready-to-build residential plot with wide internal roads, water and electricity points, and strong appreciation potential for investors.",
    price: 4200000,
    location: "Jaisinagar Road",
    city: "Sagar",
    bedrooms: 0,
    bathrooms: 0,
    area: 2400,
    images: imageSet(2, 0, 1),
    agent: DEMO_USERS[1],
    status: "approved",
    propertyType: "Plot",
    amenities: ["Road access", "Water line", "Street lighting", "Secure boundary"],
    views: 198,
    createdAt: "2026-03-11T10:45:00.000Z"
  },
  {
    id: "demo-prop-5",
    title: "Zen Courtyard Homes",
    description:
      "Boutique row homes with a calm courtyard core, airy bedrooms, and a layout that balances privacy with shared family space.",
    price: 13800000,
    location: "Napier Town",
    city: "Jabalpur",
    bedrooms: 3,
    bathrooms: 3,
    area: 1780,
    images: imageSet(0, 1, 2),
    agent: DEMO_USERS[3],
    status: "approved",
    propertyType: "House",
    amenities: ["Modular kitchen", "Parking", "Terrace deck", "Rainwater harvesting"],
    views: 223,
    createdAt: "2026-03-10T08:20:00.000Z"
  },
  {
    id: "demo-prop-6",
    title: "Cedar Business Hub",
    description:
      "A modern commercial unit with frontage visibility, flexible floor plate, and strong footfall from nearby retail and office catchments.",
    price: 17600000,
    location: "MP Nagar Zone II",
    city: "Bhopal",
    bedrooms: 0,
    bathrooms: 2,
    area: 2100,
    images: imageSet(1, 3, 0),
    agent: DEMO_USERS[3],
    status: "approved",
    propertyType: "Commercial",
    amenities: ["Lift lobby", "Power backup", "Visitor parking", "High street frontage"],
    views: 167,
    createdAt: "2026-03-09T16:10:00.000Z"
  },
  {
    id: "demo-prop-7",
    title: "Maple Residency Phase II",
    description:
      "A newly added listing with fresh interiors, smart home points, and access to a clubhouse, waiting for final admin verification before publishing.",
    price: 11200000,
    location: "Kolar Road",
    city: "Bhopal",
    bedrooms: 3,
    bathrooms: 2,
    area: 1540,
    images: imageSet(3, 2, 0),
    agent: DEMO_USERS[1],
    status: "pending",
    propertyType: "Apartment",
    amenities: ["Smart door lock", "Clubhouse", "Garden deck", "EV charging"],
    views: 34,
    createdAt: "2026-03-14T13:25:00.000Z"
  },
  {
    id: "demo-prop-8",
    title: "Orchid Valley Villa",
    description:
      "A premium independent villa with a private lounge deck and landscaped setback area. The listing is under moderation for updated legal documents.",
    price: 29600000,
    location: "Super Corridor",
    city: "Indore",
    bedrooms: 4,
    bathrooms: 5,
    area: 3260,
    images: imageSet(0, 3, 1),
    agent: DEMO_USERS[3],
    status: "pending",
    propertyType: "Villa",
    amenities: ["Private deck", "Home office", "Covered garage", "Solar hot water"],
    views: 58,
    createdAt: "2026-03-15T06:35:00.000Z"
  },
  {
    id: "demo-prop-9",
    title: "Town Square Studio Suites",
    description:
      "Compact urban suites planned for rental demand. The listing was rejected because the image set and compliance details need to be refreshed.",
    price: 5900000,
    location: "Civil Lines",
    city: "Jabalpur",
    bedrooms: 1,
    bathrooms: 1,
    area: 720,
    images: imageSet(2, 1, 3),
    agent: DEMO_USERS[1],
    status: "rejected",
    propertyType: "Apartment",
    amenities: ["Concierge desk", "Security access", "Retail podium", "Fast elevator"],
    rejectedReason: "Please upload updated compliance images and revised possession timeline.",
    views: 29,
    createdAt: "2026-03-08T11:20:00.000Z"
  }
];

export const DEMO_INQUIRIES = [
  {
    id: "demo-inquiry-1",
    propertyId: "demo-prop-1",
    buyerId: "demo-buyer-1",
    name: "Aarav Mehta",
    email: "buyer@mahadevproperty.com",
    phone: "+91 98111 22334",
    message: "Can you share the maintenance charges and nearest school options?",
    status: "new",
    createdAt: "2026-03-14T14:40:00.000Z"
  },
  {
    id: "demo-inquiry-2",
    propertyId: "demo-prop-4",
    name: "Shreya Nair",
    email: "shreya.nair@example.com",
    phone: "+91 99887 66554",
    message: "Is the plot registry-ready and what is the road width?",
    status: "contacted",
    createdAt: "2026-03-13T10:05:00.000Z"
  },
  {
    id: "demo-inquiry-3",
    propertyId: "demo-prop-8",
    name: "Rahul Sen",
    email: "rahul.sen@example.com",
    phone: "+91 98765 44112",
    message: "Please confirm if this villa can be viewed this weekend.",
    status: "new",
    createdAt: "2026-03-15T08:10:00.000Z"
  }
];

export const DEMO_FAVORITES = {
  "demo-buyer-1": ["demo-prop-1", "demo-prop-2"]
};

export const DEMO_CATEGORIES = [
  {
    id: "buy",
    label: "Buy",
    description: "Verified homes and plots ready for site visits",
    accent: "from-sky-500 via-brand-500 to-brand-700",
    propertyType: "",
    city: "",
    count: "8,400+ listings"
  },
  {
    id: "rent",
    label: "Rent",
    description: "Fast-moving rental apartments and compact homes",
    accent: "from-amber-400 via-orange-500 to-rose-500",
    propertyType: "Apartment",
    city: "Bhopal",
    count: "2,900+ options"
  },
  {
    id: "sell",
    label: "Sell",
    description: "Post inventory and reach high-intent buyers faster",
    accent: "from-emerald-400 via-brand-500 to-teal-700",
    path: "/agent",
    count: "Trusted by agents"
  },
  {
    id: "commercial",
    label: "Commercial",
    description: "Office, retail, and investment-ready business space",
    accent: "from-slate-700 via-ink to-slate-900",
    propertyType: "Commercial",
    city: "",
    count: "Prime business zones"
  }
];

export const DEMO_CREDENTIALS = [
  { role: "Buyer", email: "buyer@mahadevproperty.com", password: "demo123" },
  { role: "Agent", email: "agent@mahadevproperty.com", password: "demo123" },
  { role: "Admin", email: "admin@mahadevproperty.com", password: "demo123" }
];
