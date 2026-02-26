export const formatPrice = (price, listingType = "Sale") => {
  const formatted = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(price || 0);
  return listingType === "Rent" ? `INR ${formatted}/month` : `INR ${formatted}`;
};
