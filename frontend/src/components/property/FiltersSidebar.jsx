import { FaTimes } from "react-icons/fa";
import { CITIES, PROPERTY_TYPE_OPTIONS } from "../../config/site";

const FiltersSidebar = ({ filters, onChange, onApply, onClear, isOpen, onClose }) => {
  const content = (
    <div className="panel-card h-full p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="surface-label">Filter properties</p>
          <h3 className="mt-1 text-xl font-semibold text-ink">Refine your search</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 lg:hidden"
        >
          <FaTimes />
        </button>
      </div>

      <div className="mt-5 grid gap-4">
        <div className="space-y-2">
          <label className="surface-label">City</label>
          <select className="field" value={filters.city} onChange={(event) => onChange("city", event.target.value)}>
            <option value="">All cities</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="surface-label">Property type</label>
          <select className="field" value={filters.propertyType} onChange={(event) => onChange("propertyType", event.target.value)}>
            {PROPERTY_TYPE_OPTIONS.map((type) => (
              <option key={type} value={type === "All Types" ? "" : type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="space-y-2">
            <label className="surface-label">Min price</label>
            <input
              type="number"
              className="field"
              value={filters.minPrice}
              onChange={(event) => onChange("minPrice", event.target.value)}
              placeholder="2500000"
            />
          </div>
          <div className="space-y-2">
            <label className="surface-label">Max price</label>
            <input
              type="number"
              className="field"
              value={filters.maxPrice}
              onChange={(event) => onChange("maxPrice", event.target.value)}
              placeholder="10000000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="surface-label">Bedrooms</label>
          <select className="field" value={filters.bedrooms} onChange={(event) => onChange("bedrooms", event.target.value)}>
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="surface-label">Search keyword</label>
          <input
            className="field"
            value={filters.search}
            onChange={(event) => onChange("search", event.target.value)}
            placeholder="Locality, tower, landmark"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        <button type="button" className="btn-primary w-full" onClick={onApply}>
          Apply filters
        </button>
        <button type="button" className="btn-secondary w-full" onClick={onClear}>
          Reset
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block lg:w-[320px] lg:shrink-0">{content}</aside>
      {isOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-950/45 px-4 py-6 lg:hidden">
          <div className="mx-auto h-full max-w-md overflow-y-auto">{content}</div>
        </div>
      )}
    </>
  );
};

export default FiltersSidebar;
