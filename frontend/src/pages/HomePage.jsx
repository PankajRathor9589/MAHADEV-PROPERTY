import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaBuilding,
  FaHome,
  FaMapMarkerAlt,
  FaPlayCircle,
  FaSearch,
  FaStore,
  FaTag
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { favoriteApi, propertyApi } from "../api/services";
import PropertyCard from "../components/property/PropertyCard";
import Seo from "../components/ui/Seo";
import { PropertyCardSkeleton } from "../components/ui/Skeletons";
import {
  BRAND,
  CATEGORY_CARDS,
  CITIES,
  DEMO_LOGIN_HINTS,
  HERO_MEDIA,
  HERO_STATS,
  PRICE_RANGES,
  PROPERTY_TYPES,
  TRUST_BADGES
} from "../config/site";
import { useAuth } from "../context/AuthContext";

const categoryIcons = {
  buy: FaHome,
  rent: FaTag,
  sell: FaBuilding,
  commercial: FaStore
};

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({
    city: "",
    propertyType: "",
    bedrooms: "",
    priceRange: ""
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [propertyResponse, savedProperties] = await Promise.all([
          propertyApi.list({ limit: 12 }),
          user ? favoriteApi.list() : Promise.resolve([])
        ]);
        const items = propertyResponse.items || [];
        const byPopularity = [...items].sort((left, right) => right.views - left.views);
        setFeatured(byPopularity.slice(0, 3));
        setLatest(items.slice(0, 6));
        setFavoriteIds(savedProperties.map((item) => item.id));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  const handleFavoriteToggle = async (propertyId, isFavorite) => {
    if (!user) {
      navigate("/login");
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

  const buildSearchParams = () => {
    const params = new URLSearchParams();

    if (search.city) params.set("city", search.city);
    if (search.propertyType) params.set("propertyType", search.propertyType);
    if (search.bedrooms) params.set("bedrooms", search.bedrooms);

    const selectedPriceRange = PRICE_RANGES.find((item) => item.label === search.priceRange);
    if (selectedPriceRange?.minPrice) params.set("minPrice", selectedPriceRange.minPrice);
    if (selectedPriceRange?.maxPrice) params.set("maxPrice", selectedPriceRange.maxPrice);

    return params.toString();
  };

  const handleSearch = () => {
    navigate(`/properties?${buildSearchParams()}`);
  };

  const navigateToCategory = (category) => {
    if (category.path) {
      navigate(category.path);
      return;
    }

    const params = new URLSearchParams();
    if (category.city) params.set("city", category.city);
    if (category.propertyType) params.set("propertyType", category.propertyType);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <>
      <Seo
        title="Modern Real Estate Portal"
        description="Explore featured homes, verified listings, map-backed browsing, and portal-style search with a modern responsive real estate UI."
        keywords="real estate portal, property listings, homes for sale, homes for rent, property compare, saved properties"
      />

      <section className="relative overflow-hidden rounded-[36px] border border-white/40 bg-ink text-white shadow-card">
        <video className="absolute inset-0 h-full w-full object-cover" src={HERO_MEDIA.heroVideo} autoPlay muted loop playsInline />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(7,18,32,0.88),rgba(7,18,32,0.56)_48%,rgba(7,18,32,0.84))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(18,184,134,0.34),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.22),transparent_24%)]" />

        <div className="relative grid gap-8 px-5 py-8 sm:px-8 sm:py-10 xl:grid-cols-[1.15fr_0.85fr] xl:px-10">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {TRUST_BADGES.map((badge) => (
                <span key={badge} className="stat-chip bg-white/10 text-white">
                  {badge}
                </span>
              ))}
            </div>

            <div className="max-w-3xl space-y-4">
              <p className="surface-label text-sand-100">Portal-style property discovery</p>
              <h1 className="hero-heading text-5xl leading-[1.02] sm:text-6xl xl:text-7xl">
                Buy, rent, or list standout properties with a polished modern marketplace flow.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                {BRAND.tagline} The interface is designed to feel familiar to users of major real estate portals while staying fast, clean, and mobile friendly.
              </p>
            </div>

            <div className="rounded-[30px] border border-white/20 bg-white/14 p-4 shadow-soft backdrop-blur md:p-5">
              <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr_1fr_1fr_auto]">
                <div className="relative">
                  <FaMapMarkerAlt className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-300" />
                  <select
                    className="field bg-white pl-11 text-slate-900"
                    value={search.city}
                    onChange={(event) => setSearch((prev) => ({ ...prev, city: event.target.value }))}
                  >
                    <option value="">Select city</option>
                    {CITIES.map((city) => (
                      <option key={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <select
                  className="field bg-white text-slate-900"
                  value={search.propertyType}
                  onChange={(event) => setSearch((prev) => ({ ...prev, propertyType: event.target.value }))}
                >
                  <option value="">Property type</option>
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
                <select
                  className="field bg-white text-slate-900"
                  value={search.bedrooms}
                  onChange={(event) => setSearch((prev) => ({ ...prev, bedrooms: event.target.value }))}
                >
                  <option value="">Bedrooms</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
                <select
                  className="field bg-white text-slate-900"
                  value={search.priceRange}
                  onChange={(event) => setSearch((prev) => ({ ...prev, priceRange: event.target.value }))}
                >
                  {PRICE_RANGES.map((range) => (
                    <option key={range.label}>{range.label}</option>
                  ))}
                </select>
                <button type="button" onClick={handleSearch} className="btn-primary min-h-[52px] bg-amber-400 text-ink hover:bg-amber-300">
                  <FaSearch />
                  Search
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {HERO_STATS.map((item) => (
                <div key={item.label} className="glass-card px-4 py-5">
                  <p className="text-3xl font-semibold">{item.value}</p>
                  <p className="mt-2 text-sm text-slate-200">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="panel-card overflow-hidden border-white/10 bg-white/92 p-0 text-slate-900">
              <div className="grid gap-5 p-5 sm:grid-cols-[1.1fr_0.9fr] sm:items-center">
                <div className="space-y-3">
                  <p className="surface-label">Demo-ready interface</p>
                  <h2 className="text-3xl font-semibold text-ink">Browse like a live portal, even without a running API.</h2>
                  <p className="text-sm leading-7 text-slate-600">
                    The app now falls back to local demo data for listings, favorites, compare, dashboards, and moderation flows.
                  </p>
                  <Link to="/properties" className="btn-secondary">
                    <FaPlayCircle />
                    Explore listings
                  </Link>
                </div>
                <div className="overflow-hidden rounded-[28px] bg-slate-100">
                  <img src={HERO_MEDIA.realEstateGif} alt="Real estate animation" className="h-full w-full object-cover" loading="lazy" />
                </div>
              </div>
            </div>

            <div className="panel-card bg-white/92 p-5 text-slate-900">
              <p className="surface-label">Demo access</p>
              <div className="mt-3 grid gap-3">
                {DEMO_LOGIN_HINTS.map((account) => (
                  <div key={account.role} className="rounded-[24px] border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-sm font-semibold text-ink">{account.role}</p>
                    <p className="mt-1 text-sm text-slate-600">{account.email}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{account.password}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="surface-label">Categories</p>
            <h2 className="section-heading mt-2 text-4xl">Start with the intent that matches your journey</h2>
          </div>
          <Link to="/properties" className="btn-secondary">
            View all listings
            <FaArrowRight />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {CATEGORY_CARDS.map((category) => {
            const Icon = categoryIcons[category.id] || FaHome;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => navigateToCategory(category)}
                className={`group relative overflow-hidden rounded-[32px] bg-gradient-to-br ${category.accent} p-6 text-left text-white shadow-soft transition duration-300 hover:-translate-y-1`}
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 transition duration-300 group-hover:scale-110" />
                <div className="relative space-y-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-xl backdrop-blur">
                    <Icon />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold">{category.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/80">{category.description}</p>
                  </div>
                  <p className="text-sm font-semibold text-white/90">{category.count}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="surface-label">Featured properties</p>
            <h2 className="section-heading mt-2 text-4xl">Premium picks that look ready for an on-site visit</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-600">
            Highlighted by demand and visual quality so the homepage feels like a real inventory-led marketplace.
          </p>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => <PropertyCardSkeleton key={index} />)
            : featured.map((item) => (
                <PropertyCard
                  key={item.id}
                  property={item}
                  onSave={handleFavoriteToggle}
                  favoriteActive={favoriteIds.includes(item.id)}
                />
              ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="surface-label">Latest listings</p>
            <h2 className="section-heading mt-2 text-4xl">Fresh inventory across apartments, villas, plots, and commercial space</h2>
          </div>
          <button type="button" onClick={() => navigate("/properties")} className="btn-primary">
            Browse all properties
          </button>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => <PropertyCardSkeleton key={index} />)
            : latest.map((item) => (
                <PropertyCard
                  key={item.id}
                  property={item}
                  onSave={handleFavoriteToggle}
                  favoriteActive={favoriteIds.includes(item.id)}
                />
              ))}
        </div>
      </section>
    </>
  );
};

export default HomePage;
