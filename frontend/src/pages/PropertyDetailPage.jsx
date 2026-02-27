import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaMapMarkerAlt, FaPhoneAlt, FaShareAlt, FaWhatsapp } from "react-icons/fa";
import { propertyApi, reviewApi, userApi } from "../api/services";
import { OWNER_PROFILE } from "../config/site";
import DealerCard from "../components/property/DealerCard";
import InquiryForms from "../components/property/InquiryForms";
import PropertyCard from "../components/property/PropertyCard";
import PropertyGallery from "../components/property/PropertyGallery";
import PropertySpecs from "../components/property/PropertySpecs";
import ReviewsSection from "../components/property/ReviewsSection";
import Seo from "../components/ui/Seo";
import { formatArea, formatPrice } from "../utils/format";

const PropertyDetailPage = () => {
  const { slug } = useParams();
  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async (propertyId) => {
    const { data } = await reviewApi.list(propertyId);
    setReviews(data.items || []);
  };

  useEffect(() => {
    const load = async () => {
      const { data } = await propertyApi.bySlug(slug);
      const current = data.item;
      setProperty(current);
      await Promise.all([
        propertyApi.similar(current._id).then((res) => setSimilar(res.data.items || [])),
        fetchReviews(current._id),
        userApi.addRecent(current._id).catch(() => null)
      ]);
    };

    load();
  }, [slug]);

  if (!property) return <div className="p-8 text-center">Loading...</div>;

  const lat = property.location?.coordinates?.lat;
  const lng = property.location?.coordinates?.lng;
  const mapSrc = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  const phone = property.dealer?.phone || OWNER_PROFILE.phoneRaw;
  const whatsapp = property.dealer?.whatsapp || OWNER_PROFILE.whatsappRaw;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = encodeURIComponent(`Property: ${property.title}\nPrice: ${formatPrice(property.price, property.listingType)}\n${shareUrl}`);

  return (
    <>
      <Seo title={property.title} description={property.description} />
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-5">
          <PropertyGallery
            title={property.title}
            images={property.images?.length ? property.images : ["https://placehold.co/1200x700?text=Property"]}
            videos={property.videos || []}
            youtubeUrl={property.youtubeUrl || property.videoTourUrl}
            media={property.media || []}
          />
          <div>
            <p className="text-sm font-semibold text-brand-600">{property.propertyType} - {property.listingType}</p>
            <h1 className="text-3xl font-bold text-slate-900">{property.title}</h1>
            <p className="mt-1 text-2xl font-bold text-slate-900">{formatPrice(property.price, property.listingType)}</p>
            <p className="mt-2 text-sm text-slate-700">
              {property.location.village ? `${property.location.village}, ` : ""}
              {property.location.tehsil}, {property.location.district} | {formatArea(property.areaValue || property.areaSqft, property.areaUnit || "sqft")} | {property.landStatus}
            </p>
            <p className="mt-2 text-slate-700">{property.description}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              <a href={`tel:${phone}`} className="btn-primary"><FaPhoneAlt /> Call Now</a>
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="btn-outline"><FaWhatsapp /> WhatsApp Inquiry</a>
              <a href={`https://wa.me/${whatsapp}?text=${shareText}`} target="_blank" rel="noreferrer" className="btn-outline"><FaShareAlt /> Share</a>
            </div>
          </div>

          <PropertySpecs property={property} />

          <section className="card">
            <h2 className="text-xl font-bold">Highlights</h2>
            <ul className="mt-2 grid list-disc gap-1 pl-5 text-sm text-slate-700 md:grid-cols-2">
              {property.highlights?.map((h) => <li key={h}>{h}</li>)}
            </ul>
          </section>

          <section className="card">
            <h2 className="text-xl font-bold">Nearby Places</h2>
            <ul className="mt-2 grid list-disc gap-1 pl-5 text-sm text-slate-700 md:grid-cols-2">
              {property.nearbyPlaces?.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </section>

          {property.floorPlanImage && (
            <section className="card">
              <h2 className="text-xl font-bold">Floor Plan</h2>
              <img src={property.floorPlanImage} alt="Floor plan" className="mt-3 h-72 w-full rounded-xl object-cover" loading="lazy" />
            </section>
          )}

          {property.videoTourUrl && (
            <section className="card">
              <h2 className="text-xl font-bold">Video Tour</h2>
              <a href={property.videoTourUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-brand-600">Open video tour</a>
            </section>
          )}

          <section className="card space-y-3">
            <h2 className="text-xl font-bold">Location</h2>
            <p className="text-sm text-slate-700">
              {property.location.address}, {property.location.locality}, {property.location.city} - {property.location.pincode}
            </p>
            <p className="text-xs text-slate-600">
              District: {property.location.district} | Tehsil: {property.location.tehsil} | Village: {property.location.village || "-"}
            </p>
            <iframe title="Google Map" src={mapSrc} className="h-72 w-full rounded-xl border-0" loading="lazy" />
            <a className="btn-outline" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}><FaMapMarkerAlt /> Get Directions</a>
          </section>

          <InquiryForms propertyId={property._id} />
          <ReviewsSection propertyId={property._id} reviews={reviews} refresh={() => fetchReviews(property._id)} />

          <section>
            <h2 className="section-title">Similar Properties</h2>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              {similar.map((item) => <PropertyCard key={item._id} item={item} compact />)}
            </div>
          </section>
        </div>
        <DealerCard dealer={property.dealer} />
      </div>
    </>
  );
};

export default PropertyDetailPage;
