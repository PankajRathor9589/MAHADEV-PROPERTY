import { ArrowRight, MapPin, MessageCircleMore, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { COMPANY_INFO } from "../data/siteContent.js";
import { resolveImageUrl } from "../services/api.js";
import {
  PROPERTY_CATEGORY_IMAGES,
  PROPERTY_FALLBACK_IMAGE,
  formatCurrency,
  formatLocation,
  toWhatsAppHref
} from "../utils/format.js";

const PropertyCard = ({ property }) => {
  const imageUrl =
    resolveImageUrl(property.images?.[0]?.url || property.image) ||
    PROPERTY_CATEGORY_IMAGES[property.category] ||
    PROPERTY_FALLBACK_IMAGE;
  const locationText = formatLocation(property.location, true) || COMPANY_INFO.location;
  const isVerified = property.approvalStatus === "approved" || property.isShowcase;
  const isShowcase = Boolean(property.isShowcase);
  const destination = property.linkPath || (property._id ? `/properties/${property._id}` : "/#contact");
  const detailLabel = isShowcase ? "Explore Listing" : "View Details";
  const badgeLabel = isShowcase ? "Signature" : isVerified ? "Verified" : "New";

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-white/12 bg-white/[0.06] shadow-glass backdrop-blur-xl"
    >
      <Link to={destination} className="block">
        <div className="relative aspect-[4/4.6] overflow-hidden bg-navy-900">
          <img
            src={imageUrl}
            alt={property.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            loading="lazy"
            decoding="async"
            sizes="(min-width: 1024px) 24vw, (min-width: 640px) 32vw, 48vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050d1c] via-[#050d1c]/20 to-transparent" />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="badge border-white/12 bg-white/[0.12] text-white">
              {isShowcase ? <Sparkles size={13} /> : <ShieldCheck size={13} />}
              {badgeLabel}
            </span>
            <span className="badge border-gold-300/40 bg-gold-400/14 text-gold-100">
              {property.listingType === "rent" ? "Rent" : property.category}
            </span>
          </div>

          <div className="absolute inset-x-4 bottom-4 rounded-[26px] border border-white/12 bg-navy-950/62 p-4 text-white shadow-[0_18px_40px_rgba(5,13,28,0.32)] backdrop-blur-xl">
            <div className="flex items-start justify-between gap-3">
              <h3 className="line-clamp-2 text-2xl font-semibold leading-tight">{property.title}</h3>
              <p className="shrink-0 text-base font-semibold text-gold-300">{formatCurrency(property.price)}</p>
            </div>

            <p className="mt-3 inline-flex max-w-full items-center gap-2 text-sm text-white/72">
              <MapPin size={15} className="shrink-0 text-gold-300" />
              <span className="line-clamp-1">{locationText}</span>
            </p>

            <p className="mt-3 line-clamp-2 text-sm leading-7 text-white/68">
              {property.description || "Premium listing presented by SAGAR INFRA."}
            </p>
          </div>
        </div>
      </Link>

      <div className="grid gap-3 p-4 sm:grid-cols-[1fr_auto]">
        <Link to={destination} className="btn-ghost w-full">
          {detailLabel}
          <ArrowRight size={16} />
        </Link>

        <div className="grid gap-3 sm:w-auto sm:grid-cols-1">
          <a
            href={toWhatsAppHref(
              property.contactPhone || COMPANY_INFO.whatsappNumber,
              `Hi SAGAR INFRA, I want details about ${property.title} in ${locationText}.`
            )}
            target="_blank"
            rel="noreferrer"
            className="btn-primary w-full sm:min-w-[160px]"
          >
            <MessageCircleMore size={16} />
            Enquire
          </a>
        </div>
      </div>
    </motion.article>
  );
};

export default PropertyCard;
