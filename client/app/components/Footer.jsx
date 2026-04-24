import { MapPin, MessageCircleMore, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import BrandMark from "./BrandMark.jsx";
import { COMPANY_INFO } from "../data/siteContent.js";
import { toPhoneHref, toWhatsAppHref } from "../utils/format.js";

const Footer = () => {
  return (
    <footer className="section-shell pb-24 pt-6 md:pb-12">
      <div className="glass-panel overflow-hidden p-8 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <BrandMark />
            <p className="mt-5 max-w-2xl text-sm leading-8 text-white/72 sm:text-base">
              SAGAR INFRA brings a luxury real estate presentation to plots, homes, shops, and commercial opportunities
              across Sagar with direct owner-led support from Prashant Rathor.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-gold-300">Quick Links</p>
                <div className="mt-4 grid gap-3 text-sm text-white/78">
                  <Link className="transition hover:text-white" to="/">
                    Home
                  </Link>
                  <Link className="transition hover:text-white" to="/properties">
                    Properties
                  </Link>
                  <Link className="transition hover:text-white" to="/#services">
                    Services
                  </Link>
                  <Link className="transition hover:text-white" to="/#contact">
                    Contact
                  </Link>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-gold-300">Contact</p>
                <div className="mt-4 space-y-3 text-sm text-white/78">
                  <p>{COMPANY_INFO.owner}</p>
                  <a className="transition hover:text-white" href={toPhoneHref(COMPANY_INFO.phoneDisplay)}>
                    {COMPANY_INFO.phoneDisplay}
                  </a>
                  <p className="inline-flex items-center gap-2">
                    <MapPin size={16} className="text-gold-300" />
                    {COMPANY_INFO.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <a
              href={toPhoneHref(COMPANY_INFO.phoneDisplay)}
              className="rounded-[28px] border border-white/14 bg-white/[0.08] p-5 text-white shadow-[0_24px_60px_rgba(5,13,28,0.28)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-gold-400/50"
            >
              <p className="inline-flex items-center gap-2 font-semibold text-gold-200">
                <Phone size={16} />
                Call Now
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-[0.08em] text-white">{COMPANY_INFO.phoneDisplay}</p>
              <p className="mt-2 text-sm text-white/68">Speak directly with {COMPANY_INFO.owner}</p>
            </a>

            <a
              href={toWhatsAppHref(COMPANY_INFO.whatsappNumber, COMPANY_INFO.whatsappMessage)}
              target="_blank"
              rel="noreferrer"
              className="rounded-[28px] border border-white/14 bg-white/[0.08] p-5 text-white shadow-[0_24px_60px_rgba(5,13,28,0.28)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-gold-400/50"
            >
              <p className="inline-flex items-center gap-2 font-semibold text-gold-200">
                <MessageCircleMore size={16} />
                WhatsApp
              </p>
              <p className="mt-3 text-2xl font-semibold text-white">Instant Consultation</p>
              <p className="mt-2 text-sm text-white/68">Get fast responses on property visits and pricing.</p>
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/58 md:flex-row md:items-center md:justify-between">
          <p>{COMPANY_INFO.tagline}</p>
          <p>{new Date().getFullYear()} SAGAR INFRA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
