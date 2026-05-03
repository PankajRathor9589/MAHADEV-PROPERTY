import { MessageCircleMore, Phone, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import LeadCaptureForm from "../components/LeadCaptureForm.jsx";
import PropertyCard from "../components/PropertyCard.jsx";
import Reveal from "../components/Reveal.jsx";
import Seo from "../components/Seo.jsx";
import { COMPANY_INFO } from "../data/siteContent.js";
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
  const [dataSource, setDataSource] = useState(API_BASE_URL ? "live" : "unavailable");

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
      try {
        setLoading(true);
        setError("");

        const params = {
          page: Number(searchParams.get("page") || 1),
          limit: 12,
          sort: searchParams.get("sort") || "latest"
        };

        searchParams.forEach((value, key) => {
          if (key !== "page" && String(value).trim()) {
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
      <Seo
        title={`Properties | ${COMPANY_INFO.name}`}
        description="Browse live plots, homes, shops, and commercial properties from Sagar Infra."
        canonical={`${COMPANY_INFO.canonicalUrl}/properties`}
        image={`${COMPANY_INFO.canonicalUrl}/og-image.svg`}
        keywords={`properties in ${COMPANY_INFO.city}, plots in ${COMPANY_INFO.city}, ${COMPANY_INFO.metaKeywords}`}
      />

      <section className="section-shell pt-8">
        <div className="glass-panel overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
            <div>
              <p className="section-kicker">{dataSource === "live" ? "Live Marketplace" : "Inventory Status"}</p>
              <h1 className="section-title mt-3">Explore premium plots, homes, and commercial opportunities</h1>
              <p className="mt-4 max-w-3xl text-sm leading-8 text-ink-500 sm:text-base">
                The listing experience now feels cleaner and more premium, while still keeping the existing backend
                inventory, filters, and query behavior intact.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="badge border-[#e6dac6] bg-[#faf5ec] text-ink-700">{pagination.total} listings</span>
                <span className="badge border-[#e6dac6] bg-[#faf5ec] text-ink-700">Verified-first presentation</span>
                <span className="badge border-[#e6dac6] bg-[#faf5ec] text-ink-700">Call, WhatsApp, and detail actions</span>
              </div>
            </div>

            <div className="rounded-[30px] border border-[#ebe0d1] bg-[#fbf8f2] p-5">
              <p className="section-kicker">Direct Assistance</p>
              <h2 className="mt-2 text-3xl font-semibold text-ink-900">Need help shortlisting?</h2>
              <p className="mt-3 text-sm leading-7 text-ink-500">
                Connect directly with SAGAR INFRA for investor-focused suggestions, urgent site visits, or owner-level
                price discussions.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a href={toPhoneHref(COMPANY_INFO.phoneDisplay)} className="btn-secondary w-full sm:w-auto">
                  <Phone size={16} />
                  Call Now
                </a>
                <a
                  href={toWhatsAppHref(
                    COMPANY_INFO.whatsappNumber,
                    "Hi SAGAR INFRA, I want help shortlisting a property."
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
          </div>

          <form className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4" onSubmit={handleSubmit}>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-500">Search</span>
              <input
                className="input-field"
                name="search"
                value={filters.search}
                onChange={handleChange}
                placeholder="Title, landmark, city"
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

          {dataSource === "unavailable" ? (
            <p className="mt-4 text-sm text-ink-500">
              Live inventory depends on the connected backend API and published database listings.
            </p>
          ) : null}

          {activeFilterCount > 0 ? (
            <p className="mt-4 text-sm text-ink-500">{activeFilterCount} active filter(s) applied.</p>
          ) : null}
        </div>
      </section>

      <section className="section-shell pt-0">
        {loading ? <p className="text-sm text-ink-500">Loading properties...</p> : null}
        {error ? <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : null}

        {!loading ? (
          <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {properties.length > 0 ? (
                properties.map((property, index) => (
                  <Reveal key={property._id || property.slug || property.title} delay={index * 0.05}>
                    <PropertyCard property={property} />
                  </Reveal>
                ))
              ) : (
                <div className="card col-span-full text-center">
                  <p className="text-lg font-semibold text-ink-800">
                    {dataSource === "unavailable"
                      ? "Property inventory is not available right now"
                      : "No listings matched these filters"}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-ink-500">
                    {dataSource === "unavailable"
                      ? "Connect the API and publish properties from the admin dashboard to see live listings here."
                      : "Reset the filters or share your requirement and Sagar Infra can help you buy, sell, or rent the right property."}
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

      <section id="sell-property" className="section-shell">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="glass-panel p-7 sm:p-8">
            <p className="section-kicker">Sell or Invest</p>
            <h2 className="mt-3 text-5xl font-semibold leading-none text-ink-900">
              Need a premium listing strategy or a faster site visit?
            </h2>
            <p className="mt-5 text-sm leading-8 text-ink-500 sm:text-base">
              Connect directly with SAGAR INFRA for sale-side support, premium presentation guidance, or curated
              investment recommendations.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[26px] border border-[#e8decf] bg-[#fbf8f2] p-5">
                <p className="text-lg font-semibold text-ink-900">Premium Listing Experience</p>
                <p className="mt-2 text-sm leading-7 text-ink-500">
                  Clean cards, verified presentation, and strong mobile readability for serious buyers.
                </p>
              </div>
              <div className="rounded-[26px] border border-[#e8decf] bg-[#fbf8f2] p-5">
                <p className="text-lg font-semibold text-ink-900">Direct Owner Access</p>
                <p className="mt-2 text-sm leading-7 text-ink-500">
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

export default PropertiesPage;
