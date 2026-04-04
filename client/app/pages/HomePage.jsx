import {
  ArrowRight,
  Building2,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FeaturedPropertyCarousel from "../components/FeaturedPropertyCarousel.jsx";
import LeadCaptureForm from "../components/LeadCaptureForm.jsx";
import PropertyCard from "../components/PropertyCard.jsx";
import {
  ABOUT_HIGHLIGHTS,
  COMPANY_INFO,
  HERO_STATS,
  HOME_CAPABILITIES,
  SERVICE_CATEGORIES,
  TESTIMONIALS,
  WHY_CHOOSE_US,
  mergeWithDemoProperties
} from "../data/siteContent.js";
import { fetchProperties } from "../services/api.js";
import { HERO_IMAGE, toPhoneHref, toWhatsAppHref } from "../utils/format.js";

const aboutCards = [
  {
    title: "Owned and operated by Prashant Rathor",
    copy: "Clients work with a local business leader who values trust, clarity, and long-term relationships.",
    icon: Sparkles
  },
  {
    title: "Ground-level expertise in Sagar",
    copy: "From land pockets and civil work requirements to on-site coordination, local understanding drives better decisions.",
    icon: MapPin
  },
  {
    title: "Construction and property under one roof",
    copy: "Sagar Infra supports infrastructure work, material supply, plotting, and verified property opportunities with one trusted team.",
    icon: Building2
  }
];

const capabilityIcons = [Building2, ShieldCheck, MapPin];

const HomePage = () => {
  const [liveProperties, setLiveProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetchProperties({ limit: 12, sort: "latest" });
        setLiveProperties(response.data || []);
      } catch (error) {
        setLiveProperties([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const allProperties = useMemo(() => mergeWithDemoProperties(liveProperties), [liveProperties]);
  const featuredProperties = useMemo(
    () => allProperties.filter((property) => property.isFeatured).slice(0, 4),
    [allProperties]
  );
  const latestProperties = useMemo(() => allProperties.slice(0, 4), [allProperties]);

  return (
    <div className="space-y-16">
      <section className="section-shell">
        <div
          className="hero-shadow relative overflow-hidden rounded-[40px] border border-white/10"
          style={{
            backgroundImage: `linear-gradient(120deg, rgba(5, 10, 18, 0.95), rgba(5, 10, 18, 0.72), rgba(5, 10, 18, 0.45)), url(${HERO_IMAGE})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(223,159,40,0.22),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(82,123,217,0.18),_transparent_28%)]" />
          <div className="relative grid min-h-[78vh] gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[1.08fr_0.92fr] lg:px-12 lg:py-16">
            <div className="flex flex-col justify-center">
              <span className="pill w-fit border-gold-300/35 bg-gold-300/10 text-gold-100">
                Based in {COMPANY_INFO.city}, {COMPANY_INFO.state}
              </span>
              <h1 className="mt-6 font-display text-6xl font-semibold leading-none text-white sm:text-7xl">
                {COMPANY_INFO.name}
              </h1>
              <p className="mt-4 text-xl font-semibold text-gold-100">{COMPANY_INFO.subtitle}</p>
              <p className="mt-3 text-base uppercase tracking-[0.22em] text-white/55">{COMPANY_INFO.tagline}</p>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">
                {COMPANY_INFO.description} Owned and operated by {COMPANY_INFO.owner}, the company is built to deliver
                trust, quality, and responsive support for clients across Sagar.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/properties" className="btn-primary">
                  View Properties
                  <ArrowRight size={16} />
                </Link>
                <a href="#contact" className="btn-secondary">
                  Contact Now
                </a>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {HERO_STATS.map((item) => (
                  <div key={item.label} className="rounded-[26px] border border-white/10 bg-white/5 p-5 backdrop-blur">
                    <p className="text-3xl font-bold text-gold-200">{item.value}</p>
                    <p className="mt-2 text-sm text-white/65">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {ABOUT_HIGHLIGHTS.map((item) => (
                  <span key={item} className="pill border-white/10 bg-white/5 text-white/70">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid content-end gap-4 lg:pl-8">
              {HOME_CAPABILITIES.map((item, index) => {
                const Icon = capabilityIcons[index % capabilityIcons.length];

                return (
                  <div key={item.title} className="glass-panel rounded-[28px] p-5">
                    <div className="flex items-start gap-3">
                      <span className="rounded-2xl bg-gold-300/15 p-3 text-gold-100">
                        <Icon size={18} />
                      </span>
                      <div>
                        <p className="font-semibold text-white">{item.title}</p>
                        <p className="mt-1 text-sm leading-7 text-white/60">{item.copy}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="section-shell grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="card surface-grid">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-200/80">About Us</p>
          <h2 className="mt-2 font-display text-4xl font-semibold text-white">A trusted local company built for long-term confidence</h2>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-white/65">
            Sagar Infra is owned and operated by {COMPANY_INFO.owner} and serves clients across Sagar, Madhya Pradesh
            with a practical mix of construction expertise and real estate guidance. The business focuses on trust,
            quality workmanship, dependable communication, and local knowledge that helps clients move with clarity.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-white/65">
            Whether someone is planning a civil project, exploring plotting opportunities, seeking material supply, or
            looking for a verified property, Sagar Infra is positioned as a responsive local partner rather than a
            generic listings brand.
          </p>
        </div>

        <div className="grid gap-4">
          {aboutCards.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="card">
                <span className="inline-flex rounded-2xl bg-gold-300/12 p-3 text-gold-100">
                  <Icon size={18} />
                </span>
                <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/62">{item.copy}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="services" className="section-shell space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-200/80">Services</p>
            <h2 className="mt-2 font-display text-4xl font-semibold text-white">Construction, infrastructure, and real estate support</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-white/60">
            Built to serve both project execution and property needs with a polished, trust-first client experience.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {SERVICE_CATEGORIES.map((service, index) => (
            <article key={service.title} className="card surface-grid">
              <span className="inline-flex w-fit rounded-full border border-gold-300/20 bg-gold-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-100">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-xl font-semibold text-white">{service.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/62">{service.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-200/80">Featured Properties</p>
            <h2 className="mt-2 font-display text-4xl font-semibold text-white">Selected opportunities from our property portfolio</h2>
          </div>
          <Link to="/properties" className="btn-secondary">
            Explore All
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? <p className="text-sm text-white/60">Loading featured properties...</p> : <FeaturedPropertyCarousel properties={featuredProperties} />}
      </section>

      <section id="properties" className="section-shell space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-200/80">Properties</p>
            <h2 className="mt-2 font-display text-4xl font-semibold text-white">Available plots, homes, shops, and premium addresses</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-white/60">
            Verified options in Sagar supported by direct assistance from {COMPANY_INFO.owner} and the Sagar Infra team.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {latestProperties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      </section>

      <section className="section-shell grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="card space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-200/80">Why Choose Us</p>
            <h2 className="mt-2 font-display text-4xl font-semibold text-white">Premium presentation backed by practical local trust</h2>
          </div>
          <div className="grid gap-4">
            {WHY_CHOOSE_US.map((item) => (
              <div key={item.title} className="rounded-[24px] border border-white/10 bg-slate-950/35 p-5">
                <CheckCircle2 size={18} className="text-gold-200" />
                <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-white/60">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {TESTIMONIALS.map((testimonial) => (
            <article key={testimonial.name} className="card">
              <Sparkles size={18} className="text-gold-200" />
              <p className="mt-4 text-lg leading-8 text-white/82">"{testimonial.quote}"</p>
              <div className="mt-5">
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-white/55">Client, Sagar</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="section-shell">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <div className="card surface-grid flex flex-col justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-200/80">Contact</p>
              <h2 className="mt-2 font-display text-4xl font-semibold text-white">{COMPANY_INFO.owner}</h2>
              <p className="mt-3 text-lg text-gold-100">{COMPANY_INFO.name}</p>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-white/65">
                Call or message for construction projects, government contracts, road work, material supply, plotting,
                property visits, and civil work requirements in and around Sagar.
              </p>
              <p className="mt-4 text-sm text-white/55">{COMPANY_INFO.address}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <a href={toPhoneHref(COMPANY_INFO.phoneDisplay)} className="rounded-[26px] border border-white/10 bg-white/5 p-5 transition hover:bg-white/8">
                <ContactAction title="Call Now" value={COMPANY_INFO.phoneDisplay} icon={<Phone size={18} />} />
              </a>
              <a
                href={toWhatsAppHref(COMPANY_INFO.whatsappNumber, COMPANY_INFO.whatsappMessage)}
                target="_blank"
                rel="noreferrer"
                className="rounded-[26px] border border-white/10 bg-white/5 p-5 transition hover:bg-white/8"
              >
                <ContactAction title="WhatsApp" value="Chat instantly" icon={<MessageCircle size={18} />} />
              </a>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-slate-950/35 p-5">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-gold-100">
                <MapPin size={16} />
                {COMPANY_INFO.location}
              </p>
              <p className="mt-3 text-sm leading-7 text-white/60">
                Serving local clients with a premium digital presence and a practical on-ground approach in Sagar,
                Madhya Pradesh.
              </p>
            </div>
          </div>

          <LeadCaptureForm
            title="Share Your Requirement"
            description="Tell us about your construction work, tender support, land enquiry, material supply need, or property requirement. We will contact you quickly."
            submitLabel="Send Enquiry"
            successMessage="Thanks, Sagar Infra will contact you shortly."
            source="contact"
          />
        </div>
      </section>
    </div>
  );
};

const ContactAction = ({ title, value, icon }) => (
  <div>
    <p className="inline-flex items-center gap-2 text-sm font-semibold text-gold-100">
      {icon}
      {title}
    </p>
    <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    <p className="mt-2 text-sm text-white/55">Quick response for construction, tender, and property enquiries.</p>
  </div>
);

export default HomePage;
