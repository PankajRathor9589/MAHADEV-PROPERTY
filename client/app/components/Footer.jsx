import { MapPin, MessageCircleMore, Phone, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { COMPANY_INFO, TRUST_SIGNALS } from "../data/siteContent.js";
import { toPhoneHref, toWhatsAppHref } from "../utils/format.js";
import BrandMark from "./BrandMark.jsx";

const Footer = () => {
  return (
    <footer className="section-shell pb-32 pt-6 md:pb-12">
      <div className="glass-panel overflow-hidden p-8 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <BrandMark />
            <p className="mt-5 max-w-2xl text-sm leading-8 text-ink-500 sm:text-base">
              SAGAR INFRA pairs premium presentation with grounded local trust so buyers, investors, builders, and
              contractors can move faster with more confidence.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {TRUST_SIGNALS.map((item) => (
                <div key={item.title} className="rounded-[26px] border border-[#ebe1d4] bg-[#faf6ef] p-5">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-gold-700">
                    <ShieldCheck size={16} />
                    {item.title}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-ink-500">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-gold-700">Quick Links</p>
                <div className="mt-4 grid gap-3 text-sm text-ink-600">
                  <Link className="transition hover:text-ink-900" to="/">
                    Home
                  </Link>
                  <Link className="transition hover:text-ink-900" to="/properties">
                    Properties
                  </Link>
                  <Link className="transition hover:text-ink-900" to="/#services">
                    Services
                  </Link>
                  <Link className="transition hover:text-ink-900" to="/#contact">
                    Contact
                  </Link>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-gold-700">Contact</p>
                <div className="mt-4 space-y-3 text-sm text-ink-600">
                  <p>{COMPANY_INFO.owner}</p>
                  <a className="transition hover:text-ink-900" href={toPhoneHref(COMPANY_INFO.phoneDisplay)}>
                    {COMPANY_INFO.phoneDisplay}
                  </a>
                  <p className="inline-flex items-center gap-2">
                    <MapPin size={16} className="text-gold-600" />
                    {COMPANY_INFO.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <a
              href={toPhoneHref(COMPANY_INFO.phoneDisplay)}
              className="rounded-[28px] border border-[#e8dcc9] bg-white p-5 text-ink-800 shadow-[0_20px_48px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-gold-300"
            >
              <p className="inline-flex items-center gap-2 font-semibold text-gold-700">
                <Phone size={16} />
                Call Now
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-[0.08em] text-ink-900">{COMPANY_INFO.phoneDisplay}</p>
              <p className="mt-2 text-sm text-ink-500">Speak directly with {COMPANY_INFO.owner}</p>
            </a>

            <a
              href={toWhatsAppHref(COMPANY_INFO.whatsappNumber, COMPANY_INFO.whatsappMessage)}
              target="_blank"
              rel="noreferrer"
              className="rounded-[28px] border border-[#e8dcc9] bg-[#f8f5ef] p-5 text-ink-800 shadow-[0_20px_48px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-gold-300"
            >
              <p className="inline-flex items-center gap-2 font-semibold text-gold-700">
                <MessageCircleMore size={16} />
                WhatsApp
              </p>
              <p className="mt-3 text-2xl font-semibold text-ink-900">Instant Consultation</p>
              <p className="mt-2 text-sm text-ink-500">Get fast responses on pricing, visits, and buyer requirements.</p>
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-[#ebe2d5] pt-6 text-sm text-ink-500 md:flex-row md:items-center md:justify-between">
          <p>{COMPANY_INFO.tagline}</p>
          <p>{new Date().getFullYear()} SAGAR INFRA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
