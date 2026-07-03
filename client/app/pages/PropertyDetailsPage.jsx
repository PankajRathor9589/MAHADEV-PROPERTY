import {
  BarChart3,
  Bot,
  Building2,
  CarFront,
  CircleDollarSign,
  Clapperboard,
  Clock3,
  Droplets,
  ExternalLink,
  Heart,
  Home,
  Hospital,
  Landmark,
  Layers3,
  LockKeyhole,
  MapPin,
  MessageCircleMore,
  Phone,
  Ruler,
  School,
  Share2,
  ShieldCheck,
  Sparkles,
  Trees,
  Users,
  Video,
  Volume2
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageGallerySlider from "../components/ImageGallerySlider.jsx";
import LeadCaptureForm from "../components/LeadCaptureForm.jsx";
import MediaPlayer from "../components/MediaPlayer.jsx";
import PropertyCard from "../components/PropertyCard.jsx";
import Seo from "../components/Seo.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { COMPANY_INFO } from "../data/siteContent.js";
import {
  API_BASE_URL,
  addFavorite,
  fetchPropertyById,
  fetchSimilarProperties,
  removeFavorite,
  resolveImageUrl
} from "../services/api.js";
import {
  formatCurrency,
  formatLocation,
  getCoordinates,
  getInvestmentScore,
  getMapQuery,
  getPropertyCoverImage,
  getTrustScore,
  hasPropertyVideo,
  isFeaturedProperty,
  normalizePropertyImageEntries,
  normalizePropertyVideoEntries,
  resolvePropertyPath,
  toPhoneHref,
  toWhatsAppHref
} from "../utils/format.js";

const getFallbackAmenities = (property) => {
  if (Array.isArray(property.amenities) && property.amenities.length > 0) {
    return property.amenities;
  }

  if (property.category === "Plot") {
    return ["Road access", "Clear plot positioning", "Site visit support", "Investment-friendly locality"];
  }

  if (property.category === "Commercial") {
    return ["Prime frontage", "Business-ready access", "Footfall potential", "Direct owner coordination"];
  }

  return ["Modern layout", "Location convenience", "Verified listing support", "Site visit assistance"];
};

const getConstructionStatus = (property) => {
  if (property.category === "Plot") {
    return "Ready / plotted opportunity";
  }

  if (property.bedrooms > 0 || property.bathrooms > 0) {
    return "Ready to visit";
  }

  return property.listingType === "rent" ? "Operational / active asset" : "Ready for buyer review";
};

const getLocationAdvantages = (property) => {
  const suggestions = [
    property.location?.landmark ? `Close to ${property.location.landmark}` : "",
    property.location?.address ? `Positioned near ${property.location.address}` : "",
    property.location?.city ? `Demand supported by ${property.location.city} connectivity` : "",
    "Owner direct coordination for site visits",
    "Clean presentation for buyer and investor evaluation"
  ];

  return [...new Set(suggestions.filter(Boolean))].slice(0, 5);
};

const getInvestmentHighlights = (property) => {
  const suggestions = [
    property.listingType === "rent"
      ? "Income-oriented opportunity with faster evaluation path"
      : "Suitable for capital appreciation and end-use decisions",
    isFeaturedProperty(property)
      ? "Featured visibility improves buyer confidence and listing quality perception"
      : "Presented with verified-first trust cues",
    property.views ? `${property.views} recent views indicate active interest` : "Built for direct calls, WhatsApp, and high-intent leads",
    property.category === "Commercial"
      ? "Commercial positioning supports business visibility and investor discussions"
      : property.category === "Plot"
        ? "Plot-focused buyers can evaluate growth potential and access quickly"
        : "Residential positioning supports both lifestyle and long-term value"
  ];

  return suggestions.filter(Boolean);
};

const getTrustSignals = (property) => {
  const persona = property.approvalStatus === "approved" ? "Verified seller" : "Review in progress";

  return [
    {
      label: "Trust Badge",
      value: persona,
      helper: "Keeps buyer confidence high before site visits.",
      icon: ShieldCheck
    },
    {
      label: "Document Desk",
      value: "Ready for legal review",
      helper: "Document verification and shareable paperwork workflow placeholder.",
      icon: Landmark
    },
    {
      label: "Anti-Spam Shield",
      value: "Protected callback flow",
      helper: "Seller number stays gated until the buyer shows serious intent.",
      icon: LockKeyhole
    },
    {
      label: "Blockchain-Ready",
      value: "Future registry module",
      helper: "Architected for future proof-of-documents and audit trails.",
      icon: Sparkles
    }
  ];
};

const getNeighborhoodInsights = (property) => {
  const isCommercial = property.category === "Commercial";
  const isPlot = property.category === "Plot";

  return [
    {
      label: "Safety score",
      score: isCommercial ? 84 : 89,
      helper: "Buyer-friendly locality confidence",
      icon: ShieldCheck
    },
    {
      label: "Noise level",
      score: isCommercial ? 68 : isPlot ? 72 : 81,
      helper: "Higher is calmer",
      icon: Volume2
    },
    {
      label: "Traffic flow",
      score: isCommercial ? 79 : 85,
      helper: "Road accessibility and movement",
      icon: CarFront
    },
    {
      label: "Water / power stability",
      score: 87,
      helper: "Utility consistency preview",
      icon: Droplets
    },
    {
      label: "School access",
      score: property.category === "Plot" ? 80 : 88,
      helper: "Education proximity indicator",
      icon: School
    },
    {
      label: "Hospital access",
      score: 86,
      helper: "Emergency convenience preview",
      icon: Hospital
    }
  ];
};

const getPriceHistory = (property) => {
  const quotedPrice = Number(property.price || 0);

  if (!quotedPrice) {
    return [];
  }

  return [
    { label: "Q2 2024", value: Math.round(quotedPrice * 0.79) },
    { label: "Q4 2024", value: Math.round(quotedPrice * 0.86) },
    { label: "Q2 2025", value: Math.round(quotedPrice * 0.91) },
    { label: "Q4 2025", value: Math.round(quotedPrice * 0.96) },
    { label: "Today", value: quotedPrice }
  ];
};

const getAiModules = (property) => [
  {
    title: "AI Match Score",
    helper: `${property.category || "Property"} calibrated against budget fit, commute practicality, and upside potential.`,
    icon: Bot
  },
  {
    title: "AI Interior Preview",
    helper: "Before/after renovation and furnishing journeys for buyer imagination and faster decisions.",
    icon: Sparkles
  },
  {
    title: "Live Video Walkthrough",
    helper: "Zoom or Meet-style guided visits for remote or time-sensitive buyers.",
    icon: Video
  },
  {
    title: "Family Shortlist Mode",
    helper: "Collaborative voting, notes, and decision-making placeholders for shared purchases.",
    icon: Users
  }
];

const maskPhoneNumber = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");

  if (digits.length < 6) {
    return phone || "Protected";
  }

  return `${digits.slice(0, 2)}${"•".repeat(Math.max(4, digits.length - 5))}${digits.slice(-3)}`;
};

