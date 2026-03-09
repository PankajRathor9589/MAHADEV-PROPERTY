import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard.jsx";
import { fetchProperties } from "../services/api.js";

const initialFilters = {
  search: "",
  city: "",
  locality: "",
  propertyType: "",
  minPrice: "",
  maxPrice: "",
  minArea: "",
  maxArea: "",
  minBedrooms: ""
};

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(initialFilters);
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const nextFilters = { ...initialFilters };
    Object.keys(nextFilters).forEach((key) => {
      if (searchParams.has(key)) {
        nextFilters[key] = searchParams.get(key) || "";
      }
    });
    setFilters(nextFilters);
  }, [searchParams]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const params = { includeSold: false, page: Number(searchParams.get("page") || 1), limit: 12 };
        searchParams.forEach((value, key) => {
          if (key !== "page" && String(value).trim() !== "") {
            params[key] = value;
          }
        });

        const response = await fetchProperties(params);
        setProperties(response.data || []);
        setPagination(response.pagination || { page: 1, pages: 1, total: 0 });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [searchParams]);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some((value) => String(value).trim() !== "");
  }, [filters]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = (event) => {
    event.preventDefault();
    const nextParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (String(value).trim() !== "") {
        nextParams.set(key, value);
      }
    });

    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setSearchParams(new URLSearchParams());
  };

  const movePage = (nextPage) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(nextPage));
    setSearchParams(nextParams);
  };

  return (
    <div className="space-y-6">
      <section className="card bg-gradient-to-r from-cyan-50 to-white">
        <h1 className="text-3xl font-bold text-slate-900">Property Listings</h1>
        <p className="mt-2 text-sm text-slate-600">
          Search by location, price, type, area and bedrooms to find the right property quickly.
        </p>

        <form onSubmit={applyFilters} className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <input name="search" value={filters.search} onChange={handleChange} className="input-field" placeholder="Search keyword" />
          <input name="city" value={filters.city} onChange={handleChange} className="input-field" placeholder="City" />
          <input name="locality" value={filters.locality} onChange={handleChange} className="input-field" placeholder="Locality" />
          <select name="propertyType" value={filters.propertyType} onChange={handleChange} className="input-field">
            <option value="">All property types</option>
            <option value="Plot">Plot</option>
            <option value="House">House</option>
            <option value="Flat">Flat</option>
            <option value="Commercial">Commercial</option>
            <option value="Agricultural Land">Agricultural Land</option>
          </select>
          <input name="minPrice" value={filters.minPrice} onChange={handleChange} className="input-field" type="number" min="0" placeholder="Min price" />
          <input name="maxPrice" value={filters.maxPrice} onChange={handleChange} className="input-field" type="number" min="0" placeholder="Max price" />
          <input name="minArea" value={filters.minArea} onChange={handleChange} className="input-field" type="number" min="0" placeholder="Min area sq ft" />
          <input name="maxArea" value={filters.maxArea} onChange={handleChange} className="input-field" type="number" min="0" placeholder="Max area sq ft" />
          <input name="minBedrooms" value={filters.minBedrooms} onChange={handleChange} className="input-field" type="number" min="0" placeholder="Min bedrooms" />

          <div className="flex items-center gap-2">
            <button type="submit" className="btn-primary">
              Apply Filters
            </button>
            {hasActiveFilters && (
              <button type="button" className="btn-secondary" onClick={resetFilters}>
                Reset
              </button>
            )}
          </div>
        </form>
      </section>

      {loading ? <p className="text-sm text-slate-500">Loading listings...</p> : null}
      {error ? <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

      {!loading && !error && (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {properties.length > 0 ? (
              properties.map((property) => <PropertyCard key={property._id} property={property} />)
            ) : (
              <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
                No properties matched your filters.
              </div>
            )}
          </div>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                className="btn-secondary"
                disabled={pagination.page <= 1}
                onClick={() => movePage(pagination.page - 1)}
              >
                Previous
              </button>
              <span className="text-sm text-slate-600">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                className="btn-secondary"
                disabled={pagination.page >= pagination.pages}
                onClick={() => movePage(pagination.page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PropertiesPage;
