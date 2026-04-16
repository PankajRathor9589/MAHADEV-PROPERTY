import {
  Bath,
  BedDouble,
  Building2,
  ExternalLink,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ImageGallerySlider from "../components/ImageGallerySlider.jsx";
import LeadCaptureForm from "../components/LeadCaptureForm.jsx";
import { COMPANY_INFO, TRUST_BADGES, findDemoPropertyById, isDemoPropertyId } from "../data/siteContent.js";
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

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const demoProperty = findDemoPropertyById(id);
    if (demoProperty) {
      setProperty(demoProperty);
      setLoading(false);
      setError("");
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetchPropertyById(id);
        setProperty(response);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const sellerPhone = property?.contactPhone || COMPANY_INFO.phoneLink;

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
      <div className="section-shell">
        <p className="text-sm text-ink-500">Loading property details...</p>
      </div>
    );
  }

  if (error && !property) {
    return (
      <div className="section-shell">
        <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="section-shell">
        <p className="text-sm text-ink-500">Property not found.</p>
      </div>
    );
  }

  const detailFeatures = property.featuresList || property.amenities || [];
  const bookVisitPropertyId = isDemoPropertyId(property._id) ? "" : property._id;

  return (
    <div className="space-y-8">
      <section className="section-shell">
        <div className="card space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="badge bg-brand-50 text-brand-700">
                  {property.listingType === "rent" ? "For Rent" : "For Purchase"}
                </span>
                <span className="badge bg-brand-500 text-white">{property.category}</span>
                {isFeaturedProperty(property) ? (
                  <span className="badge bg-[#f5e4bf] text-brand-700">
                    <Sparkles size={12} />
                    Featured
                  </span>
                ) : null}
              </div>

              <div>
                <h1 className="font-display text-4xl font-semibold text-ink-700 sm:text-5xl">{property.title}</h1>
                <p className="mt-3 inline-flex items-center gap-2 text-sm text-ink-500">
                  <MapPin size={15} className="text-brand-600" />
                  {formatLocation(property.location)}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 sm:items-end">
              <p className="text-3xl font-bold text-brand-600">{formatCurrency(property.price)}</p>
              <a href={toPhoneHref(sellerPhone)} className="btn-primary">
                <Phone size={16} />
                Contact Now
              </a>
            </div>
          </div>

          <ImageGallerySlider images={property.images} title={property.title} />
        </div>
      </section>

      <section className="section-shell grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <article className="card">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600">Property Overview</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4 text-ink-600">
                <Ruler size={16} className="text-brand-600" />
                <p className="mt-3 text-2xl font-semibold text-ink-700">{property.area}</p>
                <p className="text-sm">sq.ft</p>
              </div>
              <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4 text-ink-600">
                <BedDouble size={16} className="text-brand-600" />
                <p className="mt-3 text-2xl font-semibold text-ink-700">{property.bedrooms || 0}</p>
                <p className="text-sm">Bedrooms</p>
              </div>
              <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4 text-ink-600">
                <Bath size={16} className="text-brand-600" />
                <p className="mt-3 text-2xl font-semibold text-ink-700">{property.bathrooms || 0}</p>
                <p className="text-sm">Bathrooms</p>
              </div>
              <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4 text-ink-600">
                <Building2 size={16} className="text-brand-600" />
                <p className="mt-3 text-2xl font-semibold text-ink-700">{property.category}</p>
                <p className="text-sm">Property Type</p>
              </div>
            </div>
          </article>

          <article className="card">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600">Full Description</p>
            <p className="mt-4 whitespace-pre-line text-sm leading-8 text-ink-500">{property.description}</p>

            {detailFeatures.length > 0 ? (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-ink-700">Features List</h2>
                <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                  {detailFeatures.map((feature) => (
                    <li key={feature} className="rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-ink-600">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </article>

          {mapSrc ? (
            <article className="card space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600">Google Map</p>
                  <h2 className="mt-2 text-2xl font-semibold text-ink-700">Location Preview</h2>
                </div>
                <a href={openMapLink} target="_blank" rel="noreferrer" className="btn-secondary w-full sm:w-auto">
                  <ExternalLink size={16} />
                  Open Map
                </a>
              </div>
              <iframe title="Property map" src={mapSrc} className="h-80 w-full rounded-[28px] border border-brand-100" loading="lazy" />
            </article>
          ) : null}
        </div>

        <div className="space-y-6">
          <article className="card space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600">Contact</p>
            <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4">
              <p className="font-semibold text-ink-700">{COMPANY_INFO.owner}</p>
              <p className="mt-2 text-sm text-ink-500">{COMPANY_INFO.address}</p>
            </div>
            <a href={toPhoneHref(sellerPhone)} className="btn-primary w-full">
              <Phone size={16} />
              Call Now
            </a>
            <a
              href={toWhatsAppHref(COMPANY_INFO.whatsappNumber, COMPANY_INFO.whatsappMessage)}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary w-full"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </article>

          <LeadCaptureForm
            compact
            title="Book Visit"
            description="Send your name, phone, and requirement to schedule a site visit or discuss the fit of this property for your plans."
            submitLabel="Book Visit"
            successMessage="Visit request received. We will contact you soon."
            propertyId={bookVisitPropertyId}
            source="book_visit"
            showEmail
            requirementSeed={`I want to book a visit for ${property.title}.`}
          />

          <article className="card space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600">Trust Badges</p>
            {TRUST_BADGES.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50 p-4">
                <span className="rounded-2xl bg-white p-3 text-brand-700 shadow-sm">
                  <ShieldCheck size={18} />
                </span>
                <div>
                  <p className="font-semibold text-ink-700">{item}</p>
                  <p className="mt-1 text-sm text-ink-500">Trusted local guidance backed by responsive communication and practical execution support in Sagar.</p>
                </div>
              </div>
            ))}
          </article>
        </div>
      </section>
    </div>
  );
};

export default PropertyDetailsPage;
