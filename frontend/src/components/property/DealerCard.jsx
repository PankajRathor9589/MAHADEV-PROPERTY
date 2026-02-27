import { FaCheckCircle, FaPhoneAlt, FaStar, FaWhatsapp } from "react-icons/fa";
import { OWNER_PROFILE } from "../../config/site";

const DealerCard = ({ dealer }) => {
  const safeDealer = dealer || OWNER_PROFILE;
  const whatsappLink = `https://wa.me/${safeDealer.whatsapp}`;

  return (
    <aside className="card space-y-3 lg:sticky lg:top-24">
      <div className="flex items-center gap-3">
        <img src={safeDealer.photo || "https://placehold.co/200x200?text=Dealer"} alt={safeDealer.name} className="h-16 w-16 rounded-full object-cover" />
        <div>
          <p className="font-bold text-slate-900">{safeDealer.name}</p>
          <p className="text-sm text-slate-600">{safeDealer.agencyName}</p>
        </div>
      </div>
      <p className="text-sm text-slate-700">Experience: {safeDealer.experienceYears} years</p>
      <p className="flex items-center gap-1 text-sm text-slate-700"><FaStar className="text-amber-500" /> {safeDealer.rating}</p>
      {safeDealer.isVerified && <p className="flex items-center gap-1 text-sm text-emerald-600"><FaCheckCircle /> Verified</p>}
      <div className="grid gap-2">
        <a href={`tel:${safeDealer.phone}`} className="btn-primary"><FaPhoneAlt /> Call Now</a>
        <a href={whatsappLink} target="_blank" rel="noreferrer" className="btn-outline"><FaWhatsapp /> WhatsApp</a>
      </div>
      <p className="text-xs text-slate-500">Office: {safeDealer.officeAddress}</p>
      <p className="text-xs text-slate-500">Availability: 9 AM - 9 PM</p>
    </aside>
  );
};

export default DealerCard;
