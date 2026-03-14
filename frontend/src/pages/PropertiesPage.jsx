import { useEffect, useState } from "react";
import { FaLayerGroup, FaMapMarkedAlt, FaMapMarkerAlt, FaSlidersH } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { favoriteApi, propertyApi } from "../api/services";
import FiltersSidebar from "../components/property/FiltersSidebar";
import PropertiesMapView from "../components/property/PropertiesMapView";
import PropertyCard from "../components/property/PropertyCard";
import Pagination from "../components/ui/Pagination";
import Seo from "../components/ui/Seo";
import { ListingResultsSkeleton } from "../components/ui/Skeletons";
import { useAuth } from "../context/AuthContext";

const mapFiltersFromParams = (params) => ({
  city: params.get("city") || "",
  propertyType: params.get("propertyType") || "",
  minPrice: params.get("minPrice") || "",
  maxPrice: params.get("maxPrice") || "",
  bedrooms: params.get("bedrooms") || "",
  search: params.get("search") || ""
});

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(mapFiltersFromParams(searchParams));
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedMapPropertyId, setSelectedMapPropertyId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    setFilters(mapFiltersFromParams(searchParams));
  }, [searchParams]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [response, savedProperties] = await Promise.all([
          propertyApi.list({
            city: searchParams.get("city") || undefined,
            minPrice: searchParams.get("minPrice") || undefined,
            maxPrice: searchParams.get("maxPrice") || undefined,
            bedrooms: searchParams.get("bedrooms") || undefined,
            search: searchParams.get("search") || undefined,
            propertyType: searchParams.get("propertyType") || undefined,
            page: Number(searchParams.get("page") || 1),
            limit: 9
          }),
          user ? favoriteApi.list() : Promise.resolve([])
        ]);

        setItems(response.items);
        setPagination(response.pagination);
        setFavoriteIds(savedProperties.map((item) => item.id));
        setSelectedMapPropertyId(response.items[0]?.id || null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [searchParams, user]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    params.set("page", "1");
    setSearchParams(params);
    setFiltersOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      city: "",
      propertyType: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      search: ""
    });
    setSearchParams(new URLSearchParams({ page: "1" }));
    setFiltersOpen(false);
  };

  const changePage = (page) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    setSearchParams(next);
  };

  const handleFavoriteToggle = async (propertyId, isFavorite) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    if (isFavorite) {
      await favoriteApi.remove(propertyId);
      setFavoriteIds((current) => current.filter((id) => id !== propertyId));
      return;
    }

    await favoriteApi.add(propertyId);
    setFavoriteIds((current) => [...new Set([...current, propertyId])]);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <>
      <Seo
        title="Property Listing Portal"
        description="Browse modern property cards with city, budget, bedroom, and property type filters, plus a Google Maps view for search results."
        keywords="property listing page, map property search, apartments, villas, plots, property filters"
      />

      <section className="relative overflow-hidden rounded-[34px] border border-white/70 bg-[linear-gradient(135deg,#ffffff_0%,#f7f4ec_48%,#eef6f3_100%)] px-5 py-6 shadow-card sm:px-6 lg:px-8">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_center,rgba(15,122,103,0.12),transparent_58%)] lg:block" />
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div className="max-w-3xl">
            <p className="surface-label">Property listing page</p>
            <h1 className="section-heading mt-2 text-4xl md:text-5xl">Compare homes, switch to map mode, and move from search to site visit faster</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Designed with the clarity of large real estate portals: stacked filters, quick city context, Google map preview, and dense cards that still read well on mobile.
            </p>
          </div>

          <div className="grid gap-3 rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-soft sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                <FaLayerGroup />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{pagination?.total || items.length}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Visible listings</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sand-50 text-amber-700">
                <FaMapMarkerAlt />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{filters.city || "All cities"}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Search area</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-700">
                <FaSlidersH />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{activeFilterCount}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Active filters</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        <FiltersSidebar
          filters={filters}
          onChange={updateFilter}
          onApply={applyFilters}
          onClear={clearFilters}
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
        />

        <section className="min-w-0 flex-1">
          <div className="panel-card flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <p className="surface-label">Marketplace inventory</p>
              <h2 className="mt-2 text-3xl font-semibold text-ink">Verified cards with grid and map views</h2>
              <p className="mt-2 text-sm text-slate-600">
                Switch between a property grid and a Google Maps-backed results view without losing your current filters.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button type="button" className="btn-secondary lg:hidden" onClick={() => setFiltersOpen(true)}>
                <FaSlidersH />
                Filters
              </button>
              <div className="flex rounded-full border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    viewMode === "grid" ? "bg-white text-ink shadow-soft" : "text-slate-500"
                  }`}
                >
                  <FaLayerGroup className="mr-2 inline" />
                  Grid
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("map")}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    viewMode === "map" ? "bg-white text-ink shadow-soft" : "text-slate-500"
                  }`}
                >
                  <FaMapMarkedAlt className="mr-2 inline" />
                  Map
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            {viewMode === "grid" ? (
              <>
                {loading ? (
                  <ListingResultsSkeleton count={6} />
                ) : (
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        onSave={handleFavoriteToggle}
                        favoriteActive={favoriteIds.includes(property.id)}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <PropertiesMapView
                items={items}
                loading={loading}
                selectedPropertyId={selectedMapPropertyId}
                onSelectProperty={setSelectedMapPropertyId}
                fallbackQuery={filters.city || filters.search || "Bhopal, Madhya Pradesh"}
              />
            )}
          </div>

          {!loading && items.length === 0 && (
            <div className="panel-card mt-6 p-10 text-center">
              <p className="surface-label">No matches</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">No properties match these filters right now.</h2>
              <p className="mt-3 text-sm text-slate-600">
                Try widening the budget range, clearing the city selection, or choosing a different property type.
              </p>
            </div>
          )}

          {viewMode === "grid" && <Pagination pagination={pagination} onPageChange={changePage} />}
        </section>
      </div>
    </>
  );
};

export default PropertiesPage;
