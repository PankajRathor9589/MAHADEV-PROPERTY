import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Home,
  Landmark,
  MapPin,
  MessageCircleMore,
  Phone,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRound
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BrandMark from "../components/BrandMark.jsx";
import LeadCaptureForm from "../components/LeadCaptureForm.jsx";
import PropertyCard from "../components/PropertyCard.jsx";
import Reveal from "../components/Reveal.jsx";
import {
  COMPANY_INFO,
  CONTACT_SERVICE_OPTIONS,
  FEATURED_FALLBACK_PROPERTIES,
  HERO_STATS,
  SERVICE_PILLARS,
  TRUST_DESCRIPTIONS,
  WHY_CHOOSE_US
} from "../data/siteContent.js";
import { API_BASE_URL, fetchProperties } from "../services/api.js";
import { toPhoneHref, toWhatsAppHref } from "../utils/format.js";

const serviceIcons = {
  map: Landmark,
  home: Home,
  building: Building2,
  investment: TrendingUp
};

const valueIcons = {
  sparkles: Sparkles,
  shield: ShieldCheck,
  pin: MapPin,
  support: CheckCircle2
};

const HomePage = () => {
  const [featuredProperties, setFeaturedProperties] = useState(FEATURED_FALLBACK_PROPERTIES);
  const [loadingProperties, setLoadingProperties] = useState(Boolean(API_BASE_URL));
  const [propertyMode, setPropertyMode] = useState(API_BASE_URL ? "live" : "showcase");
  const [propertyMessage, setPropertyMessage] = useState(
    API_BASE_URL ? "" : "Showcasing a signature collection while live inventory is being connected."
  );

  useEffect(() => {
    document.title = COMPANY_INFO.metaTitle;

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute("content", COMPANY_INFO.metaDescription);
    }
  }, []);

  useEffect(() => {
    const loadProperties = async () => {
      if (!API_BASE_URL) {
        setLoadingProperties(false);
        return;
      }

      try {
        setLoadingProperties(true);
        setPropertyMessage("");
        const response = await fetchProperties({
          limit: 4,
          sort: "latest"
        });

        if (response.data?.length) {
          setFeaturedProperties(response.data);
          setPropertyMode("live");
          return;
        }

        setFeaturedProperties(FEATURED_FALLBACK_PROPERTIES);
        setPropertyMode("showcase");
        setPropertyMessage("Curated signature listings are displayed while live inventory is being refreshed.");
      } catch (error) {
        setFeaturedProperties(FEATURED_FALLBACK_PROPERTIES);
        setPropertyMode("showcase");
        setPropertyMessage(error.message || "Live inventory is syncing. Showing the signature collection instead.");
      } finally {
        setLoadingProperties(false);
      }
    };

    loadProperties();
  }, []);

  return (
    <>
      <section className="section-shell pb-8 pt-8">
        <div className="relative overflow-hidden rounded-[40px] border border-white/12 shadow-glass">
          <img
            src={COMPANY_INFO.heroImage}
            alt="Luxury real estate skyline by SAGAR INFRA"
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(5,13,28,0.88)_10%,rgba(5,13,28,0.64)_45%,rgba(5,13,28,0.28)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.18),transparent_28%)]" />
          <div className="floating-glow absolute -left-16 top-20 h-52 w-52 rounded-full bg-gold-400/18 blur-3xl" />
          <div className="floating-glow absolute bottom-10 right-0 h-56 w-56 rounded-full bg-navy-400/28 blur-3xl" />

          <Reveal className="absolute right-6 top-6 z-10 hidden md:block" delay={0.25} y={18}>
            <div className="glass-panel min-w-[260px] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-gold-300">Direct Contact</p>
              <div className="mt-4 space-y-3">
                <p className="inline-flex items-center gap-3 text-white">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.08] text-gold-200">
                    <UserRound size={18} />
                  </span>
                  <span>
                    <span className="block text-sm text-white/60">Owner</span>
                    <span className="text-lg font-semibold">{COMPANY_INFO.owner}</span>
                  </span>
                </p>
                <a href={toPhoneHref(COMPANY_INFO.phoneDisplay)} className="inline-flex items-center gap-3 text-white">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.08] text-gold-200">
                    <Phone size={18} />
                  </span>
                  <span>
                    <span className="block text-sm text-white/60">Call</span>
                    <span className="text-lg font-semibold">{COMPANY_INFO.phoneDisplay}</span>
                  </span>
                </a>
              </div>
            </div>
          </Reveal>

          <div className="relative grid min-h-[740px] items-end gap-8 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-12 lg:py-12">
            <Reveal className="max-w-3xl" delay={0.05}>
              <div className="glass-panel p-7 sm:p-9 lg:p-10">
                <BrandMark showWordmark={false} compact />
                <p className="section-kicker mt-6">Luxury Real Estate Advisory</p>
                <h1 className="hero-title mt-5">{COMPANY_INFO.name}</h1>
                <p className="mt-3 font-display text-3xl italic text-white/92 sm:text-4xl">
                  {COMPANY_INFO.tagline}
                </p>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                  {COMPANY_INFO.serviceLine}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link to="/properties" className="btn-primary w-full sm:w-auto">
                    Explore Properties
                    <ArrowRight size={16} />
                  </Link>
                  <Link to="/#contact" className="btn-ghost w-full sm:w-auto">
                    Contact Now
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  {TRUST_DESCRIPTIONS.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/[0.08] px-4 py-2 text-xs font-medium text-white/80 backdrop-blur-xl"
                    >
                      <ShieldCheck size={14} className="text-gold-300" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal className="lg:justify-self-end" delay={0.18} y={36}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="glass-panel max-w-[380px] p-6"
              >
                <p className="section-kicker">Signature Portfolio</p>
                <h2 className="mt-3 text-4xl font-semibold leading-none text-gradient-gold">Prime. Polished. Trusted.</h2>
                <p className="mt-4 text-sm leading-7 text-white/72">
                  A high-end brand presence built for buyers who value clarity, location quality, and a more premium
                  real estate experience.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {HERO_STATS.map((item) => (
                    <div key={item.label} className="rounded-[24px] border border-white/12 bg-white/[0.06] p-4">
                      <p className="text-xl font-semibold text-white">{item.value}</p>
                      <p className="mt-2 text-sm leading-6 text-white/60">{item.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="services" className="section-shell pt-6">
        <SectionHeading
          kicker="Services"
          title="Luxury advisory tailored to the real estate decisions that matter most"
          copy="Every service is presented like a premium brand touchpoint, with glassmorphism cards, clear positioning, and direct action paths."
        />

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {SERVICE_PILLARS.map((item, index) => {
            const Icon = serviceIcons[item.icon] || Building2;

            return (
              <Reveal
                key={item.title}
                delay={index * 0.08}
                className="glass-panel h-full p-6 transition duration-500 hover:-translate-y-2 hover:border-gold-300/40"
              >
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold-300/40 bg-gold-400/16 text-gold-100">
                  <Icon size={24} />
                </span>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.34em] text-gold-300">{item.eyebrow}</p>
                <h3 className="mt-3 text-3xl font-semibold text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/70">{item.description}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section id="properties" className="section-shell pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            kicker={propertyMode === "live" ? "Live Inventory" : "Signature Collection"}
            title="Premium property showcases designed to feel like a luxury real estate campaign"
            copy="Elegant imagery, cinematic overlays, and conversion-ready cards keep the browsing experience premium on every screen."
          />
          <Link to="/properties" className="btn-ghost w-full sm:w-auto">
            Explore All Listings
            <ArrowRight size={16} />
          </Link>
        </div>

        {loadingProperties ? <p className="mt-6 text-sm text-white/68">Loading signature properties...</p> : null}
        {propertyMessage ? (
          <p className="mt-6 rounded-full border border-gold-300/20 bg-gold-400/10 px-4 py-3 text-sm text-gold-100">
            {propertyMessage}
          </p>
        ) : null}

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredProperties.map((property, index) => (
            <Reveal key={property._id || property.title} delay={index * 0.08}>
              <PropertyCard property={property} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-shell pt-8">
        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <Reveal className="overflow-hidden rounded-[36px] border border-white/12 shadow-glass" delay={0.05}>
            <div className="relative h-full min-h-[520px]">
              <img
                src="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80"
                alt="Premium residence interior by SAGAR INFRA"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,13,28,0.12),rgba(5,13,28,0.88))]" />
              <div className="absolute inset-x-6 bottom-6 rounded-[28px] border border-white/14 bg-navy-950/58 p-6 backdrop-blur-2xl">
                <p className="section-kicker">Why Clients Choose Us</p>
                <p className="mt-4 text-4xl font-semibold text-white">A premium look paired with grounded local trust</p>
                <p className="mt-4 text-sm leading-7 text-white/72">
                  The brand experience feels elevated, while the advice remains practical, transparent, and owner-led.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="space-y-6">
            <SectionHeading
              kicker="Why Choose Us"
              title="Designed to communicate quality, reliability, and real market understanding"
              copy="These pillars help SAGAR INFRA feel premium without losing trust, warmth, or local clarity."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              {WHY_CHOOSE_US.map((item, index) => {
                const Icon = valueIcons[item.icon] || Sparkles;

                return (
                  <Reveal
                    key={item.title}
                    delay={index * 0.08}
                    className="glass-panel h-full p-6 transition duration-500 hover:-translate-y-2 hover:border-gold-300/40"
                  >
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold-300/40 bg-gold-400/14 text-gold-100">
                      <Icon size={20} />
                    </span>
                    <h3 className="mt-5 text-3xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-white/70">{item.description}</p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section-shell">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Reveal className="glass-panel surface-grid p-7 sm:p-8" delay={0.05}>
            <p className="section-kicker">Contact</p>
            <h2 className="mt-3 text-5xl font-semibold leading-none text-white">Talk to a premium property advisor</h2>
            <p className="mt-5 text-sm leading-8 text-white/72 sm:text-base">
              Whether you are exploring land, a family home, or a commercial address, SAGAR INFRA is ready with a
              luxury-grade presentation and local market clarity.
            </p>

            <div className="mt-8 rounded-[30px] border border-gold-300/20 bg-gold-400/10 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.34em] text-gold-200">Call Now</p>
              <a
                href={toPhoneHref(COMPANY_INFO.phoneDisplay)}
                className="mt-4 inline-flex text-4xl font-semibold tracking-[0.08em] text-white"
              >
                {COMPANY_INFO.phoneDisplay}
              </a>
              <p className="mt-3 text-sm text-white/68">Directly with {COMPANY_INFO.owner}</p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[26px] border border-white/14 bg-white/[0.06] p-5">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-gold-200">
                  <MapPin size={16} />
                  Prime Market Focus
                </p>
                <p className="mt-3 text-sm leading-7 text-white/70">{COMPANY_INFO.location}</p>
              </div>
              <div className="rounded-[26px] border border-white/14 bg-white/[0.06] p-5">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-gold-200">
                  <ShieldCheck size={16} />
                  Trusted Support
                </p>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  Fast replies, site visit coordination, and premium enquiry handling.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={toWhatsAppHref(
                  COMPANY_INFO.whatsappNumber,
                  "Hi SAGAR INFRA, I want to discuss a premium property requirement."
                )}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp w-full sm:w-auto"
              >
                <MessageCircleMore size={16} />
                WhatsApp Now
              </a>
              <a href={toPhoneHref(COMPANY_INFO.phoneDisplay)} className="btn-ghost w-full sm:w-auto">
                <Phone size={16} />
                Call Directly
              </a>
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
    {copy ? <p className="mt-4 text-sm leading-8 text-white/70 sm:text-base">{copy}</p> : null}
  </div>
);

export default HomePage;
