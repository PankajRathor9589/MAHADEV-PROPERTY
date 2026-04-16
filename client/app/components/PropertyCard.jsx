import { ArrowRight, Bath, BedDouble, MapPin, Phone, Ruler, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { COMPANY_INFO } from "../data/siteContent.js";
import { resolveImageUrl } from "../services/api.js";
import {
  PROPERTY_FALLBACK_IMAGE,
  formatCurrency,
  formatLocation,
  formatNumber,
  isFeaturedProperty,
  toPhoneHref
} from "../utils/format.js";

const PropertyCard = ({ property }) => {
  const imageUrl = resolveImageUrl(property.images?.[0]?.url) || PROPERTY_FALLBACK_IMAGE;
  const locationText = formatLocation(property.location, true);
  const phone = property.contactPhone || COMPANY_INFO.phoneDisplay;
  const area = property.area || property.areaSqFt || 0;

  return (
    <article className="card card-hover flex h-full flex-col overflow-hidden p-0">
      <Link to={`/properties/${property._id}`} className="block">
        <div className="relative h-56 overflow-hidden bg-brand-50 sm:h-64">
          <img
            src={imageUrl}
            alt={property.title}
            className="h-full w-full object-cover transition duration-700 hover:scale-105"
            loading="lazy"
            decoding="async"
            sizes="(min-width: 1536px) 22rem, (min-width: 1280px) 24vw, (min-width: 768px) 45vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/55 via-ink-900/10 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="badge bg-white/90 text-ink-700 shadow-sm">{property.listingType === "rent" ? "Rent" : "Buy"}</span>
            <span className="badge bg-brand-500 text-white shadow-sm">{property.category}</span>
            {isFeaturedProperty(property) ? (
              <span className="badge bg-[#f5e4bf] text-brand-700 shadow-sm">
                <Sparkles size={12} />
                Featured
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-xl font-semibold text-ink-700">{property.title}</h3>
              <p className="mt-2 inline-flex max-w-full items-center gap-2 text-sm text-ink-500">
                <MapPin size={15} className="shrink-0 text-brand-600" />
                <span className="line-clamp-1">{locationText}</span>
              </p>
            </div>
            <p className="shrink-0 text-lg font-bold text-brand-600">{formatCurrency(property.price)}</p>
          </div>
          <p className="line-clamp-3 text-sm leading-7 text-ink-500">{property.shortDescription || property.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-2 rounded-2xl bg-cream-100 p-3 text-sm text-ink-600 sm:grid-cols-3">
          <span className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm">
            <Ruler size={15} className="text-brand-600" />
            {formatNumber(area)} sq.ft
          </span>
          <span className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm">
            <BedDouble size={15} className="text-brand-600" />
            {property.bedrooms || 0}
          </span>
          <span className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm">
            <Bath size={15} className="text-brand-600" />
            {property.bathrooms || 0}
          </span>
        </div>

        <div className="mt-auto flex flex-col gap-3 sm:flex-row">
          <a href={toPhoneHref(phone)} className="btn-primary flex-1">
            <Phone size={16} />
            Contact Now
          </a>
          <Link to={`/properties/${property._id}`} className="btn-secondary flex-1">
            Details
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;