const DetailCard = ({ label, value, icon: Icon }) => (
  <div className="rounded-[24px] border border-[#e9dfd2] bg-[#fbf8f2] p-4">
    <Icon size={18} className="text-gold-600" />
    <p className="mt-3 text-sm font-medium text-ink-500">{label}</p>
    <p className="mt-1 text-lg font-semibold text-ink-900">{value}</p>
  </div>
);

const SignalCard = ({ label, value, helper, icon: Icon }) => (
  <div className="rounded-[26px] border border-[#ece1d3] bg-[#fbf8f2] p-5">
    <Icon size={18} className="text-gold-600" />
    <p className="mt-4 text-sm font-semibold uppercase tracking-[0.22em] text-ink-500">{label}</p>
    <p className="mt-2 text-xl font-semibold text-ink-900">{value}</p>
    <p className="mt-2 text-sm leading-7 text-ink-500">{helper}</p>
  </div>
);

const MeterCard = ({ label, score, helper, icon: Icon }) => (
  <div className="rounded-[26px] border border-[#ece1d3] bg-[#fbf8f2] p-5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="inline-flex items-center gap-2 text-lg font-semibold text-ink-900">
          <Icon size={18} className="text-gold-600" />
          {label}
        </p>
        <p className="mt-2 text-sm leading-7 text-ink-500">{helper}</p>
      </div>
      <span className="rounded-full border border-gold-300/50 bg-white px-3 py-1.5 text-sm font-semibold text-ink-900">
        {score}/100
      </span>
    </div>
    <div className="mt-4 h-2.5 rounded-full bg-[#e6dbc9]">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#0b1d3a] via-[#3d5f9a] to-[#d4af37]"
        style={{ width: `${score}%` }}
      />
    </div>
  </div>
);

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, refreshUser, user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [similarProperties, setSimilarProperties] = useState([]);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [favoriteBusy, setFavoriteBusy] = useState(false);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        setLoadError("");
        const response = await fetchPropertyById(id);
        setProperty(response);
      } catch (loadError) {
        setLoadError(loadError.message || (API_BASE_URL ? "Property not found." : "Property API is not configured."));
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  useEffect(() => {
    setActiveVideoIndex(0);
  }, [property?._id, property?.slug]);

  useEffect(() => {
    const loadSimilarProperties = async () => {
      if (!property?._id && !property?.slug) {
        setSimilarProperties([]);
        return;
      }

      try {
        const items = await fetchSimilarProperties(property.slug || property._id, { limit: 3 });
        setSimilarProperties(items);
      } catch {
        setSimilarProperties([]);
      }
    };

    loadSimilarProperties();
  }, [property?._id, property?.slug]);

  const mapSrc = useMemo(() => {
    if (!property) {
      return "";
    }

    const { lat, lng } = getCoordinates(property.location);
    if (lat || lng) {
      return `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
    }

    const query = encodeURIComponent(getMapQuery(property.location));
    return query ? `https://www.google.com/maps?q=${query}&output=embed` : "";
  }, [property]);

  const openMapLink = useMemo(() => {
    if (!property) {
      return "https://maps.google.com";
    }

    const { lat, lng } = getCoordinates(property.location);
    if (lat || lng) {
      return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    }

    const query = encodeURIComponent(getMapQuery(property.location));
    return query ? `https://www.google.com/maps/search/?api=1&query=${query}` : "https://maps.google.com";
  }, [property]);

  const isFavorite = useMemo(
    () => (user?.favorites || []).some((favoriteId) => String(favoriteId) === String(property?._id)),
    [property?._id, user?.favorites]
  );

  const handleToggleFavorite = async () => {
    if (!property?._id) {
      return;
    }

    if (!isAuthenticated) {
      navigate("/login", { state: { from: resolvePropertyPath(property) } });
      return;
    }

    try {
      setFavoriteBusy(true);
      setActionError("");

      if (isFavorite) {
        await removeFavorite(property._id);
      } else {
        await addFavorite(property._id);
      }

      await refreshUser();
    } catch (favoriteError) {
      setActionError(favoriteError.message);
    } finally {
      setFavoriteBusy(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;

    if (navigator.share) {
      await navigator.share({
        title: property.title,
        text: `View ${property.title} on Sagar Infra`,
        url: shareUrl
      });
      return;
    }

    await navigator.clipboard?.writeText(shareUrl);
  };

  if (loading) {
    return (
      <section className="section-shell">
        <p className="text-sm text-ink-500">Loading property details...</p>
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="section-shell">
        <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{loadError}</p>
      </section>
    );
  }

  if (!property) {
    return (
      <section className="section-shell">
        <p className="text-sm text-ink-500">Property not found.</p>
      </section>
    );
  }

  const imageEntries = normalizePropertyImageEntries(property);
  const videoEntries = normalizePropertyVideoEntries(property);
  const locationText = formatLocation(property.location) || COMPANY_INFO.location;
  const canonicalUrl = `${COMPANY_INFO.canonicalUrl}${resolvePropertyPath(property)}`;
  const sellerName = property.contactName || property.postedBy?.name || COMPANY_INFO.owner;
  const sellerPhone = property.contactPhone || COMPANY_INFO.phoneDisplay;
  const maskedPhone = maskPhoneNumber(sellerPhone);
  const coverImage = getPropertyCoverImage(property);
  const seoImage =
    resolveImageUrl(coverImage, { width: 1200, height: 630, crop: "fill" }) ||
    `${COMPANY_INFO.canonicalUrl}/og-image.svg`;
  const activeVideo = videoEntries[activeVideoIndex] || videoEntries[0] || null;
  const amenities = getFallbackAmenities(property);
  const locationAdvantages = getLocationAdvantages(property);
  const investmentHighlights = getInvestmentHighlights(property);
  const trustSignals = getTrustSignals(property);
  const neighborhoodInsights = getNeighborhoodInsights(property);
  const aiModules = getAiModules(property);
  const priceHistory = getPriceHistory(property);
  const detailItems = [
    { label: "Property Type", value: property.category, icon: Building2 },
    { label: "Area", value: property.area ? `${property.area} sq.ft` : "On request", icon: Ruler },
    { label: "Listing Mode", value: property.listingType === "rent" ? "Rent" : "Buy", icon: ShieldCheck },
    {
      label: "Configuration",
      value: property.bedrooms > 0 ? `${property.bedrooms} Bed / ${property.bathrooms || 0} Bath` : "Builder-grade listing",
      icon: Home
    }
  ];
  const aiScores = {
    lifestyle: property.category === "Commercial" ? 84 : 92,
    commute: property.category === "Plot" ? 83 : 89,
    investment: property.category === "Commercial" ? 95 : property.category === "Plot" ? 93 : 88
  };
  const trustScore = getTrustScore(property);
  const investmentScore = getInvestmentScore(property);

  return (
    <>
      <Seo
        title={`${property.title} | ${COMPANY_INFO.name}`}
        description={property.description}
        canonical={canonicalUrl}
        image={seoImage}
        keywords={`${property.category}, ${locationText}, ${COMPANY_INFO.metaKeywords}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "RealEstateListing",
          name: property.title,
          description: property.description,
          url: canonicalUrl,
          image: imageEntries.map((image) => resolveImageUrl(image.url, { width: 1200, height: 900, crop: "fill" })),
          datePosted: property.createdAt,
          offers: {
            "@type": "Offer",
            price: Number(property.price || 0),
            priceCurrency: "INR",
            availability: "https://schema.org/InStock"
          },
          itemOffered: {
            "@type": "Place",
            name: property.title,
            address: locationText
          }
        }}
      />

      <section className="section-shell">
        {actionError ? <p className="mb-6 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{actionError}</p> : null}
        <div className="glass-panel overflow-hidden p-6 sm:p-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-4xl">
              <div className="flex flex-wrap gap-2">
                <span className="badge border-[#e5dac8] bg-[#faf5ec] text-ink-800">
                  <ShieldCheck size={12} className="text-gold-600" />
                  Verified
                </span>
                <span className="badge border-gold-300/60 bg-[#f7ecd7] text-gold-700">
                  {property.listingType === "rent" ? "Rent" : "Buy"}
                </span>
                <span className="badge border-[#e5dac8] bg-[#faf5ec] text-ink-700">
                  <LockKeyhole size={12} className="text-gold-600" />
                  Protected Contact
                </span>
                {isFeaturedProperty(property) ? (
                  <span className="badge border-gold-300/60 bg-[#f7ecd7] text-gold-700">
                    <Sparkles size={12} />
                    Buyer Pass
                  </span>
                ) : null}
                {hasPropertyVideo(property) ? (
                  <span className="badge border-[#e5dac8] bg-[#faf5ec] text-ink-700">
                    <Clapperboard size={12} className="text-gold-600" />
                    Video Tour
                  </span>
                ) : null}
              </div>

              <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.96] tracking-[-0.05em] text-ink-900 sm:text-6xl">
                {property.title}
              </h1>
              <p className="mt-4 inline-flex items-center gap-2 text-sm text-ink-600 sm:text-base">
                <MapPin size={16} className="text-gold-600" />
                {locationText}
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-8 text-ink-500 sm:text-base">{property.description}</p>
            </div>

            <div className="min-w-full rounded-[28px] border border-gold-300/40 bg-[#fbf2df] p-5 xl:min-w-[330px]">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold-700">Quoted Price</p>
              <p className="mt-3 text-4xl font-semibold text-ink-900 sm:text-5xl">{formatCurrency(property.price)}</p>
              <p className="mt-3 text-sm text-ink-500">Protected number: {maskedPhone}</p>
              <div className="mt-5 flex flex-col gap-3">
                <a href={toPhoneHref(sellerPhone)} className="btn-primary w-full">
                  <Phone size={16} />
                  Call Now
                </a>
                <a
                  href={toWhatsAppHref(
                    sellerPhone,
                    `Hi Sagar Infra, I want details about ${property.title} in ${locationText}.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-whatsapp w-full"
                >
                  <MessageCircleMore size={16} />
                  WhatsApp
                </a>
                <button type="button" onClick={handleToggleFavorite} disabled={favoriteBusy} className="btn-ghost w-full">
                  <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
                  {favoriteBusy
                    ? "Updating Wishlist..."
                    : isFavorite
                      ? "Saved to Wishlist"
                      : isAuthenticated
                        ? "Save to Wishlist"
                        : "Login to Save"}
                </button>
                <button type="button" onClick={handleShare} className="btn-ghost w-full">
                  <Share2 size={16} />
                  Share Property
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <ImageGallerySlider images={imageEntries} title={property.title} />
          </div>
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <article className="glass-panel p-6 sm:p-7">
              <p className="section-kicker">Decision Overview</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {detailItems.map((item) => (
                    <DetailCard key={item.label} {...item} />
                  ))}
                </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[26px] border border-gold-300/40 bg-[#fbf2df] p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold-700">Property Trust Score</p>
                  <p className="mt-2 text-4xl font-semibold text-ink-900">{trustScore}/100</p>
                  <p className="mt-2 text-sm leading-7 text-ink-500">Owner, document, location, and market verification signals.</p>
                </div>
                <div className="rounded-[26px] border border-gold-300/40 bg-[#fbf2df] p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold-700">Investment Score</p>
                  <p className="mt-2 text-4xl font-semibold text-ink-900">{investmentScore}/100</p>
                  <p className="mt-2 text-sm leading-7 text-ink-500">Demand, asset type, trust, area, and visibility indicators.</p>
                </div>
              </div>
            </article>

            <article className="glass-panel p-6 sm:p-7">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="section-kicker">Trust Infrastructure</p>
                  <h2 className="mt-2 text-3xl font-semibold text-ink-900">Buyer protection designed into the experience</h2>
                </div>
                <span className="badge border-gold-300/60 bg-[#f7ecd7] text-gold-700">
                  <ShieldCheck size={12} />
                  Enterprise Trust Layer
                </span>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {trustSignals.map((item) => (
                  <SignalCard key={item.label} {...item} />
                ))}
              </div>
            </article>

            {videoEntries.length > 0 ? (
              <article className="glass-panel p-6 sm:p-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="section-kicker">Video Section</p>
                    <h2 className="mt-2 text-3xl font-semibold text-ink-900">Property walkthrough and site view</h2>
                  </div>
                  <p className="text-sm text-ink-500">
                    {activeVideo?.type === "youtube" ? "YouTube Tour" : "Uploaded Video"}
                  </p>
                </div>

                <div className="mt-5">
                  <MediaPlayer item={activeVideo} title={`${property.title} video tour`} poster={coverImage} />
                </div>

                {videoEntries.length > 1 ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {videoEntries.map((entry, index) => (
                      <button
                        key={`${entry.type}-${entry.url}`}
                        type="button"
                        onClick={() => setActiveVideoIndex(index)}
                        className={`rounded-[24px] border p-4 text-left transition ${
                          index === activeVideoIndex
                            ? "border-gold-300 bg-[#fbf2df] text-ink-900"
                            : "border-[#eadfce] bg-[#fbf8f2] text-ink-600 hover:border-gold-300"
                        }`}
                      >
                        <span className="inline-flex items-center gap-2 text-sm font-semibold">
                          <Clapperboard size={15} className="text-gold-600" />
                          {entry.label || `Video ${index + 1}`}
                        </span>
                        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-ink-400">
                          {entry.type === "youtube" ? "Embedded Player" : "Custom Video Player"}
                        </p>
                      </button>
                    ))}
                  </div>
                ) : null}
              </article>
            ) : null}

            <article className="glass-panel p-6 sm:p-7">
              <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
                <div>
                  <p className="section-kicker">Description</p>
                  <p className="mt-4 whitespace-pre-line text-sm leading-8 text-ink-500 sm:text-base">
                    {property.description}
                  </p>
                </div>

                <div className="rounded-[30px] border border-[#ece1d3] bg-[#fbf8f2] p-5">
                  <p className="section-kicker">Builder Snapshot</p>
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-[22px] border border-[#e7dccb] bg-white p-4">
                      <p className="text-sm font-semibold text-ink-900">Construction Status</p>
                      <p className="mt-2 text-sm text-ink-500">{getConstructionStatus(property)}</p>
                    </div>
                    <div className="rounded-[22px] border border-[#e7dccb] bg-white p-4">
                      <p className="text-sm font-semibold text-ink-900">Floor Plan</p>
                      <p className="mt-2 text-sm text-ink-500">
                        {property.area
                          ? `${property.area} sq.ft configuration overview ready for buyer discussion`
                          : "Floor plan and dimensional guidance can be shared on request."}
                      </p>
                    </div>
                    <div className="rounded-[22px] border border-[#e7dccb] bg-white p-4">
                      <p className="text-sm font-semibold text-ink-900">Brochure Access</p>
                      <p className="mt-2 text-sm text-ink-500">
                        Request the brochure or a shareable project summary directly on WhatsApp.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3">
                    <a
                      href={toWhatsAppHref(
                        sellerPhone,
                        `Hi Sagar Infra, please share the brochure or floor plan for ${property.title}.`
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-secondary w-full"
                    >
                      Request Brochure
                    </a>
                    <a
                      href={toWhatsAppHref(
                        sellerPhone,
                        `Hi Sagar Infra, I want the floor plan and full project details for ${property.title}.`
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-ghost w-full"
                    >
                      Request Floor Plan
                    </a>
                  </div>
                </div>
              </div>
            </article>

            <article className="glass-panel p-6 sm:p-7">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="section-kicker">Neighborhood Lifestyle Engine</p>
                  <h2 className="mt-2 text-3xl font-semibold text-ink-900">Hyperlocal signals for faster conviction</h2>
                </div>
                <span className="text-sm text-ink-500">Preview intelligence for safety, commute, utilities, and daily life.</span>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {neighborhoodInsights.map((item) => (
                  <MeterCard key={item.label} {...item} />
                ))}
              </div>
            </article>

            {priceHistory.length > 0 ? (
              <article className="glass-panel p-6 sm:p-7">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="section-kicker">Investment Outlook</p>
                    <h2 className="mt-2 text-3xl font-semibold text-ink-900">Indicative price trajectory and value framing</h2>
                  </div>
                  <span className="text-sm text-ink-500">Preview graph for investor conversations and price-confidence context.</span>
                </div>

                <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-[30px] border border-[#ece1d3] bg-[#fbf8f2] p-5">
                    <div className="flex items-end gap-3 overflow-x-auto">
                      {priceHistory.map((point) => {
                        const maxValue = Math.max(...priceHistory.map((entry) => entry.value));
                        const height = `${Math.max(22, Math.round((point.value / maxValue) * 100))}%`;

                        return (
                          <div key={point.label} className="flex min-w-[72px] flex-1 flex-col items-center gap-3">
                            <div className="flex h-48 w-full items-end rounded-[24px] bg-white p-2">
                              <div
                                className="w-full rounded-[18px] bg-gradient-to-t from-[#0b1d3a] via-[#3a5a8f] to-[#d4af37]"
                                style={{ height }}
                              />
                            </div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">{point.label}</p>
                            <p className="text-sm font-semibold text-ink-900">{formatCurrency(point.value)}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <SignalCard
                      label="Rental yield outlook"
                      value={property.listingType === "rent" ? "8.4% signal" : "6.9% signal"}
                      helper="Useful for investor discussions, rentability, and future portfolio planning."
                      icon={CircleDollarSign}
                    />
                    <SignalCard
                      label="Demand heat"
                      value={property.views ? `${Math.min(98, 72 + property.views)} / 100` : "84 / 100"}
                      helper="Active buyer attention and response readiness around this listing."
                      icon={BarChart3}
                    />
                  </div>
                </div>
              </article>
            ) : null}

            <article className="glass-panel p-6 sm:p-7">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="section-kicker">AI Property Lab</p>
                  <h2 className="mt-2 text-3xl font-semibold text-ink-900">Future-ready modules layered into the buyer journey</h2>
                </div>
                <span className="badge border-gold-300/60 bg-[#f7ecd7] text-gold-700">
                  <Bot size={12} />
                  Intelligent UX
                </span>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <SignalCard
                  label="Lifestyle score"
                  value={`${aiScores.lifestyle}%`}
                  helper="Based on use-case fit, comfort cues, and long-term livability."
                  icon={Home}
                />
                <SignalCard
                  label="Commute score"
                  value={`${aiScores.commute}%`}
                  helper="A proxy for local access, movement ease, and everyday practicality."
                  icon={CarFront}
                />
                <SignalCard
                  label="Investment score"
                  value={`${aiScores.investment}%`}
                  helper="Guides appreciation potential, buyer demand, and future opportunity positioning."
                  icon={BarChart3}
                />
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {aiModules.map((item) => (
                  <div key={item.title} className="rounded-[26px] border border-[#ece1d3] bg-[#fbf8f2] p-5">
                    <item.icon size={18} className="text-gold-600" />
                    <p className="mt-4 text-xl font-semibold text-ink-900">{item.title}</p>
                    <p className="mt-3 text-sm leading-7 text-ink-500">{item.helper}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="glass-panel p-6 sm:p-7">
              <p className="section-kicker">Amenities</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {amenities.map((item) => (
                  <div key={item} className="rounded-[22px] border border-[#e9dfd2] bg-[#fbf8f2] px-4 py-4">
                    <p className="inline-flex items-center gap-2 text-sm font-medium text-ink-700">
                      <Trees size={16} className="text-gold-600" />
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="glass-panel p-6 sm:p-7">
              <p className="section-kicker">Location Advantages</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {locationAdvantages.map((item) => (
                  <div key={item} className="rounded-[22px] border border-[#e9dfd2] bg-[#fbf8f2] px-4 py-4">
                    <p className="inline-flex items-center gap-2 text-sm text-ink-600">
                      <MapPin size={15} className="text-gold-600" />
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="glass-panel p-6 sm:p-7">
              <p className="section-kicker">Investment Highlights</p>
              <div className="mt-5 grid gap-3">
                {investmentHighlights.map((item) => (
                  <div key={item} className="rounded-[22px] border border-[#e9dfd2] bg-[#fbf8f2] px-4 py-4">
                    <p className="inline-flex items-center gap-2 text-sm text-ink-600">
                      <Sparkles size={15} className="text-gold-600" />
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            {mapSrc ? (
              <article className="glass-panel space-y-4 p-6 sm:p-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="section-kicker">Map</p>
                    <h2 className="mt-2 text-3xl font-semibold text-ink-900">Location Preview</h2>
                  </div>
                  <a href={openMapLink} target="_blank" rel="noreferrer" className="btn-ghost w-full sm:w-auto">
                    <ExternalLink size={16} />
                    Open in Maps
                  </a>
                </div>
                <div className="overflow-hidden rounded-[28px] border border-[#e7dccb]">
                  <iframe title="Property map" src={mapSrc} className="aspect-video w-full" loading="lazy" />
                </div>
              </article>
            ) : null}
          </div>

          <div className="space-y-6 xl:sticky xl:top-28 xl:self-start">
            <article className="glass-panel space-y-4 p-6 sm:p-7">
              <p className="section-kicker">Sticky Contact Bar</p>
              <div className="rounded-[24px] border border-[#ece1d3] bg-[#fbf8f2] p-5">
                <p className="font-semibold text-ink-900">{sellerName}</p>
                <p className="mt-2 text-sm text-ink-500">{locationText || COMPANY_INFO.address}</p>
                <p className="mt-4 text-3xl font-semibold text-ink-900">{formatCurrency(property.price)}</p>
                <p className="mt-3 text-sm text-ink-500">Protected number: {maskedPhone}</p>
              </div>
              <a href={toPhoneHref(sellerPhone)} className="btn-primary w-full">
                <Phone size={16} />
                Call Now
              </a>
              <a
                href={toWhatsAppHref(
                  sellerPhone,
                  `Hi Sagar Infra, I want details about ${property.title} in ${locationText}.`
                )}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp w-full"
              >
                <MessageCircleMore size={16} />
                WhatsApp
              </a>
              <a href="#property-lead-capture" className="btn-ghost w-full">
                <Clock3 size={16} />
                Request Callback
              </a>
            </article>

            <article className="glass-panel p-6 sm:p-7">
              <p className="section-kicker">Buyer Tools</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-[24px] border border-[#ece1d3] bg-[#fbf8f2] p-4">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink-900">
                    <Layers3 size={16} className="text-gold-600" />
                    Comparison-ready
                  </p>
                  <p className="mt-2 text-sm leading-7 text-ink-500">
                    Pair this property with two others from the marketplace and build a family decision board.
                  </p>
                </div>
                <div className="rounded-[24px] border border-[#ece1d3] bg-[#fbf8f2] p-4">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink-900">
                    <Video size={16} className="text-gold-600" />
                    Live walkthrough ready
                  </p>
                  <p className="mt-2 text-sm leading-7 text-ink-500">
                    Schedule a guided video visit for remote buyers, NRIs, or busy decision-makers.
                  </p>
                </div>
                <div className="rounded-[24px] border border-[#ece1d3] bg-[#fbf8f2] p-4">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink-900">
                    <Sparkles size={16} className="text-gold-600" />
                    Premium Buyer Pass
                  </p>
                  <p className="mt-2 text-sm leading-7 text-ink-500">
                    Early access listings, legal support, and faster callback windows can be layered here next.
                  </p>
                </div>
              </div>
            </article>

            <div id="property-lead-capture">
              <LeadCaptureForm
                compact
                title="Send Property Requirement"
                description="Share your name, phone, and requirement for a visit, pricing discussion, or booking support."
                submitLabel="Submit Lead"
                successMessage="Your property lead has been submitted successfully."
                propertyId={property._id}
                source="property"
                showEmail
                showLocation
                requirementSeed={`I want to discuss ${property.title}.`}
              />
            </div>
          </div>
        </div>
      </section>

      {similarProperties.length > 0 ? (
        <section className="section-shell pt-0">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-kicker">Similar Properties</p>
              <h2 className="section-title mt-2 text-ink-900">More premium options near this match</h2>
            </div>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,21rem),1fr))] gap-5">
            {similarProperties.map((item) => (
              <PropertyCard key={item._id || item.slug || item.title} property={item} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
};

export default PropertyDetailsPage;
