import { BadgeCheck, MapPin, MessageCircleMore } from "lucide-react";
import { Link } from "react-router-dom";
import { COMPANY_INFO } from "../data/siteContent.js";
import { resolveImageUrl } from "../services/api.js";
import {
  PROPERTY_FALLBACK_IMAGE,
  formatCurrency,
  formatLocation,
  formatNumber,
  toWhatsAppHref
} from "../utils/format.js";

const FeaturedPropertyPreviewCard = ({ property }) => {
  const imageUrl = resolveImageUrl(property.images?.[0]?.url) || PROPERTY_FALLBACK_IMAGE;
  const area = property.area || property.areaSqFt || 0;
  const propertyType = property.category || property.propertyType || property.type || "Property";
  const locationText = formatLocation(property.location, true) || "Sagar, Madhya Pradesh";
  const phoneNumber = property.contactPhone || COMPANY_INFO.whatsappNumber;
  const whatsappMessage = `Hi Sagar Infra, I'm interested in ${property.title} in ${locationText}. Please share details.`;
  const isVerified =
    property.approvalStatus === "approved" ||
    property.listingStatus === "approved" ||
    property.verificationStatus === "verified" ||
    property.isFeatured;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-brand-100/80 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-xl">
      <Link to={`/properties/${property._id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-brand-50">
          <img
            src={imageUrl}
            alt={property.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            loading="lazy"
            decoding="async"
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 45vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-ink-900/10 to-transparent" />
          <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2">
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-700 shadow-sm">
              {property.listingType === "rent" ? "Rent" : "Buy"}
            </span>
            {isVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white shadow-sm">
                <BadgeCheck size={12} />
                Verified
              </span>
            ) : null}
          </div>
          <div className="absolute bottom-3 left-3 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
            {propertyType}
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="line-clamp-1 text-sm font-semibold text-ink-800 sm:text-base">{property.title}</h3>
              <p className="inline-flex max-w-full items-center gap-1 text-[11px] text-ink-500 sm:text-xs">
                <MapPin size={13} className="shrink-0 text-brand-600" />
                <span className="line-clamp-1">{locationText}</span>
              </p>
            </div>
            <p className="shrink-0 text-sm font-semibold text-brand-700 sm:text-base">{formatCurrency(property.price)}</p>
          </div>

          <div className="flex items-center justify-between gap-2 rounded-[18px] bg-cream-100 px-3 py-2 text-[11px] text-ink-600 sm:text-xs">
            <span className="font-medium">{propertyType}</span>
            <span>{area ? `${formatNumber(area)} sq.ft` : "Sagar MP"}</span>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <a
            href={toWhatsAppHref(phoneNumber, whatsappMessage)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-xs font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <MessageCircleMore size={15} />
            WhatsApp
          </a>
          <Link to={`/properties/${property._id}`} className="text-center text-xs font-medium text-brand-700 transition hover:text-brand-800">
            View details
          </Link>
        </div>
      </div>
    </article>
  );
};

export default FeaturedPropertyPreviewCard;
