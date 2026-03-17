import { Bath, BedDouble, Heart, MapPin, Ruler, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { resolveImageUrl } from "../services/api.js";
import { formatCurrency, formatNumber, isFeaturedProperty } from "../utils/format.js";

const statusStyles = {
  approved: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-rose-100 text-rose-700"
};

const PropertyCard = ({
  property,
  isFavorite = false,
  onToggleFavorite,
  showOwner = false,
  showStatus = false,
  favoriteBusy = false
}) => {
  const imageUrl = resolveImageUrl(property.images?.[0]?.url);

  const handleFavoriteClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onToggleFavorite?.(property);
  };

  return (
    <Link
      to={`/properties/${property._id}`}
      className="group relative overflow-hidden rounded-[28px] border border-white/70 bg-white/85 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-panel"
    >
      <div className="relative h-56 overflow-hidden bg-slate-200">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={property.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-200 text-sm text-slate-500">
            No image available
          </div>
        )}

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="badge bg-slate-900/75 text-white backdrop-blur">
            {property.listingType === "rent" ? "For Rent" : "For Sale"}
          </span>
          {isFeaturedProperty(property) && (
            <span className="badge bg-accent-100 text-accent-600">
              <Sparkles size={12} />
              Featured
            </span>
          )}
          {showStatus && (
            <span className={`badge ${statusStyles[property.approvalStatus] || "bg-slate-100 text-slate-700"}`}>
              {property.approvalStatus}
            </span>
          )}
        </div>

        {onToggleFavorite && (
          <button
            type="button"
            onClick={handleFavoriteClick}
            className={`absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/70 backdrop-blur transition ${
              isFavorite ? "bg-rose-500 text-white" : "bg-white/80 text-slate-700 hover:bg-white"
            }`}
            disabled={favoriteBusy}
            aria-label={isFavorite ? "Remove favorite" : "Save favorite"}
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        )}
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                {property.category}
              </p>
              <h3 className="mt-1 text-xl font-bold text-slate-900">{property.title}</h3>
            </div>
            <p className="text-lg font-bold text-brand-700">{formatCurrency(property.price)}</p>
          </div>

          <p className="inline-flex items-center gap-2 text-sm text-slate-600">
            <MapPin size={15} />
            {[property.location?.city, property.location?.state].filter(Boolean).join(", ")}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2">
            <Ruler size={15} />
            {formatNumber(property.area)} sq.ft
          </span>
          <span className="inline-flex items-center gap-2">
            <BedDouble size={15} />
            {property.bedrooms}
          </span>
          <span className="inline-flex items-center gap-2">
            <Bath size={15} />
            {property.bathrooms}
          </span>
        </div>

        {showOwner && property.postedBy?.name && (
          <p className="text-sm text-slate-500">Listed by {property.postedBy.name}</p>
        )}
      </div>
    </Link>
  );
};

export default PropertyCard;
