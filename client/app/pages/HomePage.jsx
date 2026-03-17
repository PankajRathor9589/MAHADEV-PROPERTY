import { ArrowRight, Building2, Landmark, MapPinned, Search, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropertyCard from "../components/PropertyCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { addFavorite, fetchProperties, removeFavorite } from "../services/api.js";

const quickCategories = [
  { label: "Apartments", category: "Apartment", icon: Building2 },
  { label: "Plots", category: "Plot", icon: Landmark },
  { label: "Commercial", category: "Commercial", icon: MapPinned }
];

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, refreshUser } = useAuth();
  const [filters, setFilters] = useState({ search: "", city: "", listingType: "sale" });
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [favoriteBusyId, setFavoriteBusyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const favoriteIds = useMemo(
    () => new Set((user?.favorites || []).map((favoriteId) => String(favoriteId))),
    [user]
  );

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const [featuredResponse, latestResponse] = await Promise.all([
          fetchProperties({ featured: true, limit: 6, sort: "popular" }),
          fetchProperties({ limit: 6, sort: "latest" })
        ]);

        setFeatured(featuredResponse.data || []);
        setLatest(latestResponse.data || []);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const searchParams = new URLSearchParams();
    if (filters.search.trim()) {
      searchParams.set("search", filters.search.trim());
    }
    if (filters.city.trim()) {
      searchParams.set("city", filters.city.trim());
    }
    if (filters.listingType) {
      searchParams.set("listingType", filters.listingType);
    }

    navigate(`/properties?${searchParams.toString()}`);
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
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-[36px] bg-slate-900 px-6 py-10 text-white shadow-panel sm:px-10 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(31,122,100,0.55),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(220,146,33,0.34),_transparent_24%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="pill border-brand-300/30 bg-white/10 text-white">Modern MERN property platform</span>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
              Discover verified homes, plots, and rentals with a clean buying journey.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-200">
              Browse featured real estate, save favorites, contact owners, and manage listings with a production-ready admin panel.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-8 grid gap-3 rounded-[30px] border border-white/10 bg-white/10 p-4 backdrop-blur sm:grid-cols-2 xl:grid-cols-[1.1fr_0.8fr_0.7fr_auto]"
            >
              <input
                className="input-field border-white/10 bg-white text-slate-900"
                name="search"
                value={filters.search}
                onChange={handleChange}
                placeholder="Search by title, area, or landmark"
              />
              <input
                className="input-field border-white/10 bg-white text-slate-900"
                name="city"
                value={filters.city}
                onChange={handleChange}
                placeholder="City"
              />
              <select
                className="input-field border-white/10 bg-white text-slate-900"
                name="listingType"
                value={filters.listingType}
                onChange={handleChange}
              >
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
              <button className="btn-primary min-w-[140px]">
                <Search size={16} />
                Search
              </button>
            </form>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <Sparkles size={18} />
              <p className="mt-4 text-2xl font-bold">Featured inventory</p>
              <p className="mt-2 text-sm text-slate-200">Highlight premium or paid listings on the home page.</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <ShieldCheck size={18} />
              <p className="mt-4 text-2xl font-bold">Admin moderation</p>
              <p className="mt-2 text-sm text-slate-200">Approve, reject, delete, and manage users from one dashboard.</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <MapPinned size={18} />
              <p className="mt-4 text-2xl font-bold">Maps-ready listings</p>
              <p className="mt-2 text-sm text-slate-200">Latitude, longitude, and Google Maps embeds for every detail page.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {quickCategories.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.category}
              to={`/properties?category=${encodeURIComponent(item.category)}`}
              className="card group flex items-center justify-between gap-4"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">Quick Browse</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">{item.label}</h2>
                <p className="mt-2 text-sm text-slate-500">Explore the latest {item.label.toLowerCase()} around you.</p>
              </div>
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 transition group-hover:scale-105">
                <Icon size={24} />
              </span>
            </Link>
          );
        })}
      </section>

      {error ? <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : null}

      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">Top picks</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Featured Properties</h2>
          </div>
          <Link to="/properties?featured=true" className="btn-secondary">
            View featured
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? <p className="text-sm text-slate-500">Loading featured properties...</p> : null}

        {!loading && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                isFavorite={favoriteIds.has(String(property._id))}
                onToggleFavorite={handleFavoriteToggle}
                favoriteBusy={favoriteBusyId === property._id}
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">Fresh listings</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Recently Added</h2>
          </div>
          <Link to="/properties" className="btn-secondary">
            Browse all
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? <p className="text-sm text-slate-500">Loading recent properties...</p> : null}

        {!loading && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {latest.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                isFavorite={favoriteIds.has(String(property._id))}
                onToggleFavorite={handleFavoriteToggle}
                favoriteBusy={favoriteBusyId === property._id}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
