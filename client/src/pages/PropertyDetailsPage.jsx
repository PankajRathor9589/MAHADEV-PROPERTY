import {
  Bath,
  BedDouble,
  Car,
  Droplets,
  IndianRupee,
  Lightbulb,
  MapPin,
  MessageCircle,
  Phone,
  Route,
  Ruler,
  Waypoints
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ImageGallerySlider from "../components/ImageGallerySlider.jsx";
import { fetchPropertyById, submitInquiry } from "../services/api.js";

const fallbackPhone = import.meta.env.VITE_DEFAULT_CONTACT_PHONE || "919876543210";
const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const initialInquiry = {
  buyerName: "",
  buyerPhone: "",
  buyerEmail: "",
  message: ""
};

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [inquiry, setInquiry] = useState(initialInquiry);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchPropertyById(id);
        setProperty(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const mapEmbedUrl = useMemo(() => {
    if (!property) {
      return "";
    }

    if (property.location?.mapPinUrl) {
      return property.location.mapPinUrl;
    }

    const latitude = property.location?.latitude;
    const longitude = property.location?.longitude;

    if (!latitude || !longitude) {
      return "";
    }

    if (googleMapsKey) {
      return `https://www.google.com/maps/embed/v1/view?key=${googleMapsKey}&center=${latitude},${longitude}&zoom=15`;
    }

    return `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
  }, [property]);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading property details...</p>;
  }

  if (error) {
    return <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>;
  }

  if (!property) {
    return <p className="text-sm text-slate-500">Property not found.</p>;
  }

  const sellerPhone = property.contactPhone || property.seller?.phone || fallbackPhone;
  const whatsappMessage = encodeURIComponent(`Hi, I am interested in ${property.title}.`);
  const mapLink = property.location?.latitude && property.location?.longitude
    ? `https://www.google.com/maps/search/?api=1&query=${property.location.latitude},${property.location.longitude}`
    : property.location?.mapPinUrl || "https://maps.google.com";

  const handleInquiryChange = (event) => {
    const { name, value } = event.target;
    setInquiry((prev) => ({ ...prev, [name]: value }));
  };

  const handleInquirySubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setSuccess("");
      setError("");
      await submitInquiry(property._id, inquiry);
      setInquiry(initialInquiry);
      setSuccess("Inquiry sent successfully. Seller will contact you soon.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="card space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{property.title}</h1>
            <p className="mt-1 inline-flex items-center gap-1 text-sm text-slate-600">
              <MapPin size={14} />
              {property.location?.address}, {property.location?.locality}, {property.location?.city}
            </p>
          </div>
          {property.isSold && (
            <span className="rounded-full bg-rose-100 px-4 py-1 text-sm font-semibold text-rose-700">Sold</span>
          )}
        </div>

        <ImageGallerySlider images={property.images} title={property.title} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Price</h2>
            <p className="mt-1 inline-flex items-center gap-1 text-2xl font-bold text-brand-700">
              <IndianRupee size={22} />
              {Number(property.price || 0).toLocaleString("en-IN")}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">Property Details</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <p className="inline-flex items-center gap-2 rounded-lg bg-slate-100 p-3 text-sm text-slate-700">
                <Ruler size={16} /> {property.areaSqFt} sq ft
              </p>
              <p className="inline-flex items-center gap-2 rounded-lg bg-slate-100 p-3 text-sm text-slate-700">
                <BedDouble size={16} /> Bedrooms: {property.features?.bedrooms ?? 0}
              </p>
              <p className="inline-flex items-center gap-2 rounded-lg bg-slate-100 p-3 text-sm text-slate-700">
                <Bath size={16} /> Bathrooms: {property.features?.bathrooms ?? 0}
              </p>
              <p className="inline-flex items-center gap-2 rounded-lg bg-slate-100 p-3 text-sm text-slate-700">
                <Car size={16} /> Parking: {property.features?.parking ? "Yes" : "No"}
              </p>
              <p className="inline-flex items-center gap-2 rounded-lg bg-slate-100 p-3 text-sm text-slate-700">
                <Droplets size={16} /> Water: {property.features?.waterSupply ? "Yes" : "No"}
              </p>
              <p className="inline-flex items-center gap-2 rounded-lg bg-slate-100 p-3 text-sm text-slate-700">
                <Lightbulb size={16} /> Electricity: {property.features?.electricity ? "Yes" : "No"}
              </p>
              <p className="inline-flex items-center gap-2 rounded-lg bg-slate-100 p-3 text-sm text-slate-700">
                <Route size={16} /> Road Access: {property.features?.roadAccess ? "Yes" : "No"}
              </p>
              <p className="inline-flex items-center gap-2 rounded-lg bg-slate-100 p-3 text-sm text-slate-700">
                <Waypoints size={16} /> Views: {property.views || 0}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">Description</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{property.description}</p>
          </div>

          {property.nearbyPlaces?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Nearby Places</h2>
              <ul className="mt-2 flex flex-wrap gap-2">
                {property.nearbyPlaces.map((place) => (
                  <li key={place} className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-700">
                    {place}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="card space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Contact Seller</h2>
            <a className="btn-primary w-full" href={`tel:${sellerPhone}`}>
              <Phone size={16} /> Contact Seller
            </a>
            <a
              className="btn w-full bg-emerald-500 text-white hover:bg-emerald-600"
              href={`https://wa.me/${sellerPhone}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>

          {mapEmbedUrl && (
            <div className="card space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">Map Location</h2>
              <iframe
                title="Property map"
                src={mapEmbedUrl}
                className="h-64 w-full rounded-xl border border-slate-300"
                loading="lazy"
              />
              <a href={mapLink} target="_blank" rel="noreferrer" className="btn-secondary w-full text-center">
                Open in Google Maps
              </a>
            </div>
          )}

          <form onSubmit={handleInquirySubmit} className="card space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Send Inquiry</h2>
            <input
              className="input-field"
              name="buyerName"
              value={inquiry.buyerName}
              onChange={handleInquiryChange}
              placeholder="Your name"
              required
            />
            <input
              className="input-field"
              name="buyerPhone"
              value={inquiry.buyerPhone}
              onChange={handleInquiryChange}
              placeholder="Phone number"
              required
            />
            <input
              className="input-field"
              type="email"
              name="buyerEmail"
              value={inquiry.buyerEmail}
              onChange={handleInquiryChange}
              placeholder="Email (optional)"
            />
            <textarea
              className="textarea-field"
              name="message"
              value={inquiry.message}
              onChange={handleInquiryChange}
              placeholder="Message"
            />
            <button className="btn-primary" disabled={submitting}>
              {submitting ? "Sending..." : "Send Inquiry"}
            </button>
            {success ? <p className="text-sm text-emerald-700">{success}</p> : null}
          </form>
        </aside>
      </section>
    </div>
  );
};

export default PropertyDetailsPage;
