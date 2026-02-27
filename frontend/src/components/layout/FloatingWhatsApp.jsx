import { FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { GOOGLE_MAPS_LINK, OWNER_PROFILE } from "../../config/site";

const FloatingWhatsApp = () => {
  const phone = import.meta.env.VITE_DEFAULT_WHATSAPP || OWNER_PROFILE.whatsappRaw;

  return (
    <div className="floating-stack">
      <a href={`tel:${OWNER_PROFILE.phoneRaw}`} className="floating-action" aria-label="Call now">
        <FaPhoneAlt className="text-brand-600" />
        <span>Call Now</span>
      </a>
      <a
        href={`https://wa.me/${phone}`}
        target="_blank"
        rel="noreferrer"
        className="floating-action"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="text-green-600" />
        <span>WhatsApp</span>
      </a>
      <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noreferrer" className="floating-action" aria-label="Open map">
        <FaMapMarkerAlt className="text-amber-600" />
        <span>Map</span>
      </a>
    </div>
  );
};

export default FloatingWhatsApp;
