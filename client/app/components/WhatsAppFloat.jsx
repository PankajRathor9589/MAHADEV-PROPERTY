import { MessageCircleMore } from "lucide-react";
import { COMPANY_INFO } from "../data/siteContent.js";
import { toWhatsAppHref } from "../utils/format.js";

const WhatsAppFloat = () => {
  return (
    <a
      href={toWhatsAppHref(COMPANY_INFO.whatsappNumber, COMPANY_INFO.whatsappMessage)}
      target="_blank"
      rel="noreferrer"
      className="pulse-gold fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-panel transition hover:-translate-y-1 hover:bg-emerald-400"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircleMore size={18} />
      WhatsApp
    </a>
  );
};

export default WhatsAppFloat;
