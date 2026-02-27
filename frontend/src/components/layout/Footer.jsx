import { GOOGLE_MAPS_LINK, OWNER_PROFILE, SERVICE_AREA } from "../../config/site";

const Footer = () => (
  <footer className="mt-12 bg-slate-900 text-slate-200">
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-3">
      <div>
        <h3 className="text-lg font-bold">Mahadev Property - Sagar Division</h3>
        <p className="mt-2 text-sm text-slate-300">Professional property solutions for plots, houses, farm land, and commercial investments across Madhya Pradesh.</p>
        <p className="mt-3 text-sm text-slate-400">Owner: {OWNER_PROFILE.name}</p>
      </div>
      <div>
        <h4 className="font-semibold">Contact</h4>
        <p className="mt-2 text-sm">Phone: {OWNER_PROFILE.phoneDisplay}</p>
        <p className="text-sm">WhatsApp: {OWNER_PROFILE.phoneDisplay}</p>
        <p className="text-sm">Availability: 9 AM - 9 PM</p>
        <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-amber-300">
          Open Google Maps
        </a>
      </div>
      <div>
        <h4 className="font-semibold">Service Area</h4>
        <p className="mt-2 text-sm">{OWNER_PROFILE.address}</p>
        <p className="mt-2 text-xs text-slate-400">
          Division Districts: {SERVICE_AREA.divisionDistricts.join(", ")}
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
