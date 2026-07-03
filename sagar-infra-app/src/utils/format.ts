import { Property, PropertyLocation } from '@/types/api';

export const COMPANY_PHONE = '7692016188';
export const COMPANY_WHATSAPP = '917692016188';
export const COMPANY_EMAIL = 'info@sagar-infra.in';
export const COMPANY_ADDRESS = 'Sagar, Madhya Pradesh';

export const formatCurrency = (value?: number) => {
  const amount = Number(value || 0);

  if (!amount) {
    return 'Price on request';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatLocation = (location?: PropertyLocation) =>
  [location?.address, location?.landmark, location?.city, location?.state]
    .filter(Boolean)
    .join(', ') || COMPANY_ADDRESS;

export const getPropertyId = (property: Property) => property.slug || property._id || property.id || '';

export const getCoverImage = (property?: Property) => {
  const mediaImage = property?.media?.find((item) => item.type === 'image')?.url;
  return property?.images?.[0]?.url || mediaImage || '';
};

export const normalizePhone = (phone?: string) => String(phone || COMPANY_PHONE).replace(/\D/g, '');

export const buildWhatsAppUrl = (phone: string | undefined, message: string) => {
  const digits = normalizePhone(phone);
  const withCountry = digits.length === 10 ? `91${digits}` : digits || COMPANY_WHATSAPP;
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(message)}`;
};

export const buildMapUrl = (property: Property) => {
  const lat = property.location?.coordinates?.lat;
  const lng = property.location?.coordinates?.lng;

  if (lat && lng) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formatLocation(property.location))}`;
};
