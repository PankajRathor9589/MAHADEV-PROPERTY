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
  const phone = property.contactPhone || COMPANY_INFO.phoneLink;

  return (
    <article className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold-300/30 hover:shadow-panel">
      <Link to={`/properties/${property._id}`} className="block">
        <div className="relative h-56 overflow-hidden bg-slate-900 sm:h-64">
          <img
            src={imageUrl}
            alt={property.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="badge bg-slate-950/70 text-white backdrop-blur">
              {property.listingType === "rent" ? "Rent" : "Sale"}
            </span>
            <span className="badge bg-white/10 text-white backdrop-blur">{property.category}</span>
            {isFeaturedProperty(property) && (
              <span className="badge bg-gold-300/20 text-gold-100 backdrop-blur">
                <Sparkles size={12} />
                Featured
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-white">{property.title}</h3>
              <p className="mt-2 inline-flex items-center gap-2 text-sm text-white/65">
                <MapPin size={15} />
                {locationText}
              </p>
            </div>
            <p className="text-lg font-bold text-gold-200">{formatCurrency(property.price)}</p>
          </div>
          <p className="text-sm text-white/55">{property.shortDescription || property.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-2 rounded-[24px] border border-white/10 bg-slate-950/40 p-3 text-sm text-white/70 sm:grid-cols-3">
          <span className="inline-flex items-center gap-2">
            <Ruler size={15} />
            {formatNumber(property.area)} sq.ft
          </span>
          <span className="inline-flex items-center gap-2">
            <BedDouble size={15} />
            {property.bedrooms || 0}
          </span>
          <span className="inline-flex items-center gap-2">
            <Bath size={15} />
            {property.bathrooms || 0}
          </span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
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
