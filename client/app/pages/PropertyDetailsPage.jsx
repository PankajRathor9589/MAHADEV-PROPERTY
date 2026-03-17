import { Bath, BedDouble, Heart, Mail, MapPin, Phone, Ruler, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageGallerySlider from "../components/ImageGallerySlider.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  addFavorite,
  fetchPropertyById,
  removeFavorite,
  submitInquiry
} from "../services/api.js";
import {
  formatCurrency,
  formatLocation,
  formatNumber,
  isFeaturedProperty
} from "../utils/format.js";

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, refreshUser } = useAuth();
  const [property, setProperty] = useState(null);
  const [favoriteBusy, setFavoriteBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [inquiry, setInquiry] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const isFavorite = useMemo(
    () => (user?.favorites || []).map(String).includes(String(property?._id || "")),
    [property?._id, user]
  );

  useEffect(() => {
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

  useEffect(() => {
    setInquiry((current) => ({
      ...current,
      name: user?.name || current.name,
      email: user?.email || current.email,
      phone: user?.phone || current.phone
    }));
  }, [user]);

  const mapSrc = useMemo(() => {
    if (!property) {
      return "";
    }

    const latitude = property.location?.coordinates?.lat;
    const longitude = property.location?.coordinates?.lng;

    if (latitude || longitude) {
      return `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
    }

    const query = encodeURIComponent(formatLocation(property.location));
    return query ? `https://www.google.com/maps?q=${query}&output=embed` : "";
  }, [property]);

  const handleInquiryChange = (event) => {
    const { name, value } = event.target;
    setInquiry((current) => ({ ...current, [name]: value }));
  };

  const handleToggleFavorite = async () => {
    if (!property) {
      return;
    }

    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/properties/${property._id}` } });
      return;
    }

    try {
      setFavoriteBusy(true);

      if (isFavorite) {
        await removeFavorite(property._id);
      } else {
        await addFavorite(property._id);
      }

      await refreshUser();
    } catch (favoriteError) {
      setError(favoriteError.message);
    } finally {
      setFavoriteBusy(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");
      await submitInquiry(id, inquiry);
      setSuccess("Inquiry sent successfully. The owner can now contact you.");
      setInquiry((current) => ({
        ...current,
        message: ""
      }));
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Loading property details...</p>;
  }

  if (error && !property) {
    return <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>;
  }

  if (!property) {
    return <p className="text-sm text-slate-500">Property not found.</p>;
  }

  return (
    <div className="space-y-8">
      <section className="card space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="badge bg-slate-900 text-white">
                {property.listingType === "rent" ? "For Rent" : "For Sale"}
              </span>
              <span className="badge bg-brand-50 text-brand-700">{property.category}</span>
              {isFeaturedProperty(property) ? (
                <span className="badge bg-accent-100 text-accent-600">
                  <Sparkles size={12} />
                  Featured
                </span>
              ) : null}
              {property.approvalStatus !== "approved" ? (
                <span className="badge bg-amber-100 text-amber-700">{property.approvalStatus}</span>
              ) : null}
            </div>

            <div>
              <h1 className="text-4xl font-bold text-slate-900">{property.title}</h1>
              <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-600">
                <MapPin size={15} />
                {formatLocation(property.location)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-secondary" disabled={favoriteBusy} onClick={handleToggleFavorite}>
              <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
              {isFavorite ? "Saved" : "Save"}
            </button>
            <a href={`tel:${property.contactPhone}`} className="btn-primary">
              <Phone size={16} />
              Call Owner
            </a>
          </div>
        </div>

        <ImageGallerySlider images={property.images} title={property.title} />
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <article className="card">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">Price</p>
                <h2 className="mt-2 text-4xl font-bold text-brand-700">{formatCurrency(property.price)}</h2>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm text-slate-600">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <Ruler size={16} />
                  <p className="mt-2 font-semibold text-slate-900">{formatNumber(property.area)}</p>
                  <p>sq.ft</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <BedDouble size={16} />
                  <p className="mt-2 font-semibold text-slate-900">{property.bedrooms}</p>
                  <p>Bedrooms</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <Bath size={16} />
                  <p className="mt-2 font-semibold text-slate-900">{property.bathrooms}</p>
                  <p>Bathrooms</p>
                </div>
              </div>
            </div>
          </article>

          <article className="card">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">Overview</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Property details</h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">{property.description}</p>

            {property.amenities?.length > 0 ? (
              <div className="mt-6">
                <p className="text-sm font-semibold text-slate-900">Amenities</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {property.amenities.map((amenity) => (
                    <span key={amenity} className="pill bg-brand-50 text-brand-700">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </article>
        </div>

        <div className="space-y-8">
          <article className="card space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">Contact</p>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{property.contactName}</h2>
              {property.postedBy?.name ? <p className="text-sm text-slate-500">Listed by {property.postedBy.name}</p> : null}
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <p className="inline-flex items-center gap-2">
                <Phone size={15} />
                {property.contactPhone}
              </p>
              {property.contactEmail ? (
                <p className="inline-flex items-center gap-2">
                  <Mail size={15} />
                  {property.contactEmail}
                </p>
              ) : null}
            </div>
          </article>

          {mapSrc ? (
            <article className="card space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">Google Maps</p>
              <iframe
                title="Property map"
                src={mapSrc}
                className="h-72 w-full rounded-[24px] border border-slate-200"
                loading="lazy"
              />
            </article>
          ) : null}

          <form className="card space-y-4" onSubmit={handleSubmit}>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">Quick inquiry</p>
            <h2 className="text-2xl font-bold text-slate-900">Talk to the owner</h2>

            <input
              className="input-field"
              name="name"
              value={inquiry.name}
              onChange={handleInquiryChange}
              placeholder="Your name"
              required
            />
            <input
              className="input-field"
              type="email"
              name="email"
              value={inquiry.email}
              onChange={handleInquiryChange}
              placeholder="Email"
            />
            <input
              className="input-field"
              name="phone"
              value={inquiry.phone}
              onChange={handleInquiryChange}
              placeholder="Phone number"
              required
            />
            <textarea
              className="textarea-field"
              name="message"
              value={inquiry.message}
              onChange={handleInquiryChange}
              placeholder="Tell the owner what you are looking for"
            />

            {error ? <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : null}
            {success ? <p className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{success}</p> : null}

            <button className="btn-primary w-full" disabled={submitting}>
              {submitting ? "Sending..." : "Send inquiry"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default PropertyDetailsPage;
