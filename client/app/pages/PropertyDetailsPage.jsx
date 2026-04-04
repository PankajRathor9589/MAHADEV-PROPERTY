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
import {
  COMPANY_INFO,
  TRUST_BADGES,
  findDemoPropertyById,
  isDemoPropertyId
} from "../data/siteContent.js";
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
        <p className="text-sm text-white/60">Loading property details...</p>
      </div>
    );
  }

  if (error && !property) {
    return (
      <div className="section-shell">
        <p className="rounded-2xl bg-rose-500/12 p-4 text-sm text-rose-200">{error}</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="section-shell">
        <p className="text-sm text-white/60">Property not found.</p>
      </div>
    );
  }

  const detailFeatures = property.featuresList || property.amenities || [];
  const bookVisitPropertyId = isDemoPropertyId(property._id) ? "" : property._id;

  return (
    <div className="space-y-8">
      <section className="section-shell">
        <div className="card space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="badge bg-slate-950/70 text-white">
                  {property.listingType === "rent" ? "For Rent" : "For Sale"}
                </span>
                <span className="badge bg-white/10 text-white">{property.category}</span>
                {isFeaturedProperty(property) ? (
                  <span className="badge bg-gold-300/15 text-gold-100">
                    <Sparkles size={12} />
                    Featured
                  </span>
                ) : null}
              </div>

              <div>
                <h1 className="font-display text-5xl font-semibold text-white">{property.title}</h1>
                <p className="mt-3 inline-flex items-center gap-2 text-sm text-white/70">
                  <MapPin size={15} />
                  {formatLocation(property.location)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <p className="text-3xl font-bold text-gold-200">{formatCurrency(property.price)}</p>
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
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-200/80">Property Overview</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[24px] border border-white/10 bg-slate-950/35 p-4 text-white/70">
                <Ruler size={16} className="text-gold-200" />
                <p className="mt-3 text-2xl font-semibold text-white">{property.area}</p>
                <p className="text-sm">sq.ft</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-slate-950/35 p-4 text-white/70">
                <BedDouble size={16} className="text-gold-200" />
                <p className="mt-3 text-2xl font-semibold text-white">{property.bedrooms || 0}</p>
                <p className="text-sm">Bedrooms</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-slate-950/35 p-4 text-white/70">
                <Bath size={16} className="text-gold-200" />
                <p className="mt-3 text-2xl font-semibold text-white">{property.bathrooms || 0}</p>
                <p className="text-sm">Bathrooms</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-slate-950/35 p-4 text-white/70">
                <Building2 size={16} className="text-gold-200" />
                <p className="mt-3 text-2xl font-semibold text-white">{property.category}</p>
                <p className="text-sm">Property Type</p>
              </div>
            </div>
          </article>

          <article className="card">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-200/80">Full Description</p>
            <p className="mt-4 whitespace-pre-line text-sm leading-8 text-white/70">{property.description}</p>

            {detailFeatures.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-white">Features List</h2>
                <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                  {detailFeatures.map((feature) => (
                    <li key={feature} className="rounded-[22px] border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-white/70">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>

          {mapSrc && (
            <article className="card space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-200/80">Google Map</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Location Preview</h2>
                </div>
                <a href={openMapLink} target="_blank" rel="noreferrer" className="btn-secondary">
                  <ExternalLink size={16} />
                  Open Map
                </a>
              </div>
              <iframe title="Property map" src={mapSrc} className="h-80 w-full rounded-[28px] border border-white/10" loading="lazy" />
            </article>
          )}
        </div>

        <div className="space-y-6">
          <article className="card space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-200/80">Contact</p>
            <div className="rounded-[24px] border border-white/10 bg-slate-950/35 p-4">
              <p className="font-semibold text-white">{COMPANY_INFO.owner}</p>
              <p className="mt-2 text-sm text-white/60">{COMPANY_INFO.address}</p>
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
            requirementSeed={`I want to book a visit for ${property.title}.`}
          />

          <article className="card space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-200/80">Trust Badges</p>
            {TRUST_BADGES.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-slate-950/35 p-4">
                <span className="rounded-2xl bg-gold-300/12 p-3 text-gold-100">
                  <ShieldCheck size={18} />
                </span>
                <div>
                  <p className="font-semibold text-white">{item}</p>
                  <p className="mt-1 text-sm text-white/55">Trusted local guidance backed by responsive communication and practical execution support in Sagar.</p>
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
