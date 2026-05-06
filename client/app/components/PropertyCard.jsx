import {
  ArrowRight,
  Clapperboard,
  Crown,
  Layers3,
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

const getMatchScore = (property) => {
  const priceSignal = property.price ? Math.max(0, 10 - Math.min(8, Math.floor(property.price / 25000000))) : 5;
  const featureSignal = isFeaturedProperty(property) ? 9 : 4;
  const sizeSignal = property.area ? Math.min(7, Math.max(2, Math.floor(property.area / 450))) : 3;
  const trustSignal = property.approvalStatus === "approved" ? 8 : 3;
  const activitySignal = property.views ? Math.min(6, Math.floor(property.views / 15)) : 4;

  return Math.min(98, 68 + priceSignal + featureSignal + sizeSignal + trustSignal + activitySignal);
};

const formatBedrooms = (property) => {
  if (property.bedrooms > 0) {
    return `${property.bedrooms} BHK`;
  }

  return property.category || "Property";
};

const formatAreaLabel = (property) => (property.area ? `${property.area} sq.ft` : "Area on request");

const getListingPersona = (property) => {
  const role = String(property.postedBy?.role || property.listedByType || "").toLowerCase();

  if (["broker", "agency", "builder", "admin"].includes(role) || isFeaturedProperty(property)) {
    return {
      label: "Verified Expert",
      icon: Crown,
      helper: "Broker / builder SaaS listing"
    };
  }

  if (["owner", "seller", "user"].includes(role) || property.approvalStatus === "approved") {
    return {
      label: "No Brokerage",
      icon: ShieldCheck,
      helper: "Direct owner-first presentation"
    };
  }

  return {
    label: "Smart Match",
    icon: Sparkles,
    helper: "AI-prioritized opportunity"
  };
};

const PropertyCard = ({ property, onCompare, compareActive = false }) => {
  const imageUrl = getPropertyCoverImage(property) || PROPERTY_CATEGORY_IMAGES[property.category] || PROPERTY_FALLBACK_IMAGE;
  const locationText = formatLocation(property.location, true) || COMPANY_INFO.location;
  const isVerified = property.approvalStatus === "approved" || property.isShowcase;
  const isShowcase = Boolean(property.isShowcase);
  const isFeatured = isFeaturedProperty(property);
  const destination = property.linkPath || resolvePropertyPath(property);
  const hasVideo = hasPropertyVideo(property);
  const detailLabel = isShowcase ? "Showcase" : "Details";
  const matchScore = getMatchScore(property);
  const actionGridClass = onCompare ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 md:grid-cols-3";
  const persona = getListingPersona(property);
  const PersonaIcon = persona.icon;

  return (
    <motion.article
      whileHover={{ y: -10 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[36px] border border-[#e7dccb] bg-white/[0.96] shadow-[0_28px_70px_rgba(8,16,28,0.1)] transition duration-500 hover:border-gold-300 hover:shadow-[0_34px_94px_rgba(8,16,28,0.16)]"
    >
      <Link to={destination} className="block">
        <div className="relative aspect-[4/4.25] overflow-hidden bg-[#f4efe7]">
          <ResponsiveImage
            src={imageUrl}
            alt={property.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            loading="lazy"
            decoding="async"
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 46vw, 100vw"
            widths={[480, 720, 960, 1280]}
            transformOptions={{ height: 1200, crop: "fill" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,20,0.06)_0%,rgba(10,18,28,0.15)_32%,rgba(9,15,24,0.72)_100%)]" />

          <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="badge border-white/16 bg-[#08111d]/54 text-white backdrop-blur-xl">
                {isShowcase ? <Sparkles size={13} className="text-gold-300" /> : <ShieldCheck size={13} className="text-gold-300" />}
                {isVerified ? "Verified" : "Fresh"}
              </span>
              <span className="badge border-white/16 bg-white/10 text-white backdrop-blur-xl">
                {property.category || "Property"}
              </span>
              {hasVideo ? (
                <span className="badge border-white/16 bg-white/10 text-white backdrop-blur-xl">
                  <Clapperboard size={13} className="text-gold-300" />
                  Live Tour
                </span>
              ) : null}
            </div>

            <div className="rounded-[24px] border border-white/14 bg-[#07111e]/62 px-4 py-3 text-white shadow-[0_18px_44px_rgba(4,10,18,0.3)] backdrop-blur-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/65">AI Match</p>
              <p className="mt-1 text-2xl font-semibold leading-none text-white">{matchScore}%</p>
            </div>
          </div>

          <div className="absolute inset-x-4 bottom-4 rounded-[30px] border border-white/16 bg-white/12 p-5 text-white shadow-[0_22px_50px_rgba(0,0,0,0.16)] backdrop-blur-[20px]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="line-clamp-2 text-[clamp(1.65rem,2vw,2.3rem)] font-semibold leading-[0.95] text-white">
                  {property.title}
                </h3>
                <p className="mt-3 inline-flex max-w-full items-center gap-2 text-sm text-white/78">
                  <MapPin size={15} className="shrink-0 text-gold-300" />
                  <span className="line-clamp-1">{locationText}</span>
                </p>
              </div>
              <div className="shrink-0 rounded-[22px] border border-white/14 bg-[#f8efdc] px-3.5 py-3 text-right text-ink-900">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-700">Quoted Price</p>
                <p className="mt-1 text-base font-semibold">{formatCurrency(property.price)}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-5 p-5">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-[22px] border border-[#ece2d3] bg-[#fbf8f2] px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-700">Layout</p>
            <p className="mt-2 text-sm font-semibold text-ink-900">{formatBedrooms(property)}</p>
          </div>
          <div className="rounded-[22px] border border-[#ece2d3] bg-[#fbf8f2] px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-700">Area</p>
            <p className="mt-2 text-sm font-semibold text-ink-900">{formatAreaLabel(property)}</p>
          </div>
          <div className="rounded-[22px] border border-[#ece2d3] bg-[#fbf8f2] px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-700">Mode</p>
            <p className="mt-2 text-sm font-semibold text-ink-900">{property.listingType === "rent" ? "Rent" : "Buy"}</p>
          </div>
        </div>

        <p className="line-clamp-2 text-sm leading-7 text-ink-500">
          {property.description || "Premium listing presented by SAGAR INFRA with investor-grade detail and a faster decision flow."}
        </p>

        <div className="rounded-[26px] border border-[#ece1d0] bg-[#fbf8f2] p-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[11px] text-ink-700">
              <PersonaIcon size={13} className="text-gold-600" />
              {persona.label}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[11px] text-ink-700">
              <Layers3 size={13} className="text-gold-600" />
              {persona.helper}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[11px] text-ink-700">
              <Sparkles size={13} className="text-gold-600" />
              {isFeatured ? "Featured Visibility" : "Number protected until request"}
            </span>
          </div>
        </div>

        <div className={`grid gap-2.5 ${actionGridClass}`}>
          <a href={toPhoneHref(property.contactPhone || COMPANY_INFO.phoneDisplay)} className="btn-secondary min-h-[48px] w-full px-3.5">
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
            className="btn-whatsapp min-h-[48px] w-full px-3.5"
          >
            <MessageCircleMore size={15} />
            WhatsApp
          </a>

          {onCompare ? (
            <button
              type="button"
              onClick={() => onCompare(property)}
              className={`btn-ghost min-h-[48px] w-full px-3.5 ${compareActive ? "border-gold-300 bg-[#f7ecd7] text-ink-900" : ""}`}
            >
              <Layers3 size={15} />
              {compareActive ? "Comparing" : "Compare"}
            </button>
          ) : null}

          <Link to={destination} className="btn-primary min-h-[48px] w-full px-3.5">
            {detailLabel}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default PropertyCard;
