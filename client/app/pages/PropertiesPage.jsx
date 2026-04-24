import { MessageCircleMore, Phone, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import LeadCaptureForm from "../components/LeadCaptureForm.jsx";
import PropertyCard from "../components/PropertyCard.jsx";
import Reveal from "../components/Reveal.jsx";
import { COMPANY_INFO, FEATURED_FALLBACK_PROPERTIES } from "../data/siteContent.js";
import { API_BASE_URL, fetchProperties } from "../services/api.js";
import { toPhoneHref, toWhatsAppHref } from "../utils/format.js";

const initialFilters = {
  search: "",
  location: "",
  type: "",
  listingType: "",
  minPrice: "",
  maxPrice: "",
  sort: "latest"
};

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(initialFilters);
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dataSource, setDataSource] = useState(API_BASE_URL ? "live" : "showcase");

  useEffect(() => {
    document.title = `Properties | ${COMPANY_INFO.metaTitle}`;
  }, []);

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
    const loadProperties = async () => {
      const nextFilters = { ...initialFilters };

      Object.keys(nextFilters).forEach((key) => {
        if (searchParams.has(key)) {
          nextFilters[key] = searchParams.get(key) || "";
        }
      });

      try {
        setLoading(true);
        setError("");

        if (!API_BASE_URL) {
          const showcaseProperties = applyShowcaseFilters(FEATURED_FALLBACK_PROPERTIES, {
            ...nextFilters,
            page: Number(searchParams.get("page") || 1)
          });

          setProperties(showcaseProperties);
          setPagination({
            page: 1,
            pages: 1,
            total: showcaseProperties.length
          });
          setDataSource("showcase");
          return;
        }

        const params = {
          page: Number(searchParams.get("page") || 1),
          limit: 16,
          sort: searchParams.get("sort") || "latest"
        };

        searchParams.forEach((value, key) => {
          if (key !== "page" && String(value).trim()) {
            params[key] = value;
          }
        });

        const response = await fetchProperties(params);
        const liveProperties = response.data || [];

        if (liveProperties.length) {
          setProperties(liveProperties);
          setPagination(
            response.pagination || {
              page: 1,
              pages: 1,
              total: 0
            }
          );
          setDataSource("live");
          return;
        }

        const showcaseProperties = applyShowcaseFilters(FEATURED_FALLBACK_PROPERTIES, {
          ...nextFilters,
          page: Number(searchParams.get("page") || 1)
        });
        setProperties(showcaseProperties);
        setPagination({
          page: 1,
          pages: 1,
          total: showcaseProperties.length
        });
        setDataSource("showcase");
      } catch (loadError) {
        const showcaseProperties = applyShowcaseFilters(FEATURED_FALLBACK_PROPERTIES, {
          ...nextFilters,
          page: Number(searchParams.get("page") || 1)
        });

        setError(loadError.message);
        setProperties(showcaseProperties);
        setPagination({
          page: 1,
          pages: 1,
          total: showcaseProperties.length
        });
        setDataSource("showcase");
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [searchParams]);

  const activeFilterCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === "sort") {
        return value && value !== "latest";
      }

      return String(value).trim() !== "";
    }).length;
  }, [filters]);

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
    <>
      <section className="section-shell pt-8">
        <div className="rounded-[36px] border border-white/12 bg-white/[0.05] p-6 shadow-glass backdrop-blur-2xl sm:p-8 lg:p-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="section-kicker">{dataSource === "live" ? "Live Inventory" : "Signature Showcase"}</p>
              <h1 className="section-title mt-3">Browse premium plots, homes, shops, and commercial opportunities</h1>
              <p className="mt-4 text-sm leading-8 text-white/70 sm:text-base">
                Explore a luxury-styled listings experience with strong filters, cinematic cards, and direct enquiry
                actions built for real buyers in Sagar.
              </p>
            </div>

            <div className="rounded-full border border-gold-300/20 bg-gold-400/10 px-5 py-3 text-sm font-semibold text-gold-100">
              {pagination.total} {dataSource === "live" ? "live" : "signature"} listings
            </div>
          </div>

          <form className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4" onSubmit={handleSubmit}>
            <input
              className="input-field"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search title, landmark, city"
            />

            <input
              className="input-field"
              name="location"
              value={filters.location}
              onChange={handleChange}
              placeholder="Location"
            />

            <select className="input-field" name="type" value={filters.type} onChange={handleChange}>
              <option value="">All types</option>
              <option value="Plot">Plot</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Commercial">Commercial</option>
              <option value="Villa">Villa</option>
            </select>

            <select className="input-field" name="listingType" value={filters.listingType} onChange={handleChange}>
              <option value="">Buy or Rent</option>
              <option value="sale">Buy Property</option>
              <option value="rent">Rent Property</option>
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

            <div className="flex flex-col gap-3 md:col-span-2 xl:col-span-1 xl:flex-row">
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

          {dataSource === "showcase" ? (
            <p className="mt-4 text-sm text-white/60">
              Showcasing curated signature inventory while live backend inventory is unavailable or still being
              refreshed.
            </p>
          ) : null}

          {activeFilterCount > 0 ? (
            <p className="mt-4 text-sm text-white/60">{activeFilterCount} active filter(s) applied.</p>
          ) : null}
        </div>
      </section>

      <section className="section-shell pt-0">
        {loading ? <p className="text-sm text-white/68">Loading properties...</p> : null}
        {error ? <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : null}

        {!loading ? (
          <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {properties.length > 0 ? (
                properties.map((property, index) => (
                  <Reveal key={property._id || property.title} delay={index * 0.05}>
                    <PropertyCard property={property} />
                  </Reveal>
                ))
              ) : (
                <div className="card col-span-full text-center">
                  <p className="text-lg font-semibold text-ink-800">No listings matched these filters</p>
                  <p className="mt-2 text-sm leading-7 text-ink-500">
                    Reset the filters or share your requirement and Sagar Infra can help you buy, sell, or rent the
                    right property.
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
                <span className="text-sm text-white/60">
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

      <section id="sell-property" className="section-shell">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="glass-panel p-7 sm:p-8">
            <p className="section-kicker">Sell or Invest</p>
            <h2 className="mt-3 text-5xl font-semibold leading-none text-white">
              Need a premium listing strategy or a faster site visit?
            </h2>
            <p className="mt-5 text-sm leading-8 text-white/70 sm:text-base">
              Connect directly with SAGAR INFRA for sale-side support, premium presentation guidance, or curated
              investment recommendations.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[26px] border border-white/12 bg-white/[0.08] p-5">
                <p className="text-lg font-semibold text-white">Premium Listing Experience</p>
                <p className="mt-2 text-sm leading-7 text-white/68">
                  Clean cards, verified presentation, and strong mobile readability for serious buyers.
                </p>
              </div>
              <div className="rounded-[26px] border border-white/12 bg-white/[0.08] p-5">
                <p className="text-lg font-semibold text-white">Direct Owner Access</p>
                <p className="mt-2 text-sm leading-7 text-white/68">
                  Serious enquiries can move to calls, WhatsApp, and site visits without a complicated funnel.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href={toPhoneHref(COMPANY_INFO.phoneDisplay)} className="btn-primary w-full sm:w-auto">
                <Phone size={16} />
                Call Now
              </a>
              <a
                href={toWhatsAppHref(
                  COMPANY_INFO.whatsappNumber,
                  "Hi SAGAR INFRA, I want to sell a property or discuss an investment."
                )}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp w-full sm:w-auto"
              >
                <MessageCircleMore size={16} />
                WhatsApp
              </a>
            </div>
          </div>

          <LeadCaptureForm
            title="Start a Sell Request"
            description="Submit your name, phone, preferred location, and selling or investment requirement."
            submitLabel="Submit Sell Request"
            successMessage="Your sell request has been submitted successfully."
            source="sell"
            showEmail
            showLocation
            requirementSeed="I want to sell my property through Sagar Infra."
          />
        </div>
      </section>
    </>
  );
};

const applyShowcaseFilters = (properties, filters) => {
  let nextProperties = [...properties];
  const searchTerm = String(filters.search || "").trim().toLowerCase();
  const locationTerm = String(filters.location || "").trim().toLowerCase();
  const type = String(filters.type || "").trim().toLowerCase();
  const listingType = String(filters.listingType || "").trim().toLowerCase();
  const minPrice = Number(filters.minPrice || 0);
  const maxPrice = Number(filters.maxPrice || 0);

  if (searchTerm) {
    nextProperties = nextProperties.filter((property) =>
      [property.title, property.description, property.category, property.location?.address, property.location?.city]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(searchTerm))
    );
  }

  if (locationTerm) {
    nextProperties = nextProperties.filter((property) =>
      [property.location?.address, property.location?.city, property.location?.state]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(locationTerm))
    );
  }

  if (type) {
    nextProperties = nextProperties.filter((property) => String(property.category || "").toLowerCase() === type);
  }

  if (listingType) {
    nextProperties = nextProperties.filter(
      (property) => String(property.listingType || "").toLowerCase() === listingType
    );
  }

  if (minPrice) {
    nextProperties = nextProperties.filter((property) => Number(property.price || 0) >= minPrice);
  }

  if (maxPrice) {
    nextProperties = nextProperties.filter((property) => Number(property.price || 0) <= maxPrice);
  }

  switch (filters.sort) {
    case "priceAsc":
      nextProperties.sort((left, right) => Number(left.price || 0) - Number(right.price || 0));
      break;
    case "priceDesc":
      nextProperties.sort((left, right) => Number(right.price || 0) - Number(left.price || 0));
      break;
    case "popular":
      nextProperties.sort((left, right) => Number(right.isFeatured) - Number(left.isFeatured));
      break;
    default:
      break;
  }

  return nextProperties;
};

export default PropertiesPage;
