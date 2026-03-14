import { Link } from "react-router-dom";
import { BRAND, CATEGORY_CARDS, CONTACT, PROPERTY_TYPES } from "../../config/site";

const Footer = () => (
  <footer className="mt-14 border-t border-white/70 bg-white/60 px-4 py-10 backdrop-blur sm:px-6 lg:px-8">
    <div className="mx-auto grid w-full max-w-[1440px] gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr]">
      <div className="space-y-3">
        <p className="surface-label">Real estate platform</p>
        <h2 className="section-heading text-3xl text-ink">{BRAND.name}</h2>
        <p className="max-w-xl text-sm leading-7 text-slate-600">
          {BRAND.tagline} Built to help buyers discover faster, agents post inventory with confidence, and admins moderate quality at scale.
        </p>
      </div>

      <div className="space-y-3">
        <p className="surface-label">Explore</p>
        <div className="grid gap-2 text-sm text-slate-700">
          <Link to="/">Homepage</Link>
          <Link to="/properties">Property listings</Link>
          <Link to="/agent">Agent dashboard</Link>
          <Link to="/admin">Admin dashboard</Link>
        </div>
      </div>

      <div className="space-y-3">
        <p className="surface-label">Categories</p>
        <div className="grid gap-2 text-sm text-slate-700">
          {CATEGORY_CARDS.map((category) => (
            <Link key={category.id} to={category.path || `/properties${category.propertyType ? `?propertyType=${encodeURIComponent(category.propertyType)}` : ""}`}>
              {category.label}
            </Link>
          ))}
          <p className="text-xs text-slate-500">{PROPERTY_TYPES.join(" · ")}</p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="surface-label">Contact</p>
        <div className="grid gap-2 text-sm text-slate-700">
          <p>{CONTACT.phone}</p>
          <p>{CONTACT.email}</p>
          <p>{CONTACT.address}</p>
          <a href={`https://wa.me/${CONTACT.whatsappRaw}`} target="_blank" rel="noreferrer" className="font-semibold text-brand-700">
            WhatsApp support
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
