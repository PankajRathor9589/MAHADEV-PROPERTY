import {
  Building2,
  Clapperboard,
  ExternalLink,
  Home,
  MapPin,
  MessageCircleMore,
  Phone,
  Ruler,
  ShieldCheck,
  Sparkles,
  Trees
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ImageGallerySlider from "../components/ImageGallerySlider.jsx";
import LeadCaptureForm from "../components/LeadCaptureForm.jsx";
import MediaPlayer from "../components/MediaPlayer.jsx";
import Seo from "../components/Seo.jsx";
import { COMPANY_INFO } from "../data/siteContent.js";
import { API_BASE_URL, fetchPropertyById, resolveImageUrl } from "../services/api.js";
import {
  formatCurrency,
  formatLocation,
  getCoordinates,
  getMapQuery,
  getPropertyCoverImage,
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

const getLocationAdvantages = (property, locationText) => {
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
    property.listingType === "rent" ? "Income-oriented opportunity with faster evaluation path" : "Suitable for capital appreciation and end-use decisions",
    isFeaturedProperty(property) ? "Featured visibility improves buyer confidence and listing quality perception" : "Presented with verified-first trust cues",
    property.views ? `${property.views} recent views indicate active interest` : "Built for direct calls, WhatsApp, and high-intent leads",
    property.category === "Commercial"
      ? "Commercial positioning supports business visibility and investor discussions"
      : property.category === "Plot"
        ? "Plot-focused buyers can evaluate growth potential and access quickly"
        : "Residential positioning supports both lifestyle and long-term value"
  ];

  return suggestions.filter(Boolean);
};

const DetailCard = ({ label, value, icon: Icon }) => (
  <div className="rounded-[24px] border border-[#e9dfd2] bg-[#fbf8f2] p-4">
    <Icon size={18} className="text-gold-600" />
    <p className="mt-3 text-sm font-medium text-ink-500">{label}</p>
    <p className="mt-1 text-lg font-semibold text-ink-900">{value}</p>
  </div>
);

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetchPropertyById(id);
        setProperty(response);
      } catch (loadError) {
        setError(loadError.message || (API_BASE_URL ? "Property not found." : "Property API is not configured."));
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

  if (loading) {
    return (
      <section className="section-shell">
        <p className="text-sm text-ink-500">Loading property details...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-shell">
        <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>
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
  const coverImage = getPropertyCoverImage(property);
  const seoImage =
    resolveImageUrl(coverImage, { width: 1200, height: 630, crop: "fill" }) ||
    `${COMPANY_INFO.canonicalUrl}/og-image.svg`;
  const activeVideo = videoEntries[activeVideoIndex] || videoEntries[0] || null;
  const amenities = getFallbackAmenities(property);
  const locationAdvantages = getLocationAdvantages(property, locationText);
  const investmentHighlights = getInvestmentHighlights(property);
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
                {isFeaturedProperty(property) ? (
                  <span className="badge border-gold-300/60 bg-[#f7ecd7] text-gold-700">
                    <Sparkles size={12} />
                    Featured
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

            <div className="min-w-full rounded-[28px] border border-gold-300/40 bg-[#fbf2df] p-5 xl:min-w-[320px]">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold-700">Quoted Price</p>
              <p className="mt-3 text-4xl font-semibold text-ink-900 sm:text-5xl">{formatCurrency(property.price)}</p>
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
              <p className="section-kicker">Project Overview</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {detailItems.map((item) => (
                  <DetailCard key={item.label} {...item} />
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
              <p className="section-kicker">Sticky Contact Box</p>
              <div className="rounded-[24px] border border-[#ece1d3] bg-[#fbf8f2] p-5">
                <p className="font-semibold text-ink-900">{sellerName}</p>
                <p className="mt-2 text-sm text-ink-500">{locationText || COMPANY_INFO.address}</p>
                <p className="mt-4 text-3xl font-semibold text-ink-900">{formatCurrency(property.price)}</p>
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
            </article>

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
      </section>
    </>
  );
};

export default PropertyDetailsPage;
