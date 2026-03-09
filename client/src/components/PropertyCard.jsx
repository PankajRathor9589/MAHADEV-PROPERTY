import { BedDouble, Bath, IndianRupee, MapPin, Ruler } from "lucide-react";
import { Link } from "react-router-dom";
import { resolveImageUrl } from "../services/api.js";

const PropertyCard = ({ property }) => {
  const image = resolveImageUrl(property.images?.[0]?.url);

  return (
    <Link
      to={`/properties/${property._id}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-52 overflow-hidden bg-slate-200">
        {image ? (
          <img
            src={image}
            alt={property.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500">No image</div>
        )}

        <div className="absolute left-3 top-3 flex gap-2">
          {property.isSold && (
            <span className="rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white">Sold</span>
          )}
          {property.listingStatus && property.listingStatus !== "approved" && (
            <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
              {property.listingStatus}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="truncate text-lg font-semibold text-slate-900">{property.title}</h3>
          <p className="mt-1 inline-flex items-center gap-1 text-sm text-slate-500">
            <MapPin size={14} />
            {property.location?.locality}, {property.location?.city}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-slate-700">
          <span className="inline-flex items-center gap-1 font-semibold text-brand-700">
            <IndianRupee size={16} />
            {Number(property.price || 0).toLocaleString("en-IN")}
          </span>
          <span className="inline-flex items-center gap-1">
            <Ruler size={16} />
            {property.areaSqFt} sq ft
          </span>
          <span className="inline-flex items-center gap-1">
            <BedDouble size={16} />
            {property.features?.bedrooms ?? 0}
          </span>
          <span className="inline-flex items-center gap-1">
            <Bath size={16} />
            {property.features?.bathrooms ?? 0}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
