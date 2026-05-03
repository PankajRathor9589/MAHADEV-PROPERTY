import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Home,
  Landmark,
  MapPin,
  MessageCircleMore,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandMark from "../components/BrandMark.jsx";
import LeadCaptureForm from "../components/LeadCaptureForm.jsx";
import PropertyCard from "../components/PropertyCard.jsx";
import ResponsiveImage from "../components/ResponsiveImage.jsx";
import Reveal from "../components/Reveal.jsx";
import Seo from "../components/Seo.jsx";
import {
  BUYER_JOURNEY,
  COMPANY_INFO,
  CONTACT_SERVICE_OPTIONS,
  CONTRACTOR_PROJECTS,
  HERO_STATS,
  HOME_TRUST_PILLARS,
  MARKET_HIGHLIGHTS,
  SEARCH_BUDGET_OPTIONS,
  SERVICE_PILLARS,
  TESTIMONIAL_STYLE_NOTES,
  TRUST_DESCRIPTIONS
} from "../data/siteContent.js";
import { API_BASE_URL, fetchProperties } from "../services/api.js";
import { toPhoneHref, toWhatsAppHref } from "../utils/format.js";

const serviceIcons = {
  map: Landmark,
  home: Home,
  building: Building2,
  investment: TrendingUp
};

