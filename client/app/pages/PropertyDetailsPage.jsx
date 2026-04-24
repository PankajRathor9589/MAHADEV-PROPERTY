import {
  Building2,
  ExternalLink,
  MapPin,
  MessageCircleMore,
  Phone,
  Ruler,
  ShieldCheck
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ImageGallerySlider from "../components/ImageGallerySlider.jsx";
import LeadCaptureForm from "../components/LeadCaptureForm.jsx";
import { COMPANY_INFO } from "../data/siteContent.js";
import { fetchPropertyById } from "../services/api.js";
import {
  formatCurrency,
  formatLocation,
  getCoordinates,
  getMapQuery,
  isFeaturedProperty,
  toPhoneHref,
  toWhatsAppHref
} from "../utils/format.js";
import { FEATURED_FALLBACK_PROPERTIES } from "../data/siteContent.js";
import { API_BASE_URL } from "../services/api.js";

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fallbackProperty = useMemo(
    () => FEATURED_FALLBACK_PROPERTIES.find((item) => item._id === id) || null,
    [id]
  );

  useEffect(() => {
    const loadProperty = async () => {
      if (!API_BASE_URL && fallbackProperty) {
        setProperty(fallbackProperty);
        setLoading(false);
        setError("");
        return;
      }

      try {
        setLoading(true);
        setError("");
        const response = await fetchPropertyById(id);
        setProperty(response);
      } catch (loadError) {
        if (fallbackProperty) {
          setProperty(fallbackProperty);
          setError("");
        } else {
          setError(loadError.message);
          setProperty(null);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [fallbackProperty, id]);

  useEffect(() => {
    if (!property) {
      return;
    }

    document.title = `${property.title} | ${COMPANY_INFO.metaTitle}`;
  }, [property]);

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

  const locationText = formatLocation(property.location) || COMPANY_INFO.location;
  const sellerPhone = property.contactPhone || COMPANY_INFO.phoneDisplay;
  const detailItems = [
    { label: "Property Type", value: property.category, icon: Building2 },
    { label: "Area", value: `${property.area || 0} sq.ft`, icon: Ruler },
    { label: "Listing Mode", value: property.listingType === "rent" ? "Rent" : "Buy", icon: ShieldCheck }
  ];

  return (
    <>
      <section className="section-shell">
        <div className="card space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="badge bg-brand-50 text-brand-700">
                  <ShieldCheck size={12} />
                  {property.isShowcase ? "Signature Listing" : "Verified"}
                </span>
                <span className="badge bg-brand-500 text-white">
                  {property.listingType === "rent" ? "Rent" : "Buy"}
                </span>
                {isFeaturedProperty(property) ? (
                  <span className="badge bg-[#f5e4bf] text-brand-700">Featured</span>
                ) : null}
              </div>

              <div>
                <h1 className="hero-title text-ink-800">{property.title}</h1>
                <p className="mt-3 inline-flex items-center gap-2 text-sm text-ink-500">
                  <MapPin size={15} className="text-brand-700" />
                  {locationText}
                </p>
              </div>
            </div>

            <div className="rounded-[24px] border border-brand-100 bg-brand-50 px-5 py-4">
              <p className="text-sm font-medium text-ink-500">Quoted Price</p>
              <p className="mt-2 text-3xl font-bold text-brand-700">{formatCurrency(property.price)}</p>
            </div>
          </div>

          <ImageGallerySlider images={property.images} title={property.title} />
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <article className="card">
              <p className="section-kicker">Property Overview</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {detailItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.label} className="rounded-2xl border border-brand-100 bg-brand-50 p-4">
                      <Icon size={18} className="text-brand-700" />
                      <p className="mt-3 text-sm font-medium text-ink-500">{item.label}</p>
                      <p className="mt-1 text-lg font-semibold text-ink-800">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="card">
              <p className="section-kicker">Description</p>
              <p className="mt-4 whitespace-pre-line text-sm leading-8 text-ink-500">{property.description}</p>
            </article>

            {mapSrc ? (
              <article className="card space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="section-kicker">Map</p>
                    <h2 className="mt-2 text-2xl font-semibold text-ink-800">Location Preview</h2>
                  </div>
                  <a href={openMapLink} target="_blank" rel="noreferrer" className="btn-secondary w-full sm:w-auto">
                    <ExternalLink size={16} />
                    Open in Maps
                  </a>
                </div>
                <iframe
                  title="Property map"
                  src={mapSrc}
                  className="h-80 w-full rounded-[28px] border border-brand-100"
                  loading="lazy"
                />
              </article>
            ) : null}
          </div>

          <div className="space-y-6">
            <article className="card space-y-4">
              <p className="section-kicker">Verified Contact</p>
              <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4">
                <p className="font-semibold text-ink-800">{COMPANY_INFO.owner}</p>
                <p className="mt-2 text-sm text-ink-500">{COMPANY_INFO.address}</p>
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
              requirementSeed={`I want to discuss ${property.title}.`}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default PropertyDetailsPage;
