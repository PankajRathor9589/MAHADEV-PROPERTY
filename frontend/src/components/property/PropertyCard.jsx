import { FaBalanceScale, FaBath, FaBed, FaHeart, FaMapMarkerAlt, FaRulerCombined, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CONTACT } from "../../config/site";
import { useApp } from "../../context/AppContext";
import { formatArea, formatPrice } from "../../utils/format";

const statusClass = {
  approved: "status-approved",
  pending: "status-pending",
  rejected: "status-rejected"
};

const PropertyCard = ({ property, onSave, favoriteActive = false, showFavoriteAction = true }) => {
  const { compareIds, compareLimit, toggleCompare } = useApp();
  const heroImage = property.images?.[0]?.url || "https://placehold.co/1200x800?text=Property";
  const whatsapp = property.agent?.whatsapp || CONTACT.whatsappRaw;
  const isCompared = compareIds.includes(property.id);
  const compareDisabled = compareIds.length >= compareLimit && !isCompared;

  return (
    <article className="group overflow-hidden rounded-[30px] border border-white/70 bg-white/88 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_-32px_rgba(16,32,51,0.42)]">
      <div className="relative overflow-hidden">
        <img
          src={heroImage}
          alt={property.title}
          className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className={`status-badge ${statusClass[property.status] || "status-approved"}`}>{property.status}</span>
          <div className="flex items-center gap-2">
            {showFavoriteAction && onSave && (
              <button
                type="button"
                onClick={() => onSave(property.id, favoriteActive)}
                className={`grid h-11 w-11 place-items-center rounded-full shadow-soft transition ${
                  favoriteActive ? "bg-rose-500 text-white" : "bg-white/90 text-brand-700 hover:bg-white"
                }`}
                aria-label={favoriteActive ? "Remove from favorites" : "Save property"}
              >
                <FaHeart />
              </button>
            )}
            <button
              type="button"
              onClick={() => toggleCompare(property.id)}
              disabled={compareDisabled}
              className={`grid h-11 w-11 place-items-center rounded-full shadow-soft transition ${
                isCompared
                  ? "bg-ink text-white"
                  : "bg-white/90 text-brand-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              }`}
              aria-label={isCompared ? "Remove from compare" : "Add to compare"}
            >
              <FaBalanceScale />
            </button>
          </div>
        </div>
        <div className="absolute inset-x-4 bottom-4 rounded-full bg-white/92 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-700 shadow-soft">
          {property.propertyType}
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-xl font-semibold text-ink">{property.title}</h3>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <FaMapMarkerAlt className="shrink-0 text-brand-500" />
              <span className="truncate">{property.location}</span>
            </p>
          </div>
          <p className="shrink-0 text-lg font-bold text-ink">{formatPrice(property.price)}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-[24px] bg-slate-50 p-3 text-sm text-slate-700">
          <div className="flex items-center gap-2">
            <FaBed className="text-brand-500" />
            {property.bedrooms || 0}
          </div>
          <div className="flex items-center gap-2">
            <FaBath className="text-brand-500" />
            {property.bathrooms || 0}
          </div>
          <div className="flex items-center gap-2">
            <FaRulerCombined className="text-brand-500" />
            {formatArea(property.area)}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(property.amenities || []).slice(0, 3).map((item) => (
            <span key={item} className="stat-chip">
              {item}
            </span>
          ))}
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Link to={`/properties/${property.id}`} className="btn-primary">
            View details
          </Link>
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi, I am interested in ${property.title}`)}`}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
          >
            <FaWhatsapp />
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;
