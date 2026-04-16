import { MessageCircleMore } from "lucide-react";
import { COMPANY_INFO } from "../data/siteContent.js";
import { toWhatsAppHref } from "../utils/format.js";

const WhatsAppFloat = () => {
  return (
    <a
      href={toWhatsAppHref(COMPANY_INFO.whatsappNumber, COMPANY_INFO.whatsappMessage)}
      target="_blank"
      rel="noreferrer"
      className="pulse-gold fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl sm:bottom-6 sm:right-6"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircleMore size={18} />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
};

export default WhatsAppFloat;
