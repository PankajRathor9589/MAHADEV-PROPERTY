const FilterBar = ({ filters, setFilters }) => {
  const update = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-4 grid sm:grid-cols-2 lg:grid-cols-6 gap-3">
      <input placeholder="Location" className="border rounded-lg px-3 py-2" value={filters.location} onChange={(e) => update('location', e.target.value)} />
      <select className="border rounded-lg px-3 py-2" value={filters.propertyType} onChange={(e) => update('propertyType', e.target.value)}>
        <option value="">Type</option><option>Flat</option><option>Plot</option><option>House</option><option>Commercial</option><option>Agricultural Land</option>
      </select>
      <input placeholder="Min Price" type="number" className="border rounded-lg px-3 py-2" value={filters.minPrice} onChange={(e) => update('minPrice', e.target.value)} />
      <input placeholder="Max Price" type="number" className="border rounded-lg px-3 py-2" value={filters.maxPrice} onChange={(e) => update('maxPrice', e.target.value)} />
      <input placeholder="BHK" type="number" className="border rounded-lg px-3 py-2" value={filters.bhk} onChange={(e) => update('bhk', e.target.value)} />
      <select className="border rounded-lg px-3 py-2" value={filters.status} onChange={(e) => update('status', e.target.value)}>
        <option value="">Status</option><option>Available</option><option>Sold</option><option>Rented</option>
      </select>
    </section>
  );
};

export default FilterBar;
