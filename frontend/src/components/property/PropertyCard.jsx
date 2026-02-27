import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaPhoneAlt, FaShareAlt, FaWhatsapp } from "react-icons/fa";
import { OWNER_PROFILE } from "../../config/site";
import { formatArea, formatPrice } from "../../utils/format";

const PropertyCard = ({ item, onFavorite, onCompare, compact = false }) => {
  const coords = item.location?.coordinates;
  const mapLink = coords?.lat && coords?.lng
    ? `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`
    : null;
  const phone = item.dealer?.phone || OWNER_PROFILE.phoneRaw;
  const whatsapp = item.dealer?.whatsapp || OWNER_PROFILE.whatsappRaw;
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/properties/${item.slug}`
    : `/properties/${item.slug}`;
  const shareText = encodeURIComponent(`Property: ${item.title}\nPrice: ${formatPrice(item.price, item.listingType)}\n${shareUrl}`);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-card">
      <img
        src={item.images?.[0] || "https://placehold.co/800x450?text=Property"}
        alt={item.title}
        className={`w-full object-cover ${compact ? "h-40" : "h-52"}`}
        loading="lazy"
      />
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-brand-600">{item.propertyType}</p>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{item.availabilityStatus}</span>
        </div>
        <h3 className="line-clamp-2 text-base font-semibold text-slate-900">{item.title}</h3>
        <p className="text-xl font-bold text-slate-900">{formatPrice(item.price, item.listingType)}</p>
        <p className="text-sm text-slate-600">
          {item.location?.village ? `${item.location.village}, ` : ""}
          {item.location?.tehsil}, {item.location?.district}
        </p>
        <div className="flex flex-wrap gap-2 text-xs text-slate-700">
          <span>{formatArea(item.areaValue || item.areaSqft, item.areaUnit || "sqft")}</span>
          {item.bedrooms > 0 && <span>{item.bedrooms} BHK</span>}
          {item.bathrooms > 0 && <span>{item.bathrooms} Bath</span>}
          {item.landStatus && <span>{item.landStatus}</span>}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Link to={`/properties/${item.slug}`} className="btn-primary">View Details</Link>
          <a href={`tel:${phone}`} className="btn-outline"><FaPhoneAlt /> Call</a>
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="btn-outline"><FaWhatsapp /> WhatsApp</a>
          <a href={`https://wa.me/${whatsapp}?text=${shareText}`} target="_blank" rel="noreferrer" className="btn-outline"><FaShareAlt /> Share</a>
          {mapLink && <a href={mapLink} target="_blank" rel="noreferrer" className="btn-outline col-span-2"><FaMapMarkerAlt /> Map Location</a>}
          {onFavorite && <button onClick={() => onFavorite(item._id)} className="btn-outline">Save</button>}
          {onCompare && <button onClick={() => onCompare(item._id)} className="btn-outline">Compare</button>}
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;
