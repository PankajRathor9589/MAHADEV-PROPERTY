import { FaCheckCircle, FaPhoneAlt, FaStar, FaWhatsapp } from "react-icons/fa";

const DealerCard = ({ dealer }) => {
  const whatsappLink = `https://wa.me/${dealer.whatsapp}`;

  return (
    <aside className="card space-y-3 lg:sticky lg:top-24">
      <div className="flex items-center gap-3">
        <img src={dealer.photo || "https://placehold.co/200x200?text=Dealer"} alt={dealer.name} className="h-16 w-16 rounded-full object-cover" />
        <div>
          <p className="font-bold text-slate-900">{dealer.name}</p>
          <p className="text-sm text-slate-600">{dealer.agencyName}</p>
        </div>
      </div>
      <p className="text-sm text-slate-700">Experience: {dealer.experienceYears} years</p>
      <p className="flex items-center gap-1 text-sm text-slate-700"><FaStar className="text-amber-500" /> {dealer.rating}</p>
      {dealer.isVerified && <p className="flex items-center gap-1 text-sm text-emerald-600"><FaCheckCircle /> Verified</p>}
      <div className="grid gap-2">
        <a href={`tel:${dealer.phone}`} className="btn-primary"><FaPhoneAlt /> Call Now</a>
        <a href={whatsappLink} target="_blank" rel="noreferrer" className="btn-outline"><FaWhatsapp /> WhatsApp</a>
      </div>
      <p className="text-xs text-slate-500">Office: {dealer.officeAddress}</p>
      <p className="text-xs text-slate-500">Availability: 9 AM - 9 PM</p>
    </aside>
  );
};

export default DealerCard;
