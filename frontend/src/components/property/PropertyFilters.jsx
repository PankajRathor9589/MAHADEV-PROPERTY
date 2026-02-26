const PropertyFilters = ({ filters, setFilters, onSearch, onReset }) => {
  const update = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const propertyTypes = [
    "Apartment",
    "Independent House",
    "Luxury Villa",
    "Commercial Shop",
    "Farmhouse",
    "Budget Home",
    "Plot",
    "Commercial",
    "Agricultural Land"
  ];

  return (
    <div className="card space-y-3">
      <h3 className="text-lg font-bold">Search & Filters</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input className="input" placeholder="City" value={filters.city || ""} onChange={(e) => update("city", e.target.value)} />
        <input className="input" placeholder="Locality" value={filters.locality || ""} onChange={(e) => update("locality", e.target.value)} />
        <select className="input" value={filters.propertyType || ""} onChange={(e) => update("propertyType", e.target.value)}>
          <option value="">Property Type</option>
          {propertyTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
        <select className="input" value={filters.availabilityStatus || ""} onChange={(e) => update("availabilityStatus", e.target.value)}>
          <option value="">Status</option><option>Available</option><option>Sold</option><option>Rented</option>
        </select>
        <input className="input" type="number" placeholder="Min Price" value={filters.minPrice || ""} onChange={(e) => update("minPrice", e.target.value)} />
        <input className="input" type="number" placeholder="Max Price" value={filters.maxPrice || ""} onChange={(e) => update("maxPrice", e.target.value)} />
        <input className="input" type="number" placeholder="BHK" value={filters.bhk || ""} onChange={(e) => update("bhk", e.target.value)} />
        <input className="input" placeholder="Nearby (e.g. School)" value={filters.nearby || ""} onChange={(e) => update("nearby", e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={onSearch} className="btn-primary">Apply</button>
        <button onClick={onReset} className="btn-outline">Reset</button>
      </div>
    </div>
  );
};

export default PropertyFilters;
