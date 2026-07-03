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

const normalizeMediaUrl = (value = "") => String(value || "").trim();

const slugifyMediaKey = (value = "") =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const uniqueByComposite = (items = []) => {
  const seen = new Set();

  return items.filter((item) => {
    const key = `${item.type || "image"}::${item.url}`;

    if (!item.url || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

export const youtubeEmbedUrl = (url = "") => {
  const normalizedUrl = normalizeMediaUrl(url);

  if (!normalizedUrl) {
    return "";
  }

  if (normalizedUrl.includes("/embed/")) {
    return normalizedUrl;
  }

  const shortId = normalizedUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  if (shortId?.[1]) {
    return `https://www.youtube.com/embed/${shortId[1]}`;
  }

  const queryId = normalizedUrl.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
  if (queryId?.[1]) {
    return `https://www.youtube.com/embed/${queryId[1]}`;
  }

  const shortsId = normalizedUrl.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/);
  if (shortsId?.[1]) {
    return `https://www.youtube.com/embed/${shortsId[1]}`;
  }

  return "";
};

export const isYoutubeUrl = (url = "") => Boolean(youtubeEmbedUrl(url));

export const normalizePropertyImageEntries = (property = {}) => {
  const directImages = Array.isArray(property.images) ? property.images : [];
  const mediaImages = Array.isArray(property.media)
    ? property.media.filter((entry) => entry?.type === "image")
    : [];
  const singleImage = property.image ? [{ url: property.image, filename: "property-image" }] : [];

  const normalized = [...directImages, ...mediaImages, ...singleImage]
    .map((entry, index) => {
      if (typeof entry === "string") {
        return {
          url: entry,
          filename: `${slugifyMediaKey(property.title || "property")}-image-${index + 1}`
        };
      }

      return {
        url: normalizeMediaUrl(entry?.url || entry?.path || ""),
        filename:
          entry?.filename ||
          `${slugifyMediaKey(property.title || "property")}-image-${index + 1}`
      };
    })
    .filter((entry) => entry.url);

  return uniqueByComposite(normalized.map((entry) => ({ ...entry, type: "image" }))).map(({ type, ...entry }) => entry);
};

export const normalizePropertyVideoEntries = (property = {}) => {
  const directVideos = Array.isArray(property.videos) ? property.videos : [];
  const mediaVideos = Array.isArray(property.media)
    ? property.media.filter((entry) => entry?.type === "video" || entry?.type === "youtube")
    : [];
  const looseVideoFields = [property.videoTourUrl, property.videoUrl]
    .filter(Boolean)
    .map((url) => ({ type: "video", url }));
  const youtubeFields = [property.youtubeUrl, property.youtubeLink]
    .filter(Boolean)
    .map((url) => ({ type: "youtube", url }));

  const normalized = [...mediaVideos, ...directVideos, ...looseVideoFields, ...youtubeFields]
    .map((entry, index) => {
      if (typeof entry === "string") {
        return {
          type: isYoutubeUrl(entry) ? "youtube" : "video",
          url: normalizeMediaUrl(entry),
          label: `Media ${index + 1}`
        };
      }

      const url = normalizeMediaUrl(entry?.url || entry?.path || "");
      const type = entry?.type || (isYoutubeUrl(url) ? "youtube" : "video");

      return {
        type,
        url,
        filename: entry?.filename || "",
        label: entry?.label || (type === "youtube" ? "YouTube Tour" : `Video ${index + 1}`)
      };
    })
    .filter((entry) => entry.url)
    .map((entry) => ({
      ...entry,
      embedUrl: entry.type === "youtube" ? youtubeEmbedUrl(entry.url) : ""
    }));

  return uniqueByComposite(normalized);
};

export const hasPropertyVideo = (property = {}) => normalizePropertyVideoEntries(property).length > 0;

export const getPropertyCoverImage = (property = {}) => {
  const [firstImage] = normalizePropertyImageEntries(property);
  return firstImage?.url || PROPERTY_CATEGORY_IMAGES[property.category] || PROPERTY_FALLBACK_IMAGE;
};

export const resolvePropertyPath = (property) => {
  const identifier = property?.slug || property?._id;
  return identifier ? `/properties/${identifier}` : "/properties";
};

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

export const getTrustScore = (property = {}) => {
  const verification = property.verification || {};
  const baseScore = property.approvalStatus === "approved" ? 54 : 42;
  const score =
    baseScore +
    (verification.ownerVerified ? 14 : 0) +
    (verification.documentsVerified ? 14 : 0) +
    (verification.locationVerified ? 10 : 0) +
    (verification.marketVerified ? 8 : 0);

  return Math.min(100, score);
};

export const getInvestmentScore = (property = {}) => {
  const priceSignal = property.price ? 18 : 8;
  const areaSignal = property.area ? Math.min(16, Math.max(8, Math.round(property.area / 180))) : 8;
  const demandSignal = Math.min(24, Math.round((property.views || 0) / 3));
  const assetSignal = ["Plot", "Commercial", "Villa"].includes(property.category) ? 18 : 12;
  const verifiedSignal = getTrustScore(property) >= 80 ? 14 : 8;
  const featuredSignal = isFeaturedProperty(property) ? 10 : 5;

  return Math.min(100, priceSignal + areaSignal + demandSignal + assetSignal + verifiedSignal + featuredSignal);
};

export const getListingQualityScore = (property = {}) => {
  const checks = [
    property.title,
    property.description && property.description.length >= 80,
    property.price > 0,
    property.area > 0,
    formatLocation(property.location).length > 0,
    normalizePropertyImageEntries(property).length >= 3,
    property.amenities?.length >= 3,
    hasPropertyVideo(property)
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
};
