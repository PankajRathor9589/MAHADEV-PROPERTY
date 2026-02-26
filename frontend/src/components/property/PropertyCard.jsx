import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/format";

const PropertyCard = ({ item, onFavorite, onCompare, compact = false }) => (
  <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-card">
    <img
      src={item.images?.[0] || "https://placehold.co/800x450?text=Property"}
      alt={item.title}
      className={`w-full object-cover ${compact ? "h-40" : "h-52"}`}
      loading="lazy"
    />
    <div className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-brand-600">{item.propertyType}</p>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{item.availabilityStatus}</span>
      </div>
      <h3 className="line-clamp-2 text-base font-semibold text-slate-900">{item.title}</h3>
      <p className="text-xl font-bold text-slate-900">{formatPrice(item.price, item.listingType)}</p>
      <p className="text-sm text-slate-600">{item.location?.locality}, {item.location?.city}</p>
      <div className="flex flex-wrap gap-2 text-xs text-slate-700">
        <span>{item.areaSqft} sqft</span>
        {item.bedrooms > 0 && <span>{item.bedrooms} BHK</span>}
        <span>{item.bathrooms} Bath</span>
      </div>
      <div className="grid gap-2 sm:flex sm:flex-wrap">
        <Link to={`/properties/${item.slug}`} className="btn-primary w-full sm:w-auto">View Details</Link>
        {onFavorite && <button onClick={() => onFavorite(item._id)} className="btn-outline w-full sm:w-auto">Save</button>}
        {onCompare && <button onClick={() => onCompare(item._id)} className="btn-outline w-full sm:w-auto">Compare</button>}
      </div>
    </div>
  </article>
);

export default PropertyCard;
