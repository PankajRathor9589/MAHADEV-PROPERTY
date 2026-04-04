import { Building2, Home, Landmark } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropertyCard from "../components/PropertyCard.jsx";
import { fetchProperties } from "../services/api.js";

const categories = [
  { label: "Plot", icon: Landmark },
  { label: "House", icon: Home },
  { label: "Commercial", icon: Building2 }
];

const HomePage = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [type, setType] = useState("All");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetchProperties({ includeSold: false, limit: 12, page: 1 });
        setProperties(response.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const featured = useMemo(() => properties.slice(0, 6), [properties]);
  const trending = useMemo(() => [...properties].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3), [properties]);

  const handleSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (searchText.trim()) {
      params.set("search", searchText.trim());
    }
    if (type !== "All") {
      params.set("propertyType", type);
    }

    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="space-y-10">
      <section className="card overflow-hidden bg-gradient-to-r from-brand-700 via-brand-600 to-cyan-500 text-white">
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">Sagar Infra</p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">Find Plots, Houses, Flats and Commercial Spaces</h1>
            <p className="mt-3 max-w-2xl text-sm text-cyan-50">
              A modern platform for buyers, sellers, dealers, and admins. Search listings, connect with sellers,
              and manage real estate deals with confidence.
            </p>

            <form onSubmit={handleSearch} className="mt-5 grid gap-3 sm:grid-cols-[1fr_200px_auto]">
              <input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                className="input-field border-white/50 bg-white/95"
                placeholder="Search location, title, locality"
              />
              <select value={type} onChange={(event) => setType(event.target.value)} className="input-field border-white/50 bg-white/95">
                <option value="All">All Types</option>
                <option value="Plot">Plot</option>
                <option value="House">House</option>
                <option value="Flat">Flat</option>
                <option value="Commercial">Commercial</option>
                <option value="Agricultural Land">Agricultural Land</option>
              </select>
              <button className="btn bg-slate-900 text-white hover:bg-slate-800" type="submit">
                Search
              </button>
            </form>
          </div>

          <div className="grid gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur">
            <p className="text-sm font-semibold text-cyan-50">Why choose Sagar Infra?</p>
            <ul className="space-y-2 text-sm text-cyan-100">
              <li>Verified property approval workflow</li>
              <li>Dealer and seller dashboards</li>
              <li>Advanced map and location listings</li>
              <li>Direct inquiry + WhatsApp contact</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.label}
              to={`/properties?propertyType=${encodeURIComponent(category.label)}`}
              className="card flex items-center gap-3 bg-gradient-to-br from-white to-cyan-50 transition hover:-translate-y-1"
            >
              <span className="rounded-xl bg-brand-100 p-3 text-brand-700">
                <Icon size={20} />
              </span>
              <div>
                <h3 className="text-base font-semibold text-slate-900">{category.label}</h3>
                <p className="text-xs text-slate-500">Explore {category.label.toLowerCase()} listings</p>
              </div>
            </Link>
          );
        })}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Featured Properties</h2>
          <Link to="/properties" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
            View all
          </Link>
        </div>

        {loading ? <p className="text-sm text-slate-500">Loading properties...</p> : null}
        {error ? <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

        {!loading && !error && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Trending Properties</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {trending.length > 0 ? (
            trending.map((property) => <PropertyCard key={property._id} property={property} />)
          ) : (
            <p className="text-sm text-slate-500">No trending properties yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
