import { AREA_UNITS, LAND_STATUS_OPTIONS, PROPERTY_TYPES, SERVICE_AREA } from "../../config/site";

const PropertyFilters = ({ filters, setFilters, onSearch, onReset, locationTree = [] }) => {
  const update = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const districts = locationTree.length ? locationTree.map((item) => item.district) : SERVICE_AREA.divisionDistricts;
  const selectedDistrict = locationTree.find((item) => item.district === filters.district);
  const tehsilOptions = selectedDistrict?.tehsils || [];
  const selectedTehsil = tehsilOptions.find((item) => item.name === filters.tehsil);
  const villageOptions = selectedTehsil?.villages || [];

  return (
    <div className="card space-y-3">
      <h3 className="text-lg font-bold">Search & Filters</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <input className="input" placeholder="Location keyword" value={filters.location || ""} onChange={(e) => update("location", e.target.value)} />
        <select className="input" value={filters.district || ""} onChange={(e) => {
          update("district", e.target.value);
          update("tehsil", "");
          update("village", "");
        }}>
          <option value="">District</option>
          {districts.map((district) => <option key={district}>{district}</option>)}
        </select>
        <select className="input" value={filters.tehsil || ""} onChange={(e) => {
          update("tehsil", e.target.value);
          update("village", "");
        }}>
          <option value="">Tehsil</option>
          {tehsilOptions.map((tehsil) => <option key={tehsil.name}>{tehsil.name}</option>)}
        </select>
        <select className="input" value={filters.village || ""} onChange={(e) => update("village", e.target.value)}>
          <option value="">Village</option>
          {villageOptions.map((village) => <option key={village}>{village}</option>)}
        </select>
        <select className="input" value={filters.propertyType || ""} onChange={(e) => update("propertyType", e.target.value)}>
          <option value="">Property Type</option>
          {PROPERTY_TYPES.map((type) => <option key={type}>{type}</option>)}
        </select>
        <select className="input" value={filters.landStatus || ""} onChange={(e) => update("landStatus", e.target.value)}>
          <option value="">Ready/Open Land</option>
          {LAND_STATUS_OPTIONS.map((status) => <option key={status}>{status}</option>)}
        </select>
        <select className="input" value={filters.availabilityStatus || ""} onChange={(e) => update("availabilityStatus", e.target.value)}>
          <option value="">Status</option><option>Available</option><option>Sold</option><option>Rented</option>
        </select>
        <input className="input" type="number" placeholder="Min Price" value={filters.minPrice || ""} onChange={(e) => update("minPrice", e.target.value)} />
        <input className="input" type="number" placeholder="Max Price" value={filters.maxPrice || ""} onChange={(e) => update("maxPrice", e.target.value)} />
        <input className="input" type="number" placeholder="Min Size" value={filters.minSize || ""} onChange={(e) => update("minSize", e.target.value)} />
        <input className="input" type="number" placeholder="Max Size" value={filters.maxSize || ""} onChange={(e) => update("maxSize", e.target.value)} />
        <select className="input" value={filters.sizeUnit || "sqft"} onChange={(e) => update("sizeUnit", e.target.value)}>
          {AREA_UNITS.map((unit) => <option key={unit} value={unit}>{unit === "acre" ? "Acres" : "Sq.ft"}</option>)}
        </select>
        <input className="input" type="number" placeholder="BHK" value={filters.bhk || ""} onChange={(e) => update("bhk", e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={onSearch} className="btn-primary">Apply</button>
        <button onClick={onReset} className="btn-outline">Reset</button>
      </div>
    </div>
  );
};

export default PropertyFilters;
