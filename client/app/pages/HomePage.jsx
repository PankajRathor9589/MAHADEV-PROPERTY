import {
  ArrowRight,
  BadgeCheck,
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
import DocumentProofSection from "../components/DocumentProofSection.jsx";
import FeaturedPropertyCarousel from "../components/FeaturedPropertyCarousel.jsx";
import LeadCaptureForm from "../components/LeadCaptureForm.jsx";
import OwnerSection from "../components/OwnerSection.jsx";
import PropertyCard from "../components/PropertyCard.jsx";
import ServicesSection from "../components/ServicesSection.jsx";
import TrustSection from "../components/TrustSection.jsx";
import {
  ABOUT_HIGHLIGHTS,
  COMPANY_INFO,
  HERO_STATS,
  HOME_CAPABILITIES,
  TESTIMONIALS,
  mergeWithDemoProperties
} from "../data/siteContent.js";
import { fetchProperties } from "../services/api.js";
import { HERO_IMAGE, toPhoneHref, toWhatsAppHref } from "../utils/format.js";

const aboutCards = [
  {
    title: "Contractor thinking, not brochure talk",
    copy: "Sagar Infra is built around execution, timelines, discussion clarity, and documented work rather than generic sales promises.",
    icon: Building2
  },
  {
    title: "Stronger local trust in Sagar",
    copy: "Clients get fast local coordination, site availability, and direct communication grounded in the realities of Sagar projects.",
    icon: MapPin
  },
  {
    title: "Construction and land support together",
    copy: "The business covers contractor work, land development, plotting, material support, and premium property guidance under one brand.",
    icon: ShieldCheck
  }
];

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
    <div className="space-y-16 pb-2">
      <section className="section-shell">
        <div
          className="hero-shadow relative overflow-hidden rounded-[32px] border border-white/10 sm:rounded-[40px]"
          style={{
            backgroundImage: `linear-gradient(120deg, rgba(10, 17, 32, 0.96), rgba(10, 17, 32, 0.77), rgba(10, 17, 32, 0.54)), url(${HERO_IMAGE})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(250,204,21,0.18),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.16),_transparent_28%)]" />
          <div className="relative grid min-h-[78vh] gap-10 px-5 py-10 sm:px-8 sm:py-12 lg:grid-cols-[1.08fr_0.92fr] lg:px-12 lg:py-16">
            <div className="flex flex-col justify-center">
              <span className="pill w-fit border-gold-300/35 bg-gold-300/10 text-gold-100">
                Premium contractor website for {COMPANY_INFO.city}, {COMPANY_INFO.state}
              </span>
              <h1 className="hero-title mt-6">{COMPANY_INFO.name}</h1>
              <p className="mt-4 max-w-2xl text-lg font-semibold text-gold-100 sm:text-xl">{COMPANY_INFO.subtitle}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.35em] text-white/50 sm:text-sm">{COMPANY_INFO.tagline}</p>
              <p className="mt-5 max-w-3xl text-sm leading-8 text-white/68 sm:text-base">
                {COMPANY_INFO.description} Sagar Infra is built to serve clients searching for a trusted contractor and
                property partner in Sagar Madhya Pradesh, with documented work, verified contracts, direct support,
                and a premium first impression.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href={toPhoneHref(COMPANY_INFO.phoneDisplay)} className="btn-primary w-full sm:w-auto">
                  <Phone size={16} />
                  Call Now
                </a>
                <a
                  href={toWhatsAppHref(COMPANY_INFO.whatsappNumber, COMPANY_INFO.whatsappMessage)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary w-full sm:w-auto"
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </a>
              </div>

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/65">
                <a href="#services" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10">
                  Services
                  <ArrowRight size={14} />
                </a>
                <a href="#documents" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10">
                  Verified Documents
                  <ArrowRight size={14} />
                </a>
                <Link to="/properties" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10">
                  Properties
                  <ArrowRight size={14} />
                </Link>
                <a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10">
                  Contact
                  <ArrowRight size={14} />
                </a>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {HERO_STATS.map((item) => (
                  <div key={item.label} className="glass-card-strong rounded-[24px] p-5">
                    <p className="text-3xl font-bold text-gold-200">{item.value}</p>
                    <p className="mt-2 text-sm text-white/65">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {ABOUT_HIGHLIGHTS.map((item) => (
                  <span key={item} className="pill border-white/12 bg-white/5 text-white/75">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid content-end gap-4 lg:pl-6">
              {HOME_CAPABILITIES.map((item) => (
                <div key={item.title} className="glass-card-strong rounded-[28px] p-5">
                  <div className="flex items-start gap-3">
                    <span className="rounded-2xl bg-gold-300/15 p-3 text-gold-100">
                      <BadgeCheck size={18} />
                    </span>
                    <div>
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="mt-2 text-sm leading-7 text-white/60">{item.copy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TrustSection />

      <section id="about" className="section-shell grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="card surface-grid space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-200/80">About Us</p>
          <h2 className="section-title">A stronger digital presence for a contractor clients can trust in Sagar Madhya Pradesh</h2>
          <p className="text-sm leading-8 text-white/65">
            Sagar Infra is positioned as a contractor-first business website that highlights execution capability,
            government and private work readiness, local expertise, and proof-led trust. The goal is not just to look
            premium, but to help clients feel confident about making contact.
          </p>
          <p className="text-sm leading-8 text-white/65">
            That means readable mobile layouts, direct owner contact, visible documentation cues, strong service
            clarity, and property access without losing the construction and infrastructure identity of the brand.
          </p>
        </div>

        <div className="grid gap-4">
          {aboutCards.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className="card card-hover">
                <span className="inline-flex rounded-2xl bg-gold-300/12 p-3 text-gold-100">
                  <Icon size={18} />
                </span>
                <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/62">{item.copy}</p>
              </article>
            );
          })}
        </div>
      </section>

      <OwnerSection />

      <ServicesSection />

      <DocumentProofSection />

      <section className="section-shell space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-200/80">Featured Properties</p>
            <h2 className="section-title mt-2">Premium property options alongside contractor services in Sagar Madhya Pradesh</h2>
          </div>
          <Link to="/properties" className="btn-secondary w-full sm:w-auto">
            Explore All
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-white/60">Loading featured properties...</p>
        ) : (
          <FeaturedPropertyCarousel properties={featuredProperties} />
        )}
      </section>

      <section id="properties" className="section-shell space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-200/80">Properties</p>
            <h2 className="section-title mt-2">Plots, homes, commercial spaces, and premium land opportunities in Sagar Madhya Pradesh</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-white/60">
            For clients who need both construction capability and verified property guidance, Sagar Infra brings both
            worlds together with a premium presentation and local response speed.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {latestProperties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      </section>

      <section className="section-shell grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="card surface-grid space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-200/80">Client Confidence</p>
            <h2 className="section-title mt-2">A premium local brand that looks powerful and feels dependable</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Government contract experience",
              "Local execution confidence",
              "Clear communication and direct access",
              "Modern presentation with transparent proof"
            ].map((item) => (
              <div key={item} className="rounded-[24px] border border-white/10 bg-slate-950/35 p-5">
                <CheckCircle2 size={18} className="text-gold-200" />
                <p className="mt-3 text-sm leading-7 text-white/62">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {TESTIMONIALS.map((testimonial) => (
            <article key={testimonial.name} className="card card-hover">
              <Sparkles size={18} className="text-gold-200" />
              <p className="mt-4 text-base leading-8 text-white/82 sm:text-lg">"{testimonial.quote}"</p>
              <div className="mt-5">
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-white/55">Client, Sagar</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="section-shell">
        <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
          <div className="card surface-grid flex flex-col justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-200/80">Contact</p>
              <h2 className="section-title mt-2">{COMPANY_INFO.owner}</h2>
              <p className="mt-3 text-lg text-gold-100">{COMPANY_INFO.name}</p>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-white/65">
                Call or message for national highway contracts, school and college construction, government projects,
                RCC roads, building construction, plot development, and verified property consultation in Sagar Madhya Pradesh.
              </p>
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
                <ContactAction title="WhatsApp" value="Get Free Consultation" icon={<MessageCircle size={18} />} />
              </a>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-slate-950/35 p-5">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-gold-100">
                <MapPin size={16} />
                {COMPANY_INFO.location}
              </p>
              <p className="mt-3 text-sm leading-7 text-white/60">
                Premium digital presence, documented trust, and strong contractor positioning for serious clients
                across Sagar, Madhya Pradesh.
              </p>
            </div>
          </div>

          <LeadCaptureForm
            title="Request Free Consultation"
            description="Share your requirement for contracts, construction, documentation discussion, land development, material supply, or property support. We will contact you quickly."
            submitLabel="Get Free Consultation"
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
    <p className="mt-3 text-xl font-semibold text-white sm:text-2xl">{value}</p>
    <p className="mt-2 text-sm text-white/55">Fast response for contractor, construction, and property enquiries.</p>
  </div>
);

export default HomePage;
