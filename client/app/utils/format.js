export const PROPERTY_CATEGORIES = [
  "Plot",
  "House",
  "Apartment",
  "Commercial",
  "Villa",
  "Studio",
  "Farm House"
];

export const PROPERTY_LISTING_TYPES = [
  { label: "Buy Property", value: "sale" },
  { label: "Rent Property", value: "rent" }
];

export const PROPERTY_CATEGORY_IMAGES = {
  Plot:
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
  House:
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
  Apartment:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  Commercial:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  Villa:
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  Studio:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  "Farm House":
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
};

export const PROPERTY_FALLBACK_IMAGE = PROPERTY_CATEGORY_IMAGES.Plot;

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));

export const formatNumber = (value) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0
  }).format(Number(value || 0));

export const formatDate = (value) => {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

export const formatLocation = (location = {}, compact = false) => {
  const parts = compact
    ? [location.address, location.city]
    : [location.address, location.landmark, location.city, location.state, location.pincode];

  return parts.filter(Boolean).join(", ");
};

export const getMapQuery = (location = {}) =>
  [location.address, location.landmark, location.city, location.state, location.pincode]
    .filter(Boolean)
    .join(", ");

export const getCoordinates = (location = {}) => ({
  lat: location.coordinates?.lat ?? null,
  lng: location.coordinates?.lng ?? null
});

const normalizePhoneDigits = (phone) => String(phone || "").replace(/\D/g, "");

export const toPhoneHref = (phone) => {
  const digits = normalizePhoneDigits(phone);

  if (!digits) {
    return "tel:+917692016188";
  }

  return digits.length === 10 ? `tel:+91${digits}` : `tel:+${digits}`;
};

export const toWhatsAppHref = (phone, message = "") => {
  const digits = normalizePhoneDigits(phone);
  const whatsappNumber = digits.length === 10 ? `91${digits}` : digits || "917692016188";
  const baseUrl = `https://wa.me/${whatsappNumber}`;

  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
};

export const isFeaturedProperty = (property) => {
  if (!property?.isFeatured) {
    return false;
  }

  if (!property?.featuredUntil) {
    return true;
  }

  return new Date(property.featuredUntil).getTime() >= Date.now();
};