const budgetRangeToParams = (value) => {
  if (!value) {
    return {};
  }

  const [minPrice, maxPrice] = String(value).split("-");
  return {
    ...(minPrice ? { minPrice } : {}),
    ...(maxPrice ? { maxPrice } : {})
  };
};

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(Boolean(API_BASE_URL));
  const [propertyMode, setPropertyMode] = useState(API_BASE_URL ? "featured" : "unavailable");
  const [propertyMessage, setPropertyMessage] = useState(
    API_BASE_URL ? "" : "Live property inventory is unavailable until the API is configured for this deployment."
  );
  const [searchForm, setSearchForm] = useState({
    location: "",
    type: "",
    budget: ""
  });

  useEffect(() => {
    const loadProperties = async () => {
      if (!API_BASE_URL) {
        setLoadingProperties(false);
        return;
      }

      try {
        setLoadingProperties(true);
        setPropertyMessage("");
        const featuredResponse = await fetchProperties({
          featured: true,
          limit: 3,
          sort: "latest"
        });
        let nextProperties = featuredResponse.data || [];

        if (!nextProperties.length) {
          const latestResponse = await fetchProperties({
            limit: 3,
            sort: "latest"
          });
          nextProperties = latestResponse.data || [];
          setPropertyMode("latest");
        } else {
          setPropertyMode("featured");
        }

        setFeaturedProperties(nextProperties);

        if (!nextProperties.length) {
          setPropertyMessage("No live properties have been published yet. Add the first listing from the admin dashboard.");
        }
      } catch (error) {
        setFeaturedProperties([]);
        setPropertyMode("unavailable");
        setPropertyMessage(error.message || "Live inventory is temporarily unavailable.");
      } finally {
        setLoadingProperties(false);
      }
    };

    loadProperties();
  }, []);

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchForm((current) => ({ ...current, [name]: value }));
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const nextParams = new URLSearchParams({
      sort: "latest"
    });

    if (searchForm.location.trim()) {
      nextParams.set("location", searchForm.location.trim());
    }

    if (searchForm.type) {
      nextParams.set("type", searchForm.type);
    }

    const budgetParams = budgetRangeToParams(searchForm.budget);
    Object.entries(budgetParams).forEach(([key, value]) => nextParams.set(key, value));

    navigate(`/properties?${nextParams.toString()}`);
  };

  return (
    <>
      <Seo
        title={COMPANY_INFO.metaTitle}
        description={COMPANY_INFO.metaDescription}
        canonical={COMPANY_INFO.canonicalUrl}
        image={`${COMPANY_INFO.canonicalUrl}/og-image.svg`}
        keywords={COMPANY_INFO.metaKeywords}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: COMPANY_INFO.name,
          telephone: `+${COMPANY_INFO.phoneIntl}`,
          url: COMPANY_INFO.canonicalUrl,
          areaServed: COMPANY_INFO.location
        }}
      />

      <section className="relative isolate -mt-[5.4rem] min-h-screen overflow-hidden pt-[5.4rem]">
        <div className="absolute inset-0">
          <ResponsiveImage
            src={COMPANY_INFO.heroImage}
            alt="Premium property backdrop by Sagar Infra"
            className="h-full w-full object-cover object-center md:object-[center_35%]"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            sizes="100vw"
            widths={[640, 960, 1280, 1600, 1920]}
            transformOptions={{ quality: 82 }}
          />
          {COMPANY_INFO.heroVideo ? (
            <video
              className="absolute inset-0 hidden h-full w-full object-cover lg:block"
              src={COMPANY_INFO.heroVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={COMPANY_INFO.heroImage}
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(12,18,28,0.84)_12%,rgba(12,18,28,0.58)_42%,rgba(12,18,28,0.36)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.22),transparent_26%)]" />
          <div className="floating-glow absolute -left-16 top-20 h-56 w-56 rounded-full bg-gold-400/18 blur-3xl" />
          <div className="floating-glow absolute bottom-12 right-0 h-64 w-64 rounded-full bg-white/12 blur-3xl" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100vh-5.4rem)] w-full max-w-[1320px] items-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid w-full gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <Reveal className="max-w-4xl" delay={0.05}>
              <div className="rounded-[40px] border border-white/12 bg-white/[0.08] p-7 text-white shadow-[0_28px_80px_rgba(7,12,22,0.26)] backdrop-blur-2xl sm:p-9 lg:p-10">
                <BrandMark showWordmark={false} compact tone="light" />
                <p className="section-kicker mt-6 text-gold-200">Premium Property Platform</p>
                <h1 className="hero-title mt-5">{COMPANY_INFO.heroHeadline}</h1>
                <p className="mt-4 max-w-2xl font-display text-2xl italic text-white/90 sm:text-3xl lg:text-[2.6rem]">
                  {COMPANY_INFO.heroSubheadline}
                </p>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-100 sm:text-lg">
                  {COMPANY_INFO.serviceLine}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link to="/properties" className="btn-primary w-full sm:w-auto">
                    View Properties
                    <ArrowRight size={16} />
                  </Link>
                  <a
                    href={toWhatsAppHref(COMPANY_INFO.whatsappNumber, COMPANY_INFO.whatsappMessage)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-whatsapp w-full sm:w-auto"
                  >
                    <MessageCircleMore size={16} />
                    Contact on WhatsApp
                  </a>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  {TRUST_DESCRIPTIONS.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/[0.08] px-4 py-2 text-xs font-medium text-white/84 backdrop-blur-xl"
                    >
                      <ShieldCheck size={14} className="text-gold-200" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal className="lg:justify-self-end" delay={0.18} y={30}>
              <div className="glass-panel max-w-[420px] p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="section-kicker">Smart Search</p>
                    <h2 className="mt-2 text-4xl font-semibold text-ink-900">Find the right property faster</h2>
                  </div>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold-300 bg-[#f7ecd7] text-gold-700">
                    <Search size={18} />
                  </span>
                </div>

                <form className="mt-6 space-y-3" onSubmit={handleSearchSubmit}>
                  <input
                    className="input-field"
                    name="location"
                    value={searchForm.location}
                    onChange={handleSearchChange}
                    placeholder="Location"
                  />
                  <select className="input-field" name="type" value={searchForm.type} onChange={handleSearchChange}>
                    <option value="">Property type</option>
                    <option value="Plot">Plot</option>
                    <option value="House">Home</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                  </select>
                  <select className="input-field" name="budget" value={searchForm.budget} onChange={handleSearchChange}>
                    {SEARCH_BUDGET_OPTIONS.map((option) => (
                      <option key={option.label} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <button className="btn-primary w-full">
                    <Search size={16} />
                    Search Properties
                  </button>
                </form>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {HERO_STATS.map((item) => (
                    <div key={item.label} className="rounded-[24px] border border-[#eee3d4] bg-[#fbf8f2] p-4">
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold-700">{item.value}</p>
                      <p className="mt-2 text-sm leading-6 text-ink-500">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[26px] border border-[#eee3d4] bg-[#faf6ef] p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold-700">Owner Direct Contact</p>
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-ink-900">{COMPANY_INFO.owner}</p>
                      <p className="mt-1 text-sm text-ink-500">Sagar MP property advisor</p>
                    </div>
                    <a href={toPhoneHref(COMPANY_INFO.phoneDisplay)} className="btn-secondary min-h-[46px] px-4">
                      <Phone size={16} />
                      Call
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-shell pt-8">
        <div className="grid gap-4 md:grid-cols-3">
          {MARKET_HIGHLIGHTS.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08} className="glass-panel h-full p-6">
              <p className="section-kicker">{item.title}</p>
              <p className="mt-4 text-2xl font-semibold text-ink-900">{item.title}</p>
              <p className="mt-3 text-sm leading-7 text-ink-500">{item.description}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-shell pt-4">
        <div className="grid gap-5 md:grid-cols-3">
          {HOME_TRUST_PILLARS.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08} className="glass-panel h-full p-6">
              <p className="section-kicker">{item.title}</p>
              <p className="mt-4 text-2xl font-semibold text-ink-900">{item.title}</p>
              <p className="mt-3 text-sm leading-7 text-ink-500">{item.description}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="services" className="section-shell pt-6">
        <SectionHeading
          kicker="Who We Serve"
          title="A premium real estate experience for buyers, investors, builders, and contractors"
          copy="The platform now communicates trust, quality, and responsiveness with more clarity, better spacing, and stronger conversion intent."
        />

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {BUYER_JOURNEY.map((item, index) => (
            <Reveal
              key={item.title}
              delay={index * 0.08}
              className="glass-panel h-full p-6 transition duration-500 hover:-translate-y-2 hover:border-gold-300"
            >
              <p className="section-kicker">{item.title}</p>
              <h3 className="mt-3 text-3xl font-semibold text-ink-900">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-ink-500">{item.description}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {SERVICE_PILLARS.map((item, index) => {
            const Icon = serviceIcons[item.icon] || Building2;

            return (
              <Reveal
                key={item.title}
                delay={index * 0.08}
                className="glass-panel h-full p-6 transition duration-500 hover:-translate-y-2 hover:border-gold-300"
              >
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold-300 bg-[#f7ecd7] text-gold-700">
                  <Icon size={24} />
                </span>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.34em] text-gold-700">{item.eyebrow}</p>
                <h3 className="mt-3 text-3xl font-semibold text-ink-900">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-ink-500">{item.description}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section id="properties" className="section-shell pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            kicker={
              propertyMode === "featured"
                ? "Featured Listings"
                : propertyMode === "latest"
                  ? "Latest Inventory"
                  : "Live Inventory"
            }
            title="Property cards redesigned to feel premium, trustworthy, and conversion-ready"
            copy="Each listing now prioritizes strong imagery, clear pricing, verified cues, and direct action for calls, WhatsApp, and detail views."
          />
          <Link to="/properties" className="btn-ghost w-full sm:w-auto">
            Explore All Listings
            <ArrowRight size={16} />
          </Link>
        </div>

        {loadingProperties ? <p className="mt-6 text-sm text-ink-500">Loading featured properties...</p> : null}
        {propertyMessage ? (
          <p className="mt-6 rounded-full border border-gold-300/50 bg-[#f8efdc] px-4 py-3 text-sm text-gold-800">
            {propertyMessage}
          </p>
        ) : null}

        {featuredProperties.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredProperties.map((property, index) => (
              <Reveal key={property._id || property.slug || property.title} delay={index * 0.08}>
                <PropertyCard property={property} />
              </Reveal>
            ))}
          </div>
        ) : !loadingProperties ? (
          <div className="mt-8 rounded-[30px] border border-[#e9dfd2] bg-white p-6 text-sm leading-7 text-ink-500 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
            Property cards will appear here as soon as listings are published from the admin dashboard.
          </div>
        ) : null}
      </section>

      <section className="section-shell pt-8">
        <div className="grid gap-6 xl:grid-cols-3">
          {CONTRACTOR_PROJECTS.map((project, index) => (
            <Reveal key={project.title} className="overflow-hidden rounded-[36px] border border-[#e6dccd] bg-white shadow-[0_22px_55px_rgba(15,23,42,0.08)]" delay={index * 0.08}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <ResponsiveImage
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover"
                  sizes="(min-width: 1280px) 28vw, (min-width: 768px) 44vw, 100vw"
                  widths={[480, 720, 960, 1280]}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,29,47,0.02),rgba(18,29,47,0.58))]" />
                <div className="absolute inset-x-5 bottom-5 rounded-[24px] border border-white/35 bg-white/88 p-5 backdrop-blur-xl">
                  <p className="section-kicker">{project.title}</p>
                  <p className="mt-2 text-2xl font-semibold text-ink-900">{project.title}</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm leading-7 text-ink-500">{project.description}</p>
                <div className="mt-5 grid gap-3">
                  {project.points.map((point) => (
                    <p key={point} className="inline-flex items-center gap-2 text-sm text-ink-600">
                      <CheckCircle2 size={15} className="text-gold-600" />
                      {point}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-shell pt-8">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Reveal className="glass-panel surface-grid p-7 sm:p-8" delay={0.05}>
            <p className="section-kicker">Trust Building</p>
            <h2 className="mt-3 text-5xl font-semibold leading-none text-ink-900">Designed to impress metro-city buyers without losing local trust</h2>
            <p className="mt-5 text-sm leading-8 text-ink-500 sm:text-base">
              This section uses testimonial-style trust notes without inventing client identities, so the platform feels
              premium while staying honest and credible.
            </p>

            <div className="mt-8 space-y-4">
              {TESTIMONIAL_STYLE_NOTES.map((item) => (
                <div key={item.title} className="rounded-[28px] border border-[#ece2d3] bg-white p-5 shadow-[0_14px_32px_rgba(15,23,42,0.05)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-700">{item.label}</p>
                  <p className="mt-3 text-2xl font-semibold text-ink-900">{item.title}</p>
                  <p className="mt-3 text-sm leading-7 text-ink-500">{item.quote}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <LeadCaptureForm
              title="Share Your Requirement"
              description="Tell us what you are looking for and we will arrange a direct consultation with SAGAR INFRA."
              submitLabel="Submit Requirement"
              successMessage="Thanks, your requirement has been shared successfully."
              source="contact"
              showEmail
              showLocation
              serviceOptions={CONTACT_SERVICE_OPTIONS}
              requirementSeed="I want to discuss a premium real estate requirement in Sagar."
            />
          </Reveal>
        </div>
      </section>
    </>
  );
};

const SectionHeading = ({ kicker, title, copy }) => (
  <div className="max-w-3xl">
    <p className="section-kicker">{kicker}</p>
    <h2 className="section-title mt-3">{title}</h2>
    {copy ? <p className="mt-4 text-sm leading-8 text-ink-500 sm:text-base">{copy}</p> : null}
  </div>
);

export default HomePage;
