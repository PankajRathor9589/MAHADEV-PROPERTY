import { FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { GOOGLE_MAPS_LINK, OWNER_PROFILE, SERVICE_AREA } from "../config/site";
import Seo from "../components/ui/Seo";

const ContactPage = () => (
  <>
    <Seo title="Contact" />
    <div className="mx-auto max-w-3xl card">
      <h1 className="text-2xl font-bold">Contact {OWNER_PROFILE.name}</h1>
      <p className="mt-3 text-sm text-slate-700">Get verified property support for all tehsils in Sagar district and nearby Sagar division locations.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <a href={`tel:${OWNER_PROFILE.phoneRaw}`} className="btn-primary"><FaPhoneAlt /> Call Now</a>
        <a href={`https://wa.me/${OWNER_PROFILE.whatsappRaw}`} target="_blank" rel="noreferrer" className="btn-outline"><FaWhatsapp /> WhatsApp</a>
        <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noreferrer" className="btn-outline sm:col-span-2"><FaMapMarkerAlt /> Open Office in Google Maps</a>
      </div>
      <p className="mt-4 text-sm text-slate-700">Office: {OWNER_PROFILE.address}</p>
      <p className="mt-2 text-sm text-slate-700">Primary Coverage: {SERVICE_AREA.primaryLocations.join(", ")}</p>
    </div>
  </>
);

export default ContactPage;
