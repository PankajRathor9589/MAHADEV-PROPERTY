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
    title: "Contractor-first approach",
    copy: "The website is built around practical project clarity, direct communication, and proof-led trust instead of generic sales talk.",
    icon: Building2
  },
  {
    title: "Strong local presence",
    copy: "Clients in Sagar get faster site coordination, quicker follow-up, and more confidence because the brand is locally rooted.",
    icon: MapPin
  },
  {
    title: "Construction + property together",
    copy: "The same brand supports contractor work, verified properties, plotting, and consultation, which makes the experience easier to trust.",
    icon: ShieldCheck
  }
];

const confidencePoints = [
  "Government contract experience",
  "Construction and property support under one brand",
  "Verified documents with privacy-safe previews",
  "Direct owner communication in Sagar MP"
];

const contractOptions = [
  { label: "National Highway Projects", value: "National Highway Projects" },
  { label: "School & College Construction", value: "School & College Construction" },
  { label: "Government Contracts", value: "Government Contracts" }
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
    () => {
      const featured = allProperties.filter((property) => property.isFeatured).slice(0, 4);
      return featured.length > 0 ? featured : allProperties.slice(0, 4);
    },
    [allProperties]
  );
  const latestProperties = useMemo(() => allProperties.slice(0, 4), [allProperties]);

  return (
    <div className="space-y-16 pb-4">
      <section className="section-shell">
        <div className="hero-shadow relative overflow-hidden rounded-[32px] border border-brand-100 bg-white">
          <div className="absolute -left-16 top-0 h-48 w-48 rounded-full bg-brand-100 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-[#f5e4bf] blur-3xl" />

          <div className="relative grid gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-14">
            <div className="flex flex-col justify-center">
              <span className="pill w-fit">Trusted contractor and property support in {COMPANY_INFO.city}, {COMPANY_INFO.state}</span>
              <h1 className="hero-title mt-6">{COMPANY_INFO.name}</h1>
              <p className="mt-4 max-w-2xl text-lg font-semibold text-brand-700 sm:text-xl">{COMPANY_INFO.subtitle}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.35em] text-ink-400 sm:text-sm">{COMPANY_INFO.tagline}</p>
              <p className="mt-5 max-w-3xl text-sm leading-8 text-ink-500 sm:text-base">
                {COMPANY_INFO.description} We help clients looking for government contracts, construction support,
                verified plots, and trusted local property guidance in Sagar Madhya Pradesh.
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

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-ink-500">
                <a href="#services" className="rounded-full border border-brand-200 bg-brand-50 px-4 py-2 font-medium transition hover:bg-brand-100">
                  Services
                </a>
                <a href="#documents" className="rounded-full border border-brand-200 bg-brand-50 px-4 py-2 font-medium transition hover:bg-brand-100">
                  Verified Documents
                </a>
                <Link to="/properties" className="rounded-full border border-brand-200 bg-brand-50 px-4 py-2 font-medium transition hover:bg-brand-100">
                  Properties
                </Link>
                <a href="#contact" className="rounded-full border border-brand-200 bg-brand-50 px-4 py-2 font-medium transition hover:bg-brand-100">
                  Contact
                </a>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {HERO_STATS.map((item) => (
                  <div key={item.label} className="glass-card-strong rounded-2xl p-4 md:p-5">
                    <p className="text-3xl font-bold text-brand-600">{item.value}</p>
                    <p className="mt-2 text-sm text-ink-500">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {ABOUT_HIGHLIGHTS.map((item) => (
                  <span key={item} className="pill">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:content-start">
              <div className="relative overflow-hidden rounded-[28px] border border-brand-100 bg-brand-50 min-h-[280px] sm:min-h-[320px]">
                <img
                  src={HERO_IMAGE}
                  alt="Sagar Infra hero"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
                  sizes="(min-width: 1024px) 42vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/65 via-ink-900/15 to-transparent" />
                <div className="relative flex h-full flex-col justify-between p-6 text-white">
                  <span className="w-fit rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] backdrop-blur-sm">
                    Premium first impression
                  </span>
                  <div>
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-white/90">
                      <BadgeCheck size={16} />
                      Contractor and property brand in Sagar MP
                    </p>
                    <p className="mt-3 max-w-md text-sm leading-7 text-white/85">
                      A cleaner, faster, and more trustworthy digital presence for construction clients and property enquiries.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {HOME_CAPABILITIES.map((item) => (
                  <div key={item.title} className="card card-hover h-full bg-white/95">
                    <span className="inline-flex rounded-2xl bg-brand-50 p-3 text-brand-700">
                      <BadgeCheck size={18} />
                    </span>
                    <p className="mt-4 font-semibold text-ink-700">{item.title}</p>
                    <p className="mt-2 line-clamp-4 text-sm leading-7 text-ink-500">{item.copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustSection />

      <section id="about" className="section-shell grid gap-5 md:grid-cols-2 xl:grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr]">
        <div className="card surface-grid md:col-span-2 xl:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600">About Us</p>
          <h2 className="section-title mt-2">A modern digital identity for a company clients can trust</h2>
          <p className="mt-4 text-sm leading-8 text-ink-500">
            Sagar Infra is positioned as a contractor-first business with a polished online presence, clear services,
            visible trust signals, and easy owner contact. The goal is to help serious clients feel confident quickly.
          </p>
          <p className="mt-4 text-sm leading-8 text-ink-500">
            That means responsive layouts, readable cards, verified proof sections, and property access without losing
            the core construction and infrastructure identity of the brand.
          </p>
        </div>

        {aboutCards.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.title} className="card card-hover h-full">
              <span className="inline-flex rounded-2xl bg-brand-50 p-3 text-brand-700">
                <Icon size={18} />
              </span>
              <h3 className="mt-4 text-xl font-semibold text-ink-700">{item.title}</h3>
              <p className="mt-3 line-clamp-5 text-sm leading-7 text-ink-500">{item.copy}</p>
            </article>
          );
        })}
      </section>

      <OwnerSection />

      <ServicesSection />

      <section id="contractor" className="section-shell">
        <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <div className="card surface-grid space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600">Contractor System</p>
              <h2 className="section-title mt-2">National highway, school, and government contract opportunities handled professionally</h2>
              <p className="mt-3 text-sm leading-8 text-ink-500">
                The platform now presents contractor work clearly for serious project discussions instead of hiding it
                behind generic property language.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              {contractOptions.map((item) => (
                <div key={item.value} className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
                  <p className="text-lg font-semibold text-ink-700">{item.label}</p>
                  <p className="mt-2 text-sm leading-7 text-ink-500">
                    Share project details, execution scope, and location for faster follow-up from the Sagar Infra team.
                  </p>
                </div>
              ))}
            </div>
          </div>

          <LeadCaptureForm
            title="Apply for Contract"
            description="Send your project type, location, and requirement to discuss highway work, school or college construction, and government contracts."
            submitLabel="Apply for Contract"
            successMessage="Contract application received. Sagar Infra will contact you soon."
            source="contract"
            showEmail
            showLocation
            serviceOptions={contractOptions}
            requirementSeed="I want to discuss a contractor opportunity with Sagar Infra."
          />
        </div>
      </section>

      <DocumentProofSection />

      <section className="section-shell space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600">Featured Properties</p>
            <h2 className="section-title mt-2">Verified properties presented with the same trust-first approach</h2>
          </div>
          <Link to="/properties" className="btn-secondary w-full sm:w-auto">
            Explore All
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? <p className="text-sm text-ink-500">Loading featured properties...</p> : <FeaturedPropertyCarousel properties={featuredProperties} />}
      </section>

      <section id="properties" className="section-shell space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600">Properties</p>
            <h2 className="section-title mt-2">Buy verified plots, homes, and commercial spaces in Sagar MP</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-ink-500">
            For clients who need both construction capability and verified property guidance, Sagar Infra brings both
            worlds together in one clean and responsive experience.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {latestProperties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      </section>

      <section className="section-shell">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="card surface-grid space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600">Buy / Sell</p>
              <h2 className="section-title mt-2">Buy confidently or sell your property with local guidance</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
                <p className="text-lg font-semibold text-ink-700">Buy Property</p>
                <p className="mt-2 text-sm leading-7 text-ink-500">
                  Browse verified listings with direct owner contact, location clarity, and contractor-backed insight.
                </p>
                <Link to="/properties" className="btn-secondary mt-4 w-full sm:w-auto">
                  Explore Listings
                  <ArrowRight size={16} />
                </Link>
              </div>
              <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
                <p className="text-lg font-semibold text-ink-700">Sell Property</p>
                <p className="mt-2 text-sm leading-7 text-ink-500">
                  Share your location, budget expectation, and property summary to start the selling conversation.
                </p>
              </div>
            </div>
          </div>

          <LeadCaptureForm
            title="Sell Your Property"
            description="Submit your property details and the Sagar Infra team will help you present, verify, and move it forward."
            submitLabel="Share Property Details"
            successMessage="Property requirement received. Sagar Infra will contact you shortly."
            source="sell"
            showEmail
            showLocation
            requirementSeed="I want to sell my property with Sagar Infra."
          />
        </div>
      </section>

      <section className="section-shell grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="card surface-grid space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600">Why Clients Trust Us</p>
            <h2 className="section-title mt-2">A professional local brand that looks clear and feels dependable</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {confidencePoints.map((item) => (
              <div key={item} className="rounded-2xl border border-brand-100 bg-brand-50 p-4">
                <CheckCircle2 size={18} className="text-brand-600" />
                <p className="mt-3 text-sm leading-7 text-ink-600">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {TESTIMONIALS.map((testimonial) => (
            <article key={testimonial.name} className="card card-hover h-full">
              <Sparkles size={18} className="text-brand-600" />
              <p className="mt-4 line-clamp-4 text-base leading-8 text-ink-600 sm:text-lg">"{testimonial.quote}"</p>
              <div className="mt-5">
                <p className="font-semibold text-ink-700">{testimonial.name}</p>
                <p className="text-sm text-ink-400">Client, Sagar</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="section-shell">
        <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
          <div className="card surface-grid flex flex-col justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600">Contact</p>
              <h2 className="section-title mt-2">{COMPANY_INFO.owner}</h2>
              <p className="mt-3 text-lg font-semibold text-brand-700">{COMPANY_INFO.name}</p>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-ink-500">
                Call or message for highway and government contracts, school and college construction, building work,
                plot development, and verified property consultation in Sagar Madhya Pradesh.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <a href={toPhoneHref(COMPANY_INFO.phoneDisplay)} className="rounded-2xl border border-brand-100 bg-brand-50 p-4 transition hover:-translate-y-1 hover:shadow-md">
                <ContactAction title="Call Now" value={COMPANY_INFO.phoneDisplay} icon={<Phone size={18} />} />
              </a>
              <a
                href={toWhatsAppHref(COMPANY_INFO.whatsappNumber, COMPANY_INFO.whatsappMessage)}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-brand-100 bg-brand-50 p-4 transition hover:-translate-y-1 hover:shadow-md"
              >
                <ContactAction title="WhatsApp" value="Get Free Consultation" icon={<MessageCircle size={18} />} />
              </a>
            </div>

            <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
                <MapPin size={16} />
                {COMPANY_INFO.location}
              </p>
              <p className="mt-3 text-sm leading-7 text-ink-500">
                Premium presentation, documented trust, and strong local contractor positioning for serious enquiries.
              </p>
            </div>
          </div>

          <LeadCaptureForm
            title="Request Free Consultation"
            description="Share your requirement for contracts, construction, documentation discussion, land development, or property support and we will contact you quickly."
            submitLabel="Get Free Consultation"
            successMessage="Thanks, Sagar Infra will contact you shortly."
            source="contact"
            showEmail
            showLocation
          />
        </div>
      </section>
    </div>
  );
};

const ContactAction = ({ title, value, icon }) => (
  <div>
    <p className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
      {icon}
      {title}
    </p>
    <p className="mt-3 text-xl font-semibold text-ink-700 sm:text-2xl">{value}</p>
    <p className="mt-2 text-sm text-ink-500">Fast response for contractor, construction, and property enquiries.</p>
  </div>
);

export default HomePage;
