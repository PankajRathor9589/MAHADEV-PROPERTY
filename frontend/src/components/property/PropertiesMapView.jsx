import { FaMapMarkerAlt } from "react-icons/fa";
import { DEFAULT_MAP_QUERY } from "../../config/site";
import { formatPrice } from "../../utils/format";
import { MapResultsSkeleton } from "../ui/Skeletons";

const PropertiesMapView = ({ items, loading, selectedPropertyId, onSelectProperty, fallbackQuery }) => {
  if (loading) {
    return <MapResultsSkeleton />;
  }

  if (!items.length) {
    return (
      <div className="panel-card p-8 text-center">
        <p className="surface-label">Map view</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">No properties match the current filters.</h2>
        <p className="mt-3 text-sm text-slate-600">Adjust the city, budget, or property type to show results on the map.</p>
      </div>
    );
  }

  const selectedProperty = items.find((item) => item.id === selectedPropertyId) || items[0];
  const mapQuery = selectedProperty?.mapQuery || fallbackQuery || DEFAULT_MAP_QUERY;

  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="panel-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="surface-label">Google Maps view</p>
            <h2 className="mt-1 text-2xl font-semibold text-ink">{selectedProperty.title}</h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <FaMapMarkerAlt className="text-brand-500" />
              {selectedProperty.location}
            </p>
          </div>
          <div className="rounded-[22px] bg-slate-50 px-4 py-3 text-right">
            <p className="text-sm font-semibold text-ink">{formatPrice(selectedProperty.price)}</p>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{selectedProperty.propertyType}</p>
          </div>
        </div>
        <iframe
          title="Property map search results"
          src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=13&output=embed`}
          className="mt-4 h-[460px] w-full rounded-[28px] border-0"
          loading="lazy"
        />
      </div>

      <div className="panel-card p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="surface-label">Visible results</p>
            <h2 className="mt-1 text-2xl font-semibold text-ink">{items.length} properties on map</h2>
          </div>
          <p className="text-sm text-slate-500">Select a property to change map focus.</p>
        </div>

        <div className="mt-4 space-y-3">
          {items.map((property) => (
            <button
              key={property.id}
              type="button"
              onClick={() => onSelectProperty(property.id)}
              className={`grid w-full gap-3 rounded-[24px] border p-3 text-left transition sm:grid-cols-[112px_1fr] ${
                property.id === selectedProperty.id
                  ? "border-brand-300 bg-brand-50/70 shadow-soft"
                  : "border-slate-100 bg-white hover:-translate-y-0.5 hover:border-brand-200"
              }`}
            >
              <img
                src={property.images?.[0]?.url}
                alt={property.title}
                className="h-24 w-full rounded-[18px] object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold text-ink">{property.title}</p>
                    <p className="mt-1 truncate text-sm text-slate-600">{property.location}</p>
                  </div>
                  <p className="text-sm font-semibold text-ink">{formatPrice(property.price)}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="stat-chip">{property.city}</span>
                  <span className="stat-chip">{property.bedrooms || 0} bed</span>
                  <span className="stat-chip">{property.area} sq.ft</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertiesMapView;
