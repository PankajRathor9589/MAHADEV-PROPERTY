import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard.jsx";
import { COMPANY_INFO, mergeWithDemoProperties } from "../data/siteContent.js";
import { fetchProperties } from "../services/api.js";

const initialFilters = {
  search: "",
  city: "",
  listingType: "",
  category: "",
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

    const matchesCategory = (property) => {
      if (!filters.category) {
        return true;
      }

      if (filters.category === "Apartment") {
        return property.category === "Apartment";
      }

      if (filters.category === "House") {
        return ["House", "Villa"].includes(property.category);
      }

      return property.category === filters.category;
    };

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

      if (filters.city && !haystack.includes(filters.city.toLowerCase())) {
        return false;
      }

      if (filters.listingType && property.listingType !== filters.listingType) {
        return false;
      }

      if (!matchesCategory(property)) {
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
        <div className="card surface-grid">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-200/80">Property Listings</p>
              <h1 className="mt-2 font-display text-4xl font-semibold text-white">Available properties and plotting opportunities in {COMPANY_INFO.city}, {COMPANY_INFO.state}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                Explore verified plots, homes, commercial spaces, and premium addresses curated by Sagar Infra alongside its construction and infrastructure expertise.
              </p>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/75">
              {filteredProperties.length} opportunities found
            </div>
          </div>

          <form className="mt-6 grid gap-3 lg:grid-cols-4" onSubmit={applyFilters}>
            <input
              className="input-field"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search location, property, or landmark"
            />
            <input className="input-field" name="city" value={filters.city} onChange={handleChange} placeholder="Location" />
            <select className="input-field" name="listingType" value={filters.listingType} onChange={handleChange}>
              <option value="">Buy or rent</option>
              <option value="sale">Buy</option>
              <option value="rent">Rent</option>
            </select>
            <select className="input-field" name="category" value={filters.category} onChange={handleChange}>
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

            <div className="flex flex-wrap gap-3">
              <button className="btn-primary">
                <Search size={16} />
                Apply Filters
              </button>
              <button type="button" className="btn-secondary" onClick={clearFilters}>
                <SlidersHorizontal size={16} />
                Reset
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="section-shell">
        {loading ? <p className="text-sm text-white/60">Loading properties...</p> : null}

        {!loading && (
          <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visibleProperties.length > 0 ? (
                visibleProperties.map((property) => <PropertyCard key={property._id} property={property} />)
              ) : (
                <div className="card col-span-full text-center text-sm text-white/60">
                  No properties matched your search.
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={safePage <= 1}
                  onClick={() => movePage(safePage - 1)}
                >
                  Previous
                </button>
                <span className="text-sm text-white/65">
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
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default PropertiesPage;
