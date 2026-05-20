import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
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
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { COMPANY_INFO } from "../data/siteContent.js";
import {
  formatCurrency,
  formatLocation,
  getPropertyCoverImage,
  hasPropertyVideo,
  isFeaturedProperty,
  normalizePropertyImageEntries,
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
  const galleryImages = useMemo(() => {
    const images = normalizePropertyImageEntries(property).map((image) => image.url);
    return images.length ? images : [getPropertyCoverImage(property) || PROPERTY_CATEGORY_IMAGES[property.category] || PROPERTY_FALLBACK_IMAGE];
  }, [property]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const imageUrl = galleryImages[activeImageIndex] || galleryImages[0];
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
  const hasGallerySlider = galleryImages.length > 1;

  useEffect(() => {
    setActiveImageIndex(0);
  }, [property?._id, property?.slug]);

  const moveImage = (event, direction) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveImageIndex((current) => (current + direction + galleryImages.length) % galleryImages.length);
  };

  return (
    <motion.article
      whileHover={{ y: -10 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-full min-h-[720px] flex-col overflow-hidden rounded-[34px] border border-white/10 bg-[#0B1220] shadow-[0_28px_80px_rgba(3,7,17,0.28)] transition duration-500 hover:border-gold-300/60 hover:shadow-[0_38px_110px_rgba(3,7,17,0.38)]"
    >
      <Link to={destination} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#07111e]">
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
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,20,0.02)_0%,rgba(10,18,28,0.16)_36%,rgba(3,7,17,0.86)_100%)]" />
          <div className="absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100 bg-[linear-gradient(120deg,rgba(212,175,55,0.16),transparent_42%,rgba(255,255,255,0.08))]" />

          {hasGallerySlider ? (
            <>
              <button
                type="button"
                aria-label="Previous property image"
                onClick={(event) => moveImage(event, -1)}
                className="absolute left-4 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-[#07111e]/62 text-white backdrop-blur-xl transition hover:bg-[#07111e]/82"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Next property image"
                onClick={(event) => moveImage(event, 1)}
                className="absolute right-4 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-[#07111e]/62 text-white backdrop-blur-xl transition hover:bg-[#07111e]/82"
              >
                <ChevronRight size={18} />
              </button>
              <div className="absolute bottom-[9.25rem] left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                {galleryImages.slice(0, 6).map((item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className={`h-1.5 rounded-full transition-all ${
                      index === activeImageIndex ? "w-6 bg-gold-300" : "w-1.5 bg-white/58"
                    }`}
                  />
                ))}
              </div>
            </>
          ) : null}

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

          <div className="absolute inset-x-4 bottom-4 rounded-[28px] border border-white/16 bg-[#07111e]/36 p-5 text-white shadow-[0_22px_60px_rgba(0,0,0,0.24)] backdrop-blur-[22px]">
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
              <div className="shrink-0 rounded-[22px] border border-gold-300/30 bg-[#D4AF37] px-3.5 py-3 text-right text-[#050816]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#3a2a07]">Quoted Price</p>
                <p className="mt-1 text-base font-semibold text-[#050816]">{formatCurrency(property.price)}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <a
        href={toWhatsAppHref(
          property.contactPhone || COMPANY_INFO.whatsappNumber,
          `Hi SAGAR INFRA, I want details about ${property.title} in ${locationText}.`
        )}
        target="_blank"
        rel="noreferrer"
        className="absolute right-5 top-[20.5rem] z-20 hidden h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_18px_40px_rgba(37,211,102,0.34)] transition hover:-translate-y-1 sm:flex xl:top-[22rem]"
        aria-label={`WhatsApp Sagar Infra about ${property.title}`}
      >
        <MessageCircleMore size={19} />
      </a>

      <div className="flex flex-1 flex-col gap-5 bg-[#0B1220] p-5 sm:p-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-[22px] border border-white/10 bg-white/[0.04] px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#F6D776]">Layout</p>
            <p className="mt-2 text-sm font-semibold text-white">{formatBedrooms(property)}</p>
          </div>
          <div className="rounded-[22px] border border-white/10 bg-white/[0.04] px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#F6D776]">Area</p>
            <p className="mt-2 text-sm font-semibold text-white">{formatAreaLabel(property)}</p>
          </div>
          <div className="rounded-[22px] border border-white/10 bg-white/[0.04] px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#F6D776]">Mode</p>
            <p className="mt-2 text-sm font-semibold text-white">{property.listingType === "rent" ? "Rent" : "Buy"}</p>
          </div>
        </div>

        <p className="line-clamp-2 text-sm leading-7 text-slate-400">
          {property.description || "Premium listing presented by SAGAR INFRA with investor-grade detail and a faster decision flow."}
        </p>

        <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#050816] px-3 py-1.5 text-[11px] text-slate-200">
              <PersonaIcon size={13} className="text-gold-600" />
              {persona.label}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#050816] px-3 py-1.5 text-[11px] text-slate-200">
              <Layers3 size={13} className="text-gold-600" />
              {persona.helper}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#050816] px-3 py-1.5 text-[11px] text-slate-200">
              <Sparkles size={13} className="text-gold-600" />
              {isFeatured ? "Featured Visibility" : "Number protected until request"}
            </span>
          </div>
        </div>

        <div className={`mt-auto grid gap-2.5 ${actionGridClass}`}>
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
