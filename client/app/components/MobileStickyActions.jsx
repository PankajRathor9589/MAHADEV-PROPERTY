import { Home, MessageCircleMore, PhoneCall } from "lucide-react";
import { COMPANY_INFO } from "../data/siteContent.js";
import { toPhoneHref, toWhatsAppHref } from "../utils/format.js";

const MobileStickyActions = () => {
  return (
    <div className="fixed inset-x-3 bottom-3 z-40 md:hidden">
      <div className="grid grid-cols-3 gap-2 rounded-[28px] border border-white/14 bg-[#06101d]/88 p-2 shadow-[0_22px_70px_rgba(3,7,17,0.42)] backdrop-blur-2xl">
        <a href={toPhoneHref(COMPANY_INFO.phoneDisplay)} className="btn-secondary min-h-[50px] border-white/12 bg-white/10 px-3 text-xs text-white hover:bg-white/16 hover:text-white">
          <PhoneCall size={16} />
          Call
        </a>
        <a
          href={toWhatsAppHref(
            COMPANY_INFO.whatsappNumber,
            "Hi SAGAR INFRA, I want to book a site visit for a property in Sagar."
          )}
          target="_blank"
          rel="noreferrer"
          className="btn-ghost min-h-[50px] border-white/12 bg-white/10 px-3 text-xs text-white hover:bg-white/16 hover:text-white"
        >
          <Home size={16} />
          Visit
        </a>
        <a
          href={toWhatsAppHref(COMPANY_INFO.whatsappNumber, COMPANY_INFO.whatsappMessage)}
          target="_blank"
          rel="noreferrer"
          className="btn-whatsapp min-h-[50px] px-3 text-xs"
        >
          <MessageCircleMore size={16} />
          WhatsApp
        </a>
      </div>
    </div>
  );
};

export default MobileStickyActions;
