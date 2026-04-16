import { MapPin, MessageCircle, Phone } from "lucide-react";
import { COMPANY_INFO } from "../data/siteContent.js";
import { toPhoneHref, toWhatsAppHref } from "../utils/format.js";

const Footer = () => {
  return (
    <footer className="section-shell pb-8">
      <div className="card rounded-[32px] bg-white/95">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <p className="font-display text-3xl font-semibold text-ink-700">{COMPANY_INFO.name}</p>
            <p className="mt-2 font-medium text-brand-600">{COMPANY_INFO.tagline}</p>
            <p className="mt-4 max-w-2xl leading-7 text-ink-500">
              Construction, government contracts, plot development, and verified property support for clients across
              Sagar, Madhya Pradesh.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <a href={toPhoneHref(COMPANY_INFO.phoneDisplay)} className="rounded-2xl border border-brand-100 bg-brand-50 p-4 transition hover:-translate-y-1 hover:shadow-md">
              <p className="inline-flex items-center gap-2 font-semibold text-brand-700">
                <Phone size={16} />
                Call
              </p>
              <p className="mt-2 text-base font-semibold text-ink-700">{COMPANY_INFO.phoneDisplay}</p>
            </a>

            <a
              href={toWhatsAppHref(COMPANY_INFO.whatsappNumber, COMPANY_INFO.whatsappMessage)}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-brand-100 bg-brand-50 p-4 transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="inline-flex items-center gap-2 font-semibold text-brand-700">
                <MessageCircle size={16} />
                WhatsApp
              </p>
              <p className="mt-2 text-base font-semibold text-ink-700">Chat with Sagar Infra</p>
            </a>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-brand-100 pt-5 text-ink-500 md:flex-row md:items-center md:justify-between">
          <p className="inline-flex items-center gap-2">
            <MapPin size={16} className="text-brand-600" />
            {COMPANY_INFO.address}
          </p>
          <p>Owner: {COMPANY_INFO.owner}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
