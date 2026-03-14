import { useEffect, useMemo, useState } from "react";
import { FaHeart, FaMapMarkedAlt, FaWhatsapp } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { favoriteApi, propertyApi } from "../api/services";
import ContactAgentForm from "../components/property/ContactAgentForm";
import PropertyCard from "../components/property/PropertyCard";
import PropertyGallery from "../components/property/PropertyGallery";
import Seo from "../components/ui/Seo";
import { GallerySkeleton } from "../components/ui/Skeletons";
import { DEFAULT_AMENITIES, SITE_URL } from "../config/site";
import { useAuth } from "../context/AuthContext";
import { formatArea, formatPrice } from "../utils/format";

const buildStructuredData = (property) => ({
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  name: property.title,
  description: property.description,
  url: `${SITE_URL}/properties/${property.id}`,
  image: property.images.map((image) => image.url),
  offers: {
    "@type": "Offer",
    priceCurrency: "INR",
    price: property.price,
    availability: property.status === "approved" ? "https://schema.org/InStock" : "https://schema.org/PreOrder"
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: property.location,
    addressLocality: property.city,
    addressCountry: "IN"
  },
  seller: {
    "@type": "RealEstateAgent",
    name: property.agent?.name,
    telephone: property.agent?.phone,
    email: property.agent?.email
  }
});

const PropertyDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const [item, response, savedProperties] = await Promise.all([
          propertyApi.byId(id),
          propertyApi.list({ limit: 12 }),
          user ? favoriteApi.list() : Promise.resolve([])
        ]);

        setProperty(item);
        setFavoriteIds(savedProperties.map((entry) => entry.id));

        const scored = response.items
          .filter((entry) => entry.id !== item.id)
          .map((entry) => {
            let score = 0;
            if (entry.city === item.city) score += 4;
            if (entry.propertyType === item.propertyType) score += 3;
            if (Math.abs((entry.bedrooms || 0) - (item.bedrooms || 0)) <= 1) score += 1;
            if (entry.location.toLowerCase().includes(item.city.toLowerCase())) score += 1;

            return { entry, score };
          })
          .sort((left, right) => right.score - left.score)
          .slice(0, 3)
          .map((entry) => entry.entry);

        setSimilar(scored);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, user]);

  const structuredData = useMemo(() => (property ? buildStructuredData(property) : null), [property]);

  const handleFavoriteToggle = async (propertyId, isFavorite) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    if (isFavorite) {
      await favoriteApi.remove(propertyId);
      setFavoriteIds((current) => current.filter((entry) => entry !== propertyId));
      return;
    }

    await favoriteApi.add(propertyId);
    setFavoriteIds((current) => [...new Set([...current, propertyId])]);
  };

  if (loading) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
        <section className="space-y-6">
          <GallerySkeleton />
          <div className="panel-card h-72 animate-pulse bg-white/70" />
          <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
            <div className="panel-card h-56 animate-pulse bg-white/70" />
            <div className="panel-card h-56 animate-pulse bg-white/70" />
          </div>
        </section>
        <aside className="space-y-6">
          <div className="panel-card h-48 animate-pulse bg-white/70" />
          <div className="panel-card h-80 animate-pulse bg-white/70" />
        </aside>
      </div>
    );
  }

  if (!property) {
    return <div className="panel-card grid min-h-[50vh] place-items-center p-8 text-slate-600">Property not found.</div>;
  }

  const amenities = property.amenities.length > 0 ? property.amenities : DEFAULT_AMENITIES;
  const whatsapp = property.agent?.whatsapp || "917692016188";
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(property.mapQuery)}&z=15&output=embed`;
  const canonical = `${SITE_URL}/properties/${property.id}`;

  return (
    <>
      <Seo
        title={property.title}
        description={property.description}
        canonical={canonical}
        image={property.images?.[0]?.url}
        type="article"
        keywords={`${property.propertyType}, ${property.city}, property detail, ${property.title}`}
        structuredData={structuredData}
      />

      <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
        <section className="space-y-6">
          <PropertyGallery title={property.title} images={property.images} />

          <div className="panel-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <p className="surface-label">
                  {property.propertyType} · {property.city}
                </p>
                <h1 className="mt-2 text-4xl font-semibold text-ink sm:text-5xl">{property.title}</h1>
                <p className="mt-3 text-sm text-slate-600">{property.location}</p>
              </div>

              <div className="rounded-[28px] bg-slate-50 px-5 py-4 text-right">
                <p className="text-3xl font-semibold text-ink">{formatPrice(property.price)}</p>
                <div className="mt-3 flex items-center justify-end gap-2">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      property.status === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : property.status === "rejected"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {property.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleFavoriteToggle(property.id, favoriteIds.includes(property.id))}
                    className={`grid h-10 w-10 place-items-center rounded-full transition ${
                      favoriteIds.includes(property.id) ? "bg-rose-500 text-white" : "bg-white text-brand-700 shadow-soft"
                    }`}
                    aria-label="Toggle favorite"
                  >
                    <FaHeart />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 rounded-[28px] bg-slate-50 p-4 text-sm text-slate-700 sm:grid-cols-3">
              <div>
                <p className="surface-label">Bedrooms</p>
                <p className="mt-2 text-xl font-semibold text-ink">{property.bedrooms || 0}</p>
              </div>
              <div>
                <p className="surface-label">Bathrooms</p>
                <p className="mt-2 text-xl font-semibold text-ink">{property.bathrooms || 0}</p>
              </div>
              <div>
                <p className="surface-label">Area</p>
                <p className="mt-2 text-xl font-semibold text-ink">{formatArea(property.area)}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
            <section className="panel-card p-6">
              <p className="surface-label">Overview</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">Property description</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{property.description}</p>
              {property.rejectedReason && (
                <div className="mt-5 rounded-[24px] bg-rose-50 px-4 py-4 text-sm text-rose-700">
                  <p className="font-semibold">Moderation note</p>
                  <p className="mt-1">{property.rejectedReason}</p>
                </div>
              )}
            </section>

            <section className="panel-card p-6">
              <p className="surface-label">Amenities</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">Comfort and convenience highlights</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {amenities.map((item) => (
                  <div key={item} className="rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="panel-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="surface-label">Location</p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">Google map section</h2>
                <p className="mt-2 text-sm text-slate-600">{property.mapQuery}</p>
              </div>
              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Please share the exact location for ${property.title}`)}`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                <FaWhatsapp />
                Ask on WhatsApp
              </a>
            </div>
            <iframe title="Property location" src={mapSrc} className="mt-5 h-[320px] w-full rounded-[28px] border-0" loading="lazy" />
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.mapQuery)}`}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary mt-4"
            >
              <FaMapMarkedAlt />
              Open in Google Maps
            </a>
          </section>

          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="surface-label">Similar properties</p>
                <h2 className="section-heading mt-2 text-4xl">Homes related by location or property type</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-5 xl:grid-cols-3">
              {similar.length === 0 ? (
                <div className="panel-card col-span-full p-8 text-center text-sm text-slate-600">
                  Similar properties will appear here when we have enough related listings in the same area or property type.
                </div>
              ) : (
                similar.map((item) => (
                  <PropertyCard
                    key={item.id}
                    property={item}
                    onSave={handleFavoriteToggle}
                    favoriteActive={favoriteIds.includes(item.id)}
                  />
                ))
              )}
            </div>
          </section>
        </section>

        <aside className="space-y-6">
          <div className="panel-card p-6">
            <p className="surface-label">Agent details</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">{property.agent?.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{property.agent?.agencyName || "Mahadev Property"}</p>
            <div className="mt-5 grid gap-3 rounded-[24px] bg-slate-50 p-4 text-sm text-slate-700">
              <div>
                <p className="surface-label">Phone</p>
                <p className="mt-1 font-medium">{property.agent?.phone}</p>
              </div>
              <div>
                <p className="surface-label">Email</p>
                <p className="mt-1 font-medium">{property.agent?.email}</p>
              </div>
            </div>
          </div>

          <ContactAgentForm property={property} />
        </aside>
      </div>
    </>
  );
};

export default PropertyDetailPage;
