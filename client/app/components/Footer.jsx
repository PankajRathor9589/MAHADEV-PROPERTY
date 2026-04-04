import { MapPin, MessageCircle, Phone } from "lucide-react";
import { COMPANY_INFO } from "../data/siteContent.js";
import { toPhoneHref, toWhatsAppHref } from "../utils/format.js";

const Footer = () => {
  return (
    <footer className="section-shell pb-8">
      <div className="glass-panel rounded-[32px] px-6 py-7 text-sm text-white/65">
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-start">
          <div>
            <p className="font-display text-3xl font-semibold text-white">{COMPANY_INFO.name}</p>
            <p className="mt-2 text-gold-100">{COMPANY_INFO.tagline}</p>
            <p className="mt-4 max-w-2xl leading-7 text-white/55">
              Construction, road and RCC work, material supply, government tenders, land dealing, plotting, and
              verified property support for clients across Sagar, Madhya Pradesh.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
            <a href={toPhoneHref(COMPANY_INFO.phoneDisplay)} className="rounded-[24px] border border-white/10 bg-white/5 p-4 transition hover:bg-white/8">
              <p className="inline-flex items-center gap-2 font-semibold text-gold-100">
                <Phone size={16} />
                Call
              </p>
              <p className="mt-2 text-base font-semibold text-white">{COMPANY_INFO.phoneDisplay}</p>
            </a>

            <a
              href={toWhatsAppHref(COMPANY_INFO.whatsappNumber, COMPANY_INFO.whatsappMessage)}
              target="_blank"
              rel="noreferrer"
              className="rounded-[24px] border border-white/10 bg-white/5 p-4 transition hover:bg-white/8"
            >
              <p className="inline-flex items-center gap-2 font-semibold text-gold-100">
                <MessageCircle size={16} />
                WhatsApp
              </p>
              <p className="mt-2 text-base font-semibold text-white">Chat with Sagar Infra</p>
            </a>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 text-white/50 md:flex-row md:items-center md:justify-between">
          <p className="inline-flex items-center gap-2">
            <MapPin size={16} />
            {COMPANY_INFO.address}
          </p>
          <p>Owner: {COMPANY_INFO.owner}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
