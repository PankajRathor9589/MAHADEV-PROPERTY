export const formatPrice = (price, listingType = "Sale") => {
  const formatted = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(price || 0);
  return listingType === "Rent" ? `INR ${formatted}/month` : `INR ${formatted}`;
};

export const formatArea = (value, unit = "sqft") => {
  if (!value) return "-";
  const precision = unit === "acre" ? 2 : 0;
  const formatted = new Intl.NumberFormat("en-IN", { maximumFractionDigits: precision }).format(value);
  return `${formatted} ${unit === "acre" ? "acres" : "sq.ft"}`;
};

export const youtubeEmbedUrl = (url = "") => {
  if (!url) return "";
  if (url.includes("/embed/")) return url;

  const shortId = url.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  if (shortId?.[1]) return `https://www.youtube.com/embed/${shortId[1]}`;

  const queryId = url.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
  if (queryId?.[1]) return `https://www.youtube.com/embed/${queryId[1]}`;

  return "";
};
