export const PROPERTY_CATEGORIES = [
  "Apartment",
  "Villa",
  "House",
  "Plot",
  "Commercial",
  "Studio",
  "Farm House"
];

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80";

export const PROPERTY_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1400&q=80";

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

export const formatCompactNumber = (value) =>
  new Intl.NumberFormat("en-IN", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1
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

  if (digits.length === 10) {
    return `tel:+91${digits}`;
  }

  return `tel:+${digits}`;
};

export const toWhatsAppHref = (phone, message = "") => {
  const digits = normalizePhoneDigits(phone);
  const whatsappNumber = digits.length === 10 ? `91${digits}` : digits || "917692016188";
  const base = `https://wa.me/${whatsappNumber}`;

  if (!message) {
    return base;
  }

  return `${base}?text=${encodeURIComponent(message)}`;
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
