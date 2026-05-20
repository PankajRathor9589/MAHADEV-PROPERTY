import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Building2,
  Crown,
  MessageCircleMore,
  Phone,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  WalletCards
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import LeadCaptureForm from "../components/LeadCaptureForm.jsx";
import PropertyCard from "../components/PropertyCard.jsx";
import Reveal from "../components/Reveal.jsx";
import Seo from "../components/Seo.jsx";
import { COMPANY_INFO } from "../data/siteContent.js";
import { API_BASE_URL, fetchProperties, fetchPropertySuggestions } from "../services/api.js";
import {
  formatCurrency,
  hasPropertyVideo,
  isFeaturedProperty,
  resolvePropertyPath,
  toPhoneHref,
  toWhatsAppHref
} from "../utils/format.js";

const initialFilters = {
  search: "",
  location: "",
  type: "",
  listingType: "",
  minPrice: "",
  maxPrice: "",
  sort: "latest"
};

const marketplaceModes = [
  { id: "all", label: "All inventory", helper: "Owner + expert marketplace" },
  { id: "owner", label: "No brokerage", helper: "Direct-owner style listings" },
  { id: "expert", label: "Verified experts", helper: "Broker, builder, and premium supply" },
  { id: "premium", label: "Buyer pass", helper: "Featured and rich-media opportunities" }
];

const quickBudgets = [
  { label: "Under 25L", minPrice: "", maxPrice: "2500000" },
  { label: "25L - 75L", minPrice: "2500000", maxPrice: "7500000" },
  { label: "75L - 1.5Cr", minPrice: "7500000", maxPrice: "15000000" },
  { label: "1.5Cr+", minPrice: "15000000", maxPrice: "" }
];

const revenueTracks = [
  {
    title: "Owner Growth Engine",
    copy: "Featured upgrades, urgent sale boosts, and direct WhatsApp responses keep owner inventory competitive without brokerage friction.",
    icon: ShieldCheck
  },
  {
    title: "Verified Expert SaaS",
    copy: "Starter, Pro, and Enterprise experiences support brokers, agencies, and builders with analytics-led publishing and CRM visibility.",
    icon: Crown
  },
  {
    title: "Service Commissions",
    copy: "Home loans, legal verification, interiors, and renovation services expand revenue beyond listing visibility.",
    icon: WalletCards
  }
];

const getMarketplaceTrack = (property) => {
  const role = String(property.postedBy?.role || property.listedByType || "").toLowerCase();

  if (["broker", "agency", "builder", "admin"].includes(role) || isFeaturedProperty(property)) {
    return "expert";
  }

  if (["owner", "seller", "user"].includes(role) || property.approvalStatus === "approved") {
    return "owner";
  }

  return "all";
};

