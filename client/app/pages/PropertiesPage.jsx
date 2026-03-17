import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { addFavorite, fetchProperties, removeFavorite } from "../services/api.js";

const initialFilters = {
  search: "",
  city: "",
  state: "",
  listingType: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
  sort: "latest"
};

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, refreshUser } = useAuth();
  const [filters, setFilters] = useState(initialFilters);
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [favoriteBusyId, setFavoriteBusyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const favoriteIds = useMemo(
    () => new Set((user?.favorites || []).map((favoriteId) => String(favoriteId))),
    [user]
  );

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

        const params = {
          page: Number(searchParams.get("page") || 1),
          limit: 9
        };

        searchParams.forEach((value, key) => {
          if (key !== "page" && String(value).trim()) {
            params[key] = value;
          }
        });

        const response = await fetchProperties(params);
        setProperties(response.data || []);
        setPagination(response.pagination || { page: 1, pages: 1, total: 0 });
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [searchParams]);

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

  const handleFavoriteToggle = async (property) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/properties/${property._id}` } });
      return;
    }

    try {
      setFavoriteBusyId(property._id);

      if (favoriteIds.has(String(property._id))) {
        await removeFavorite(property._id);
      } else {
        await addFavorite(property._id);
      }

      await refreshUser();
    } catch (favoriteError) {
      setError(favoriteError.message);
    } finally {
      setFavoriteBusyId("");
    }
  };

  return (
    <div className="space-y-6">
      <section className="card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">Browse properties</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Find your next home or investment</h1>
            <p className="mt-2 text-sm text-slate-500">
              Filter by city, price, bedrooms, category, and listing type.
            </p>
          </div>
          <div className="pill bg-brand-50 text-brand-700">{pagination.total} listings found</div>
        </div>

        <form className="mt-6 grid gap-3 lg:grid-cols-4" onSubmit={applyFilters}>
          <input
            className="input-field"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Keyword"
          />
          <input className="input-field" name="city" value={filters.city} onChange={handleChange} placeholder="City" />
          <input className="input-field" name="state" value={filters.state} onChange={handleChange} placeholder="State" />
          <select className="input-field" name="listingType" value={filters.listingType} onChange={handleChange}>
            <option value="">Sale or rent</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
          <select className="input-field" name="category" value={filters.category} onChange={handleChange}>
            <option value="">Any category</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="House">House</option>
            <option value="Plot">Plot</option>
            <option value="Commercial">Commercial</option>
            <option value="Studio">Studio</option>
            <option value="Farm House">Farm House</option>
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
          <input
            className="input-field"
            type="number"
            min="0"
            name="bedrooms"
            value={filters.bedrooms}
            onChange={handleChange}
            placeholder="Bedrooms"
          />
          <select className="input-field" name="sort" value={filters.sort} onChange={handleChange}>
            <option value="latest">Latest</option>
            <option value="priceAsc">Price low to high</option>
            <option value="priceDesc">Price high to low</option>
            <option value="popular">Most viewed</option>
          </select>

          <div className="flex flex-wrap gap-3 lg:col-span-3">
            <button className="btn-primary">
              <Search size={16} />
              Apply filters
            </button>
            <button type="button" className="btn-secondary" onClick={clearFilters}>
              Reset
            </button>
          </div>
        </form>
      </section>

      {error ? <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-500">Loading properties...</p> : null}

      {!loading && (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {properties.length > 0 ? (
              properties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  isFavorite={favoriteIds.has(String(property._id))}
                  onToggleFavorite={handleFavoriteToggle}
                  favoriteBusy={favoriteBusyId === property._id}
                />
              ))
            ) : (
              <div className="card col-span-full text-center text-sm text-slate-500">
                No approved properties matched your search.
              </div>
            )}
          </div>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
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
                type="button"
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
