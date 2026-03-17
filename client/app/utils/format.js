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

export const formatLocation = (location = {}) =>
  [location.address, location.city, location.state].filter(Boolean).join(", ");

export const isFeaturedProperty = (property) => {
  if (!property?.isFeatured) {
    return false;
  }

  if (!property?.featuredUntil) {
    return true;
  }

  return new Date(property.featuredUntil).getTime() >= Date.now();
};
