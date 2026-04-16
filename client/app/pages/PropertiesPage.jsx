import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import LeadCaptureForm from "../components/LeadCaptureForm.jsx";
import PropertyCard from "../components/PropertyCard.jsx";
import { COMPANY_INFO, mergeWithDemoProperties } from "../data/siteContent.js";
import { fetchProperties } from "../services/api.js";

const initialFilters = {
  search: "",
  location: "",
  type: "",
  minPrice: "",
  maxPrice: "",
  sort: "latest"
};

const pageSize = 6;

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(initialFilters);
  const [liveProperties, setLiveProperties] = useState([]);
  const [loading, setLoading] = useState(true);

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
        const response = await fetchProperties({ limit: 50, sort: "latest" });
        setLiveProperties(response.data || []);
      } catch (error) {
        setLiveProperties([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const allProperties = useMemo(() => mergeWithDemoProperties(liveProperties), [liveProperties]);

  const filteredProperties = useMemo(() => {
    const term = filters.search.trim().toLowerCase();

    const filtered = allProperties.filter((property) => {
      const haystack = [
        property.title,
        property.description,
        property.shortDescription,
        property.category,
        property.location?.address,
        property.location?.city,
        property.location?.state
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (term && !haystack.includes(term)) {
        return false;
      }

      if (filters.location && !haystack.includes(filters.location.toLowerCase())) {
        return false;
      }

      if (filters.type && property.category !== filters.type) {
        return false;
      }

      if (filters.minPrice && Number(property.price) < Number(filters.minPrice)) {
        return false;
      }

      if (filters.maxPrice && Number(property.price) > Number(filters.maxPrice)) {
        return false;
      }

      return true;
    });

    if (filters.sort === "priceAsc") {
      return [...filtered].sort((left, right) => Number(left.price) - Number(right.price));
    }

    if (filters.sort === "priceDesc") {
      return [...filtered].sort((left, right) => Number(right.price) - Number(left.price));
    }

    if (filters.sort === "popular") {
      return [...filtered].sort((left, right) => Number(right.views || 0) - Number(left.views || 0));
    }

    return filtered;
  }, [allProperties, filters]);

  const currentPage = Math.max(1, Number(searchParams.get("page") || 1));
  const totalPages = Math.max(1, Math.ceil(filteredProperties.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const visibleProperties = filteredProperties.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const applyFilters = (event) => {
    event.preventDefault();

    const nextParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (String(value).trim()) {
        nextParams.set(key, value);
      }
    });
    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setSearchParams(new URLSearchParams());
  };

  const movePage = (page) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(page));
    setSearchParams(nextParams);
  };

  return (
    <div className="space-y-8">
      <section className="section-shell">
        <div className="card surface-grid space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600">Property Listings</p>
              <h1 className="section-title mt-2">Buy property in {COMPANY_INFO.city}, {COMPANY_INFO.state}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-500">
                Filter listings by price, location, and property type to find the right plot, home, or commercial
                space faster.
              </p>
            </div>
            <div className="rounded-full border border-brand-200 bg-brand-50 px-5 py-3 text-sm font-semibold text-brand-700">
              {filteredProperties.length} opportunities found
            </div>
          </div>

          <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-4" onSubmit={applyFilters}>
            <input
              className="input-field"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search location, property, or landmark"
            />
            <input className="input-field" name="location" value={filters.location} onChange={handleChange} placeholder="Location" />
            <select className="input-field" name="type" value={filters.type} onChange={handleChange}>
              <option value="">All types</option>
              <option value="Plot">Plot</option>
              <option value="House">House</option>
              <option value="Apartment">Flat</option>
              <option value="Commercial">Commercial</option>
              <option value="Villa">Villa</option>
            </select>
            <input
              className="input-field"
              type="number"
              min="0"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleChange}
              placeholder="Min price"
            />
            <input
              className="input-field"
              type="number"
              min="0"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="Max price"
            />
            <select className="input-field" name="sort" value={filters.sort} onChange={handleChange}>
              <option value="latest">Latest</option>
              <option value="priceAsc">Price low to high</option>
              <option value="priceDesc">Price high to low</option>
              <option value="popular">Most viewed</option>
            </select>

            <div className="flex flex-col gap-3 md:col-span-2 md:flex-row xl:col-span-2">
              <button className="btn-primary w-full md:w-auto">
                <Search size={16} />
                Apply Filters
              </button>
              <button type="button" className="btn-secondary w-full md:w-auto" onClick={clearFilters}>
                <SlidersHorizontal size={16} />
                Reset
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="section-shell">
        {loading ? <p className="text-sm text-ink-500">Loading properties...</p> : null}

        {!loading ? (
          <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {visibleProperties.length > 0 ? (
                visibleProperties.map((property) => <PropertyCard key={property._id} property={property} />)
              ) : (
                <div className="card col-span-full text-center text-sm text-ink-500">No properties matched your filters.</div>
              )}
            </div>

            {totalPages > 1 ? (
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={safePage <= 1}
                  onClick={() => movePage(safePage - 1)}
                >
                  Previous
                </button>
                <span className="text-sm text-ink-500">
                  Page {safePage} of {totalPages}
                </span>
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={safePage >= totalPages}
                  onClick={() => movePage(safePage + 1)}
                >
                  Next
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </section>

      <section className="section-shell">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="card surface-grid">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600">Buy / Sell</p>
            <h2 className="section-title mt-2">Need help buying or want to sell a property in Sagar?</h2>
            <p className="mt-4 text-sm leading-8 text-ink-500">
              Use the filters above to browse available properties. If you want to sell, share your location and
              requirement so Sagar Infra can follow up with the right next steps.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
                <p className="text-lg font-semibold text-ink-700">Buy Support</p>
                <p className="mt-2 text-sm leading-7 text-ink-500">
                  Filter by price, location, and property type to shortlist the right opportunity faster.
                </p>
              </div>
              <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
                <p className="text-lg font-semibold text-ink-700">Sell Support</p>
                <p className="mt-2 text-sm leading-7 text-ink-500">
                  Share your plot, house, or commercial property details and the team will contact you directly.
                </p>
              </div>
            </div>
          </div>

          <LeadCaptureForm
            title="Sell Property with Sagar Infra"
            description="Submit your name, phone, location, and property requirement to start the selling process."
            submitLabel="Start Sell Request"
            successMessage="Sell request received. Sagar Infra will contact you soon."
            source="sell"
            showEmail
            showLocation
            requirementSeed="I want to sell my property through Sagar Infra."
          />
        </div>
      </section>
    </div>
  );
};

export default PropertiesPage;
