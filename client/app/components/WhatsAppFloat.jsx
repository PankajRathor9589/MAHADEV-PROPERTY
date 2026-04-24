import { MessageCircleMore } from "lucide-react";
import { COMPANY_INFO } from "../data/siteContent.js";
import { toWhatsAppHref } from "../utils/format.js";

const WhatsAppFloat = () => {
  return (
    <a
      href={toWhatsAppHref(COMPANY_INFO.whatsappNumber, COMPANY_INFO.whatsappMessage)}
      target="_blank"
      rel="noreferrer"
      className="wa-pulse fixed bottom-5 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-white/16 bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_22px_44px_rgba(37,211,102,0.34)] transition hover:-translate-y-1 hover:shadow-[0_28px_52px_rgba(37,211,102,0.42)] sm:right-6"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircleMore size={18} />
      <span className="hidden sm:inline">WhatsApp Concierge</span>
    </a>
  );
};

export default WhatsAppFloat;
