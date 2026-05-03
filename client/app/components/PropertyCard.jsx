import {
  ArrowRight,
  Clapperboard,
  MapPin,
  MessageCircleMore,
  Phone,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { COMPANY_INFO } from "../data/siteContent.js";
import {
  formatCurrency,
  formatLocation,
  getPropertyCoverImage,
  hasPropertyVideo,
  isFeaturedProperty,
  PROPERTY_CATEGORY_IMAGES,
  PROPERTY_FALLBACK_IMAGE,
  resolvePropertyPath,
  toPhoneHref,
  toWhatsAppHref
} from "../utils/format.js";
import ResponsiveImage from "./ResponsiveImage.jsx";

const PropertyCard = ({ property }) => {
  const imageUrl = getPropertyCoverImage(property) || PROPERTY_CATEGORY_IMAGES[property.category] || PROPERTY_FALLBACK_IMAGE;
  const locationText = formatLocation(property.location, true) || COMPANY_INFO.location;
  const isVerified = property.approvalStatus === "approved" || property.isShowcase;
  const isShowcase = Boolean(property.isShowcase);
  const isFeatured = isFeaturedProperty(property);
  const destination = property.linkPath || resolvePropertyPath(property);
  const hasVideo = hasPropertyVideo(property);
  const detailLabel = isShowcase ? "View Showcase" : "View";

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[32px] border border-[#eadfcf] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)] transition duration-500 hover:border-gold-300 hover:shadow-[0_30px_75px_rgba(15,23,42,0.14)]"
    >
      <Link to={destination} className="block">
        <div className="relative aspect-[4/3.35] overflow-hidden bg-[#f4efe7]">
          <ResponsiveImage
            src={imageUrl}
            alt={property.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            loading="lazy"
            decoding="async"
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 46vw, 100vw"
            widths={[480, 720, 960, 1280]}
            transformOptions={{ height: 900, crop: "fill" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(21,31,45,0.08)_40%,rgba(21,31,45,0.58)_100%)]" />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="badge border-white/60 bg-white/90 text-ink-800">
              {isShowcase ? <Sparkles size={13} className="text-gold-600" /> : <ShieldCheck size={13} className="text-gold-600" />}
              {isVerified ? "Verified" : "Fresh"}
            </span>
            <span className="badge border-gold-300/60 bg-[#f7ecd7] text-gold-700">
              {property.category || "Property"}
            </span>
            <span className="badge border-white/60 bg-white/90 text-ink-700">{isFeatured ? "Featured" : "New"}</span>
            {hasVideo ? (
              <span className="badge border-white/60 bg-white/90 text-ink-700">
                <Clapperboard size={13} className="text-gold-600" />
                Video
              </span>
            ) : null}
          </div>

          <div className="absolute inset-x-4 bottom-4 rounded-[28px] border border-white/50 bg-white/88 p-5 text-ink-800 shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="line-clamp-2 text-[1.65rem] font-semibold leading-tight text-ink-900 sm:text-3xl">
                  {property.title}
                </h3>
                <p className="mt-3 inline-flex max-w-full items-center gap-2 text-sm text-ink-600">
                  <MapPin size={15} className="shrink-0 text-gold-600" />
                  <span className="line-clamp-1">{locationText}</span>
                </p>
              </div>
              <div className="shrink-0 rounded-[22px] border border-gold-300/50 bg-[#f8efdc] px-3 py-2 text-right">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-700">Price</p>
                <p className="mt-1 text-base font-semibold text-ink-900">{formatCurrency(property.price)}</p>
              </div>
            </div>

            <p className="mt-3 line-clamp-2 text-sm leading-7 text-ink-500">
              {property.description || "Premium listing presented by SAGAR INFRA."}
            </p>
          </div>
        </div>
      </Link>

      <div className="grid gap-3 border-t border-[#f0e8dc] p-4 sm:grid-cols-3">
        <a href={toPhoneHref(property.contactPhone || COMPANY_INFO.phoneDisplay)} className="btn-secondary min-h-[46px] w-full px-4">
          <Phone size={15} />
          Call
        </a>

        <a
          href={toWhatsAppHref(
            property.contactPhone || COMPANY_INFO.whatsappNumber,
            `Hi SAGAR INFRA, I want details about ${property.title} in ${locationText}.`
          )}
          target="_blank"
          rel="noreferrer"
          className="btn-whatsapp min-h-[46px] w-full px-4"
        >
          <MessageCircleMore size={15} />
          WhatsApp
        </a>

        <Link to={destination} className="btn-primary min-h-[46px] w-full px-4">
          {detailLabel}
          <ArrowRight size={16} />
        </Link>
      </div>
    </motion.article>
  );
};

export default PropertyCard;