const getPropertySignals = (property) => {
  const baseScore = property.price ? Math.max(72, 92 - Math.min(14, Math.floor(property.price / 1800000))) : 84;
  const mediaBoost = hasPropertyVideo(property) ? 4 : 0;
  const featuredBoost = isFeaturedProperty(property) ? 3 : 0;
  const viewsBoost = property.views ? Math.min(5, Math.floor(property.views / 18)) : 2;

  return {
    match: Math.min(98, baseScore + mediaBoost + featuredBoost + viewsBoost),
    seriousness: property.views ? Math.min(96, 74 + Math.floor(property.views / 11)) : 82,
    investment: property.category === "Commercial" ? 94 : property.category === "Plot" ? 91 : 88
  };
};

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(initialFilters);
  const [properties, setProperties] = useState([]);
  const [compareSelection, setCompareSelection] = useState([]);
  const [marketplaceMode, setMarketplaceMode] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dataSource, setDataSource] = useState(API_BASE_URL ? "live" : "unavailable");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const nextFilters = { ...initialFilters };

    Object.keys(nextFilters).forEach((key) => {
      if (searchParams.has(key)) {
        nextFilters[key] = searchParams.get(key) || "";
      }
    });

    setFilters(nextFilters);
    setMarketplaceMode(
      marketplaceModes.some((mode) => mode.id === searchParams.get("track")) ? searchParams.get("track") : "all"
    );
  }, [searchParams]);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {
          page: Number(searchParams.get("page") || 1),
          limit: 12,
          sort: searchParams.get("sort") || "latest"
        };

        searchParams.forEach((value, key) => {
          if (key !== "page" && key !== "track" && String(value).trim()) {
            params[key] = value;
          }
        });

        const response = await fetchProperties(params);
        setProperties(response.data || []);
        setPagination(
          response.pagination || {
            page: 1,
            pages: 1,
            total: 0
          }
        );
        setDataSource(API_BASE_URL ? "live" : "unavailable");
      } catch (loadError) {
        setError(loadError.message);
        setProperties([]);
        setPagination({
          page: 1,
          pages: 1,
          total: 0
        });
        setDataSource("unavailable");
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [searchParams]);

  useEffect(() => {
    const query = [filters.search, filters.location].filter(Boolean).join(" ").trim();

    if (!query || query.length < 2) {
      setSuggestions([]);
      return undefined;
    }

    const timer = window.setTimeout(async () => {
      try {
        const nextSuggestions = await fetchPropertySuggestions({ q: query, limit: 6 });
        setSuggestions(nextSuggestions);
      } catch {
        setSuggestions([]);
      }
    }, 260);

    return () => window.clearTimeout(timer);
  }, [filters.location, filters.search]);

  const activeFilterCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === "sort") {
        return value && value !== "latest";
      }

      return String(value).trim() !== "";
    }).length;
  }, [filters]);

  const marketplaceInsights = useMemo(() => {
    const ownerCount = properties.filter((property) => getMarketplaceTrack(property) === "owner").length;
    const expertCount = properties.filter((property) => getMarketplaceTrack(property) === "expert").length;
    const premiumCount = properties.filter((property) => hasPropertyVideo(property) || isFeaturedProperty(property)).length;

    return [
      { label: "Direct-owner supply", value: ownerCount, icon: ShieldCheck },
      { label: "Verified experts", value: expertCount, icon: Crown },
      { label: "Premium buyer pass", value: premiumCount, icon: Sparkles }
    ];
  }, [properties]);

  const displayedProperties = useMemo(() => {
    return properties.filter((property) => {
      const track = getMarketplaceTrack(property);

      if (marketplaceMode === "owner") {
        return track === "owner";
      }

      if (marketplaceMode === "expert") {
        return track === "expert";
      }

      if (marketplaceMode === "premium") {
        return isFeaturedProperty(property) || hasPropertyVideo(property);
      }

      return true;
    });
  }, [marketplaceMode, properties]);

  const compareMetrics = useMemo(() => {
    return compareSelection.map((property) => {
      const signals = getPropertySignals(property);

      return {
        property,
        metrics: [
          { label: "AI match", value: signals.match },
          { label: "Serious buyer score", value: signals.seriousness },
          { label: "Investment score", value: signals.investment }
        ]
      };
    });
  }, [compareSelection]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (String(value).trim()) {
        nextParams.set(key, value);
      }
    });
    nextParams.set("page", "1");
    if (marketplaceMode !== "all") {
      nextParams.set("track", marketplaceMode);
    }
    setSearchParams(nextParams);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setMarketplaceMode("all");
    setSearchParams(new URLSearchParams());
  };

  const movePage = (nextPage) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(nextPage));
    if (marketplaceMode !== "all") {
      nextParams.set("track", marketplaceMode);
    }
    setSearchParams(nextParams);
  };

  const handleMarketplaceMode = (modeId) => {
    setMarketplaceMode(modeId);
    const nextParams = new URLSearchParams(searchParams);

    if (modeId === "all") {
      nextParams.delete("track");
    } else {
      nextParams.set("track", modeId);
    }

    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  const applyBudgetPreset = (preset) => {
    setFilters((current) => ({
      ...current,
      minPrice: preset.minPrice,
      maxPrice: preset.maxPrice
    }));
  };

  const toggleCompare = (property) => {
    setCompareSelection((current) => {
      const exists = current.some((item) => String(item._id || item.slug) === String(property._id || property.slug));

      if (exists) {
        return current.filter((item) => String(item._id || item.slug) !== String(property._id || property.slug));
      }

      if (current.length >= 3) {
        return [...current.slice(1), property];
      }

      return [...current, property];
    });
  };

  return (
    <>
      <Seo
        title={`Luxury Marketplace | ${COMPANY_INFO.name}`}
        description="Discover direct-owner, verified expert, and premium buyer-pass properties with intelligent filtering, shortlist tools, and investor-friendly detail."
        canonical={`${COMPANY_INFO.canonicalUrl}/properties`}
        image={`${COMPANY_INFO.canonicalUrl}/og-image.svg`}
        keywords={`no brokerage properties, verified expert listings, premium real estate marketplace, ${COMPANY_INFO.metaKeywords}`}
      />

      <section className="section-shell pt-8">
        <div className="relative overflow-hidden rounded-[40px] border border-[#11233c] bg-[#07111e] px-5 py-6 text-white shadow-[0_34px_110px_rgba(4,10,18,0.34)] sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.18),transparent_28%),radial-gradient(circle_at_92%_18%,rgba(108,147,255,0.16),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0))]" />
          <div className="relative">
            <div className="grid gap-8 xl:grid-cols-[1.04fr_0.96fr]">
              <div>
                <p className="luxury-kicker text-white/72">Luxury Marketplace OS</p>
                <h1 className="mt-4 font-display text-[clamp(3rem,5.6vw,5.3rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-white">
                  Direct-owner trust meets verified expert scale.
                </h1>
                <p className="mt-5 max-w-3xl text-sm leading-8 text-white/72 sm:text-base">
                  This marketplace now behaves like a premium proptech surface: no-brokerage inventory, verified expert
                  supply, shared family shortlist, side-by-side comparison, and serious-buyer-ready contact journeys.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {marketplaceInsights.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="rounded-full border border-white/14 bg-white/8 px-4 py-3 text-sm shadow-[0_18px_44px_rgba(0,0,0,0.18)] backdrop-blur-xl"
                      >
                        <span className="inline-flex items-center gap-2 font-semibold text-white">
                          <Icon size={15} className="text-gold-300" />
                          {item.value}
                        </span>
                        <span className="ml-2 text-white/64">{item.label}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a href="#property-grid" className="btn-primary w-full sm:w-auto">
                    <Search size={16} />
                    Explore Inventory
                  </a>
                  <a
                    href={toWhatsAppHref(
                      COMPANY_INFO.whatsappNumber,
                      "Hi Sagar Infra, I want a curated shortlist from the luxury marketplace."
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-whatsapp w-full sm:w-auto"
                  >
                    <MessageCircleMore size={16} />
                    WhatsApp Concierge
                  </a>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
                <div className="rounded-[30px] border border-white/12 bg-white/8 p-5 backdrop-blur-xl">
                  <ShieldCheck size={18} className="text-gold-300" />
                  <p className="mt-4 text-lg font-semibold text-white">Direct Owner Marketplace</p>
                  <p className="mt-2 text-sm leading-7 text-white/68">
                    Trust cues, no-brokerage framing, and instant WhatsApp paths reduce noise and increase buyer confidence.
                  </p>
                </div>
                <div className="rounded-[30px] border border-white/12 bg-white/8 p-5 backdrop-blur-xl">
                  <Crown size={18} className="text-gold-300" />
                  <p className="mt-4 text-lg font-semibold text-white">Verified Expert Network</p>
                  <p className="mt-2 text-sm leading-7 text-white/68">
                    Builder, broker, and agency inventory is presented like a premium SaaS marketplace, not a basic classifieds page.
                  </p>
                </div>
                <div className="rounded-[30px] border border-white/12 bg-white/8 p-5 backdrop-blur-xl">
                  <BrainCircuit size={18} className="text-gold-300" />
                  <p className="mt-4 text-lg font-semibold text-white">AI Serious Buyer Layer</p>
                  <p className="mt-2 text-sm leading-7 text-white/68">
                    Match scoring, shortlist behavior, and high-intent contact paths prepare the surface for smarter lead qualification.
                  </p>
                </div>
              </div>
            </div>

            <div className="search-floating-shell relative mt-8 text-ink-800">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="section-kicker">Search Workbench</p>
                  <h2 className="mt-2 text-3xl font-semibold text-ink-900">Search, filter, and compare without losing the premium feel</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {marketplaceModes.map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => handleMarketplaceMode(mode.id)}
                      className={`search-chip ${marketplaceMode === mode.id ? "search-chip-active" : ""}`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              <form className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4" onSubmit={handleSubmit}>
                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-500">Search</span>
                  <input
                    className="input-field"
                    name="search"
                    value={filters.search}
                    onChange={handleChange}
                    placeholder="3BHK in Civil Line under 1 Cr"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-500">Location</span>
                  <input
                    className="input-field"
                    name="location"
                    value={filters.location}
                    onChange={handleChange}
                    placeholder="Sagar, Makronia, Civil Line"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-500">Property Type</span>
                  <select className="input-field" name="type" value={filters.type} onChange={handleChange}>
                    <option value="">All types</option>
                    <option value="Plot">Plot</option>
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Villa">Villa</option>
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-500">Listing Mode</span>
                  <select className="input-field" name="listingType" value={filters.listingType} onChange={handleChange}>
                    <option value="">Buy or Rent</option>
                    <option value="sale">Buy Property</option>
                    <option value="rent">Rent Property</option>
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-500">Min Price</span>
                  <input
                    className="input-field"
                    type="number"
                    min="0"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleChange}
                    placeholder="Minimum budget"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-500">Max Price</span>
                  <input
                    className="input-field"
                    type="number"
                    min="0"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleChange}
                    placeholder="Maximum budget"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-500">Sort</span>
                  <select className="input-field" name="sort" value={filters.sort} onChange={handleChange}>
                    <option value="latest">Newest</option>
                    <option value="priceAsc">Price low to high</option>
                    <option value="priceDesc">Price high to low</option>
                    <option value="popular">Most viewed</option>
                  </select>
                </label>

                <div className="flex flex-col justify-end gap-3 xl:flex-row xl:items-end">
                  <button className="btn-primary w-full xl:w-auto">
                    <Search size={16} />
                    Apply
                  </button>
                  <button type="button" className="btn-ghost w-full xl:w-auto" onClick={resetFilters}>
                    <SlidersHorizontal size={16} />
                    Reset
                  </button>
                </div>
              </form>

              <div className="mt-5 flex flex-wrap gap-2">
                {quickBudgets.map((preset) => (
                  <button key={preset.label} type="button" onClick={() => applyBudgetPreset(preset)} className="search-chip">
                    {preset.label}
                  </button>
                ))}
              </div>

              {suggestions.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2" aria-label="Search suggestions">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id || suggestion.label}
                      type="button"
                      onClick={() => {
                        setFilters((current) => ({
                          ...current,
                          search: suggestion.label || current.search,
                          location: suggestion.location?.split(",")[0] || current.location
                        }));
                      }}
                      className="search-chip border-gold-300/70 bg-[#fff8e6]"
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="mt-5 grid gap-3 lg:grid-cols-3">
                <div className="rounded-[26px] border border-[#ece2d4] bg-[#fbf8f2] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-700">AI Suggestion</p>
                  <p className="mt-3 text-sm leading-7 text-ink-600">
                    Try natural-language searches like “luxury villa in Sagar with investment potential”.
                  </p>
                </div>
                <div className="rounded-[26px] border border-[#ece2d4] bg-[#fbf8f2] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-700">Shared Shortlist</p>
                  <p className="mt-3 text-sm leading-7 text-ink-600">
                    Use Compare on up to three properties, then share the resulting shortlist with family on WhatsApp.
                  </p>
                </div>
                <div className="rounded-[26px] border border-[#ece2d4] bg-[#fbf8f2] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-700">Trust Infrastructure</p>
                  <p className="mt-3 text-sm leading-7 text-ink-600">
                    Anti-spam contact protection, verified badges, and guided callback flows make the marketplace feel safer.
                  </p>
                </div>
              </div>

              {dataSource === "unavailable" ? (
                <p className="mt-5 text-sm text-ink-500">
                  Live inventory depends on the connected backend API and published database listings.
                </p>
              ) : null}

              {activeFilterCount > 0 ? (
                <p className="mt-3 text-sm text-ink-500">{activeFilterCount} active filter(s) applied.</p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section id="property-grid" className="section-shell pt-0">
        {compareSelection.length > 0 ? (
          <motion.div
            layout
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel mb-8 overflow-hidden p-6 sm:p-7"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="section-kicker">Family Shortlist</p>
                <h2 className="mt-2 text-3xl font-semibold text-ink-900">Compare up to three high-intent opportunities</h2>
              </div>
              <a
                href={toWhatsAppHref(
                  COMPANY_INFO.whatsappNumber,
                  `Hi Sagar Infra, please help us compare these properties: ${compareSelection.map((item) => item.title).join(", ")}`
                )}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp w-full lg:w-auto"
              >
                <Users size={16} />
                Share With Family Concierge
              </a>
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-3">
              {compareMetrics.map(({ property, metrics }) => (
                <div key={property._id || property.slug || property.title} className="rounded-[30px] border border-[#eadfcf] bg-[#fbf8f2] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-700">
                        {property.category || "Property"}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-ink-900">{property.title}</h3>
                    </div>
                    <button type="button" className="search-chip" onClick={() => toggleCompare(property)}>
                      Remove
                    </button>
                  </div>

                  <p className="mt-3 text-sm text-ink-500">{formatCurrency(property.price)}</p>

                  <div className="mt-5 space-y-3">
                    {metrics.map((metric) => (
                      <div key={metric.label}>
                        <div className="flex items-center justify-between gap-3 text-sm text-ink-600">
                          <span>{metric.label}</span>
                          <span className="font-semibold text-ink-900">{metric.value}%</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-[#eadfce]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#0b1d3a] via-[#34548a] to-[#d4af37]"
                            style={{ width: `${metric.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link to={resolvePropertyPath(property)} className="btn-ghost mt-5 w-full">
                    Open Property
                    <ArrowRight size={15} />
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[32px] border border-[#eadfcf] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] lg:col-span-2">
            <p className="section-kicker">Marketplace Feed</p>
            <h2 className="mt-2 text-4xl font-semibold text-ink-900">
              {marketplaceModes.find((mode) => mode.id === marketplaceMode)?.label || "All inventory"}
            </h2>
            <p className="mt-3 text-sm leading-8 text-ink-500">
              {marketplaceModes.find((mode) => mode.id === marketplaceMode)?.helper ||
                "Owner and expert supply together in one premium feed."}
            </p>
          </div>

          <div className="rounded-[32px] border border-[#eadfcf] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
            <p className="section-kicker">Result Snapshot</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[24px] border border-[#ece2d4] bg-[#fbf8f2] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-ink-500">Visible cards</p>
                <p className="mt-2 text-3xl font-semibold text-ink-900">{displayedProperties.length}</p>
              </div>
              <div className="rounded-[24px] border border-[#ece2d4] bg-[#fbf8f2] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-ink-500">Comparison tray</p>
                <p className="mt-2 text-3xl font-semibold text-ink-900">{compareSelection.length}/3</p>
              </div>
              <div className="rounded-[24px] border border-[#ece2d4] bg-[#fbf8f2] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-ink-500">Live source</p>
                <p className="mt-2 text-lg font-semibold text-ink-900">
                  {dataSource === "live" ? "Connected API" : "Awaiting API"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {loading ? <p className="mt-8 text-sm text-ink-500">Loading properties...</p> : null}
        {error ? <p className="mt-6 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : null}

        {!loading ? (
          <>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {displayedProperties.length > 0 ? (
                displayedProperties.map((property, index) => (
                  <Reveal key={property._id || property.slug || property.title} delay={index * 0.04}>
                    <PropertyCard
                      property={property}
                      onCompare={toggleCompare}
                      compareActive={compareSelection.some(
                        (item) => String(item._id || item.slug) === String(property._id || property.slug)
                      )}
                    />
                  </Reveal>
                ))
              ) : (
                <div className="card col-span-full text-center">
                  <p className="text-lg font-semibold text-ink-800">
                    {dataSource === "unavailable"
                      ? "Property inventory is not available right now"
                      : "No listings matched this marketplace mode"}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-ink-500">
                    {dataSource === "unavailable"
                      ? "Connect the API and publish properties from the admin dashboard to see live listings here."
                      : "Reset filters or switch between owner, expert, and buyer-pass modes to expand the result set."}
                  </p>
                </div>
              )}
            </div>

            {pagination.pages > 1 ? (
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  className="btn-ghost"
                  disabled={pagination.page <= 1}
                  onClick={() => movePage(pagination.page - 1)}
                >
                  Previous
                </button>
                <span className="text-sm text-ink-500">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  type="button"
                  className="btn-ghost"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => movePage(pagination.page + 1)}
                >
                  Next
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </section>

      <section className="section-shell pt-0">
        <div className="grid gap-6 xl:grid-cols-3">
          {revenueTracks.map((track, index) => {
            const Icon = track.icon;

            return (
              <Reveal key={track.title} delay={index * 0.06}>
                <div className="glass-panel h-full p-6 sm:p-7">
                  <Icon size={18} className="text-gold-600" />
                  <p className="mt-4 text-2xl font-semibold text-ink-900">{track.title}</p>
                  <p className="mt-3 text-sm leading-8 text-ink-500">{track.copy}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="glass-panel p-6 sm:p-8">
            <p className="section-kicker">Smart Marketplace Modules</p>
            <h2 className="mt-3 text-5xl font-semibold leading-none text-ink-900">Built for buyers, families, and serious closing teams</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[26px] border border-[#e8decf] bg-[#fbf8f2] p-5">
                <p className="inline-flex items-center gap-2 text-lg font-semibold text-ink-900">
                  <BarChart3 size={18} className="text-gold-600" />
                  Price history + investment cues
                </p>
                <p className="mt-3 text-sm leading-7 text-ink-500">
                  Buyers can move from browsing to comparison to conviction with price-performance, local intelligence, and AI match framing.
                </p>
              </div>
              <div className="rounded-[26px] border border-[#e8decf] bg-[#fbf8f2] p-5">
                <p className="inline-flex items-center gap-2 text-lg font-semibold text-ink-900">
                  <Users size={18} className="text-gold-600" />
                  Shared family shortlist
                </p>
                <p className="mt-3 text-sm leading-7 text-ink-500">
                  Compare three listings, share them instantly, and let family decision-makers join the buying conversation faster.
                </p>
              </div>
              <div className="rounded-[26px] border border-[#e8decf] bg-[#fbf8f2] p-5">
                <p className="inline-flex items-center gap-2 text-lg font-semibold text-ink-900">
                  <Sparkles size={18} className="text-gold-600" />
                  Anti-spam trust
                </p>
                <p className="mt-3 text-sm leading-7 text-ink-500">
                  Hidden number logic, request-call flows, and verified badges protect both owners and verified experts from noise.
                </p>
              </div>
              <div className="rounded-[26px] border border-[#e8decf] bg-[#fbf8f2] p-5">
                <p className="inline-flex items-center gap-2 text-lg font-semibold text-ink-900">
                  <Building2 size={18} className="text-gold-600" />
                  Service ecosystem
                </p>
                <p className="mt-3 text-sm leading-7 text-ink-500">
                  Home loans, legal verification, interiors, and renovation become enterprise-style service upsells around every deal.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-[#eadfcf] bg-white p-6 shadow-[0_20px_58px_rgba(15,23,42,0.08)] sm:p-8">
            <p className="section-kicker">Premium Assistance</p>
            <h2 className="mt-3 text-4xl font-semibold text-ink-900">Need an owner listing boost or a curated investor shortlist?</h2>
            <p className="mt-4 text-sm leading-8 text-ink-500">
              Sagar Infra can help with site visits, listing upgrades, buyer-pass introductions, or a luxury-ready sell-side strategy.
            </p>

            <div className="mt-6 space-y-3">
              <a href={toPhoneHref(COMPANY_INFO.phoneDisplay)} className="btn-secondary w-full">
                <Phone size={16} />
                Call Marketplace Desk
              </a>
              <a
                href={toWhatsAppHref(
                  COMPANY_INFO.whatsappNumber,
                  "Hi Sagar Infra, I need help with a premium shortlist or owner listing boost."
                )}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp w-full"
              >
                <MessageCircleMore size={16} />
                WhatsApp Marketplace Desk
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="sell-property" className="section-shell">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="glass-panel p-7 sm:p-8">
            <p className="section-kicker">Sell or Scale</p>
            <h2 className="mt-3 text-5xl font-semibold leading-none text-ink-900">
              Launch as an owner, grow as an expert, and monetize like a platform.
            </h2>
            <p className="mt-5 text-sm leading-8 text-ink-500 sm:text-base">
              The public marketplace now supports direct sellers, while the verified expert layer prepares Sagar Infra
              for recurring SaaS revenue and enterprise partnerships.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[26px] border border-[#e8decf] bg-[#fbf8f2] p-5">
                <p className="text-lg font-semibold text-ink-900">Owner Listing Upgrade</p>
                <p className="mt-2 text-sm leading-7 text-ink-500">
                  Premium visibility, urgent sale boosts, and anti-spam lead handling help owners close with more confidence.
                </p>
              </div>
              <div className="rounded-[26px] border border-[#e8decf] bg-[#fbf8f2] p-5">
                <p className="text-lg font-semibold text-ink-900">Verified Expert Enrollment</p>
                <p className="mt-2 text-sm leading-7 text-ink-500">
                  Brokers, agencies, and builders can be framed as a verified SaaS network with analytics and lead tooling.
                </p>
              </div>
            </div>
          </div>

          <LeadCaptureForm
            title="Start a Marketplace Request"
            description="Share your name, phone, preferred location, and whether you want to sell directly, scale as an expert, or explore investor inventory."
            submitLabel="Submit Marketplace Request"
            successMessage="Your marketplace request has been submitted successfully."
            source="sell"
            showEmail
            showLocation
            requirementSeed="I want help with a premium listing, expert enrollment, or investor shortlist."
          />
        </div>
      </section>
    </>
  );
};

export default PropertiesPage;
