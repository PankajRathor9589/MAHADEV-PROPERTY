import {
  ArrowRight,
  BadgeIndianRupee,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  CheckCircle2,
  FileCheck2,
  Landmark,
  MapPin,
  MessageCircleMore,
  Search,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import LeadCaptureForm from "../components/LeadCaptureForm.jsx";
import ResponsiveImage from "../components/ResponsiveImage.jsx";
import Seo from "../components/Seo.jsx";
import { allEnterprisePages, enterpriseStats } from "../data/enterprisePages.js";
import { COMPANY_INFO } from "../data/siteContent.js";
import { toPhoneHref, toWhatsAppHref } from "../utils/format.js";

const iconMap = [Search, ShieldCheck, Building2, BarChart3, FileCheck2, Users, Landmark, BriefcaseBusiness];

const variantCopy = {
  collection: {
    title: "Discovery tools built into this collection",
    copy: "Every collection connects to AI search, voice-ready queries, advanced filters, map exploration, saved properties, and comparison flows."
  },
  service: {
    title: "Service workflow",
    copy: "A concierge-led service journey keeps the experience premium from first enquiry to documentation, scheduling, and final coordination."
  },
  finance: {
    title: "Finance-ready property decisions",
    copy: "Plan affordability with EMI, mortgage, document readiness, lender coordination, and future payment support."
  },
  policy: {
    title: "Clear operating principles",
    copy: "Policies are written to support buyer trust, owner confidence, dashboard users, and future paid services."
  },
  builders: {
    title: "Builder growth infrastructure",
    copy: "Developer pages combine brand story, project inventory, construction status, enquiry routing, analytics, and brochure workflows."
  },
  location: {
    title: "Local SEO and micro-market intelligence",
    copy: "Location pages are designed for city, area, school, hospital, bank, metro, and restaurant discovery patterns."
  },
  default: {
    title: "Enterprise platform layer",
    copy: "This module connects premium storytelling, lead capture, dashboards, trust cues, and SEO-ready page structure."
  }
};

const getPage = (slug = "") => allEnterprisePages.find((item) => item.slug === slug);

const EnterprisePage = ({ pageSlug }) => {
  const { slug = "about" } = useParams();
  const page = getPage(pageSlug || slug) || getPage("about");
  const variant = variantCopy[page.variant] || variantCopy.default;
  const canonical = `${COMPANY_INFO.canonicalUrl}/${page.slug}`;

  return (
    <>
      <Seo
        title={`${page.title} | ${COMPANY_INFO.name}`}
        description={page.description}
        canonical={canonical}
        image={page.image}
        keywords={`${page.title}, Sagar Infra, luxury real estate, ${COMPANY_INFO.metaKeywords}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: page.title,
          description: page.description,
          url: canonical,
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: COMPANY_INFO.canonicalUrl },
              { "@type": "ListItem", position: 2, name: page.title, item: canonical }
            ]
          }
        }}
      />

      <section className="section-shell pt-8">
        <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel flex min-h-[34rem] flex-col justify-between overflow-hidden p-7 sm:p-9"
          >
            <div>
              <p className="section-kicker">{page.kicker}</p>
              <h1 className="mt-4 font-display text-[clamp(3rem,7vw,6.6rem)] font-semibold leading-[0.9] text-ink-900">
                {page.title}
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-8 text-ink-500 sm:text-base">{page.description}</p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link to="/properties" className="btn-primary">
                Explore Properties
                <ArrowRight size={16} />
              </Link>
              <a
                href={toWhatsAppHref(COMPANY_INFO.whatsappNumber, `Hi Sagar Infra, I want help with ${page.title}.`)}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp"
              >
                <MessageCircleMore size={16} />
                WhatsApp Concierge
              </a>
            </div>
          </motion.div>

          <div className="relative min-h-[34rem] overflow-hidden rounded-[32px] border border-[#e5e7eb] bg-white shadow-[0_24px_70px_rgba(17,24,39,0.08)]">
            <ResponsiveImage
              src={page.image}
              alt={page.title}
              className="h-full min-h-[34rem] w-full object-cover"
              sizes="(min-width: 1280px) 48vw, 100vw"
              widths={[720, 960, 1280, 1600]}
              transformOptions={{ height: 1200, crop: "fill" }}
            />
            <div className="absolute inset-x-5 bottom-5 rounded-[28px] border border-white/60 bg-white/88 p-5 shadow-[0_18px_50px_rgba(17,24,39,0.12)] backdrop-blur-xl">
              <p className="section-kicker">Premium OS</p>
              <p className="mt-2 text-2xl font-semibold text-ink-900">{variant.title}</p>
              <p className="mt-2 text-sm leading-7 text-ink-500">{variant.copy}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="grid gap-4 md:grid-cols-4">
          {enterpriseStats.map((item) => (
            <div key={item.label} className="rounded-[28px] border border-[#e5e7eb] bg-white p-5 shadow-[0_16px_42px_rgba(17,24,39,0.06)]">
              <p className="text-3xl font-semibold text-ink-900">{item.value}</p>
              <p className="mt-2 text-sm leading-7 text-ink-500">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className={`grid gap-6 ${page.variant === "policy" ? "xl:grid-cols-[0.85fr_1.15fr]" : "xl:grid-cols-[1.15fr_0.85fr]"}`}>
          <div className="glass-panel p-7 sm:p-8">
            <p className="section-kicker">Module Blueprint</p>
            <h2 className="mt-3 text-[clamp(2.15rem,5vw,4rem)] font-semibold leading-none text-ink-900">
              Designed as a real product page, not a brochure block.
            </h2>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {page.sections.map((item, index) => {
                const Icon = iconMap[index % iconMap.length];

                return (
                  <div key={item} className="rounded-[26px] border border-[#e5e7eb] bg-[#f8f9fa] p-5">
                    <Icon size={18} className="text-gold-600" />
                    <p className="mt-4 text-xl font-semibold text-ink-900">{item}</p>
                    <p className="mt-2 text-sm leading-7 text-ink-500">
                      Connected to premium UX, SEO metadata, mobile-first layout, and lead-ready calls to action.
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] border border-[#e5e7eb] bg-white p-6 shadow-[0_20px_58px_rgba(17,24,39,0.07)] sm:p-7">
              <p className="section-kicker">Product Capabilities</p>
              <div className="mt-5 space-y-3">
                {page.cards.map((item, index) => (
                  <div key={item} className="flex items-start gap-3 rounded-[24px] border border-[#e5e7eb] bg-[#fafafa] p-4">
                    <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f7ecd7] text-gold-700">
                      <CheckCircle2 size={16} />
                    </span>
                    <div>
                      <p className="font-semibold text-ink-900">{item}</p>
                      <p className="mt-1 text-sm leading-7 text-ink-500">
                        {index % 2 === 0
                          ? "Built for high-intent users who need clarity before they call."
                          : "Structured for enterprise operations, analytics, and future automation."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <a href={toPhoneHref(COMPANY_INFO.phoneDisplay)} className="rounded-[28px] border border-[#e5e7eb] bg-white p-5 shadow-[0_18px_48px_rgba(17,24,39,0.07)] transition hover:-translate-y-1 hover:border-gold-300">
                <CalendarCheck size={18} className="text-gold-600" />
                <p className="mt-4 text-xl font-semibold text-ink-900">Schedule Visit</p>
                <p className="mt-2 text-sm leading-7 text-ink-500">Move from interest to a guided site visit quickly.</p>
              </a>
              <Link to="/emi-calculator" className="rounded-[28px] border border-[#e5e7eb] bg-white p-5 shadow-[0_18px_48px_rgba(17,24,39,0.07)] transition hover:-translate-y-1 hover:border-gold-300">
                <BadgeIndianRupee size={18} className="text-gold-600" />
                <p className="mt-4 text-xl font-semibold text-ink-900">Plan Finance</p>
                <p className="mt-2 text-sm leading-7 text-ink-500">Use EMI and stamp-duty calculators before shortlisting.</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="glass-panel p-7 sm:p-8">
            <p className="section-kicker">SEO + Trust</p>
            <h2 className="mt-3 text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-none text-ink-900">
              Search-ready, conversion-ready, and dashboard-ready.
            </h2>
            <p className="mt-4 text-sm leading-8 text-ink-500">
              Each route has dynamic metadata, canonical URLs, JSON-LD, accessible structure, responsive imagery, and a
              high-intent lead path that supports the broader Sagar Infra platform.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["OpenGraph", "Twitter Cards", "Breadcrumb Schema", "Local SEO", "PWA"].map((item) => (
                <span key={item} className="badge border-[#e5e7eb] bg-white text-ink-700">
                  <Sparkles size={12} className="text-gold-600" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <LeadCaptureForm
            title={`Request Help With ${page.title}`}
            description="Share your requirement and Sagar Infra will coordinate the right property, service, dashboard, or advisory next step."
            submitLabel="Request Premium Support"
            successMessage="Your request has been submitted successfully."
            source={page.slug}
            showEmail
            showLocation
            requirementSeed={`I want help with ${page.title}.`}
          />
        </div>
      </section>
    </>
  );
};

export default EnterprisePage;
