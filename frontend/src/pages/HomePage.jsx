import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaMapMarkerAlt, FaPhoneAlt, FaShieldAlt, FaWhatsapp } from "react-icons/fa";
import { alertApi, propertyApi } from "../api/services";
import { GOOGLE_MAPS_LINK, OWNER_PROFILE, PROPERTY_TYPES, SERVICE_AREA } from "../config/site";
import PropertyCard from "../components/property/PropertyCard";
import Seo from "../components/ui/Seo";
import PropertySlider from "../components/ui/PropertySlider";

const testimonials = [
  { name: "Ritesh Patel, Khurai", text: "Clear documentation and quick registry support. Smooth experience." },
  { name: "Anjali Soni, Sagar City", text: "Verified options and honest guidance on price negotiation." },
  { name: "Dinesh Yadav, Garhakota", text: "Site visit scheduled fast and final deal closed without confusion." }
];

const HomePage = () => {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [recentlySold, setRecentlySold] = useState([]);
  const [query, setQuery] = useState({ location: "", maxPrice: "", propertyType: "" });
  const [alertForm, setAlertForm] = useState({
    name: "",
    email: "",
    phone: "",
    preferredLocation: "",
    propertyType: "",
    maxPrice: ""
  });
  const [alertStatus, setAlertStatus] = useState("");

  useEffect(() => {
    Promise.all([
      propertyApi.featured(),
      propertyApi.trending(),
      propertyApi.list({ availabilityStatus: "Sold", recentlySold: true, limit: 6 })
    ]).then(([f, t, sold]) => {
      setFeatured(f.data.items || []);
      setTrending(t.data.items || []);
      setRecentlySold(sold.data.items || []);
    });
  }, []);

  const runSearch = () => {
    const params = new URLSearchParams();
    if (query.location) params.set("location", query.location);
    if (query.maxPrice) {
      if (query.maxPrice.endsWith("+")) params.set("minPrice", query.maxPrice.replace("+", ""));
      else params.set("maxPrice", query.maxPrice);
    }
    if (query.propertyType) params.set("propertyType", query.propertyType);
    navigate(`/properties?${params.toString()}`);
  };

  const submitAlert = async (e) => {
    e.preventDefault();
    try {
      await alertApi.create({
        ...alertForm,
        maxPrice: alertForm.maxPrice ? Number(alertForm.maxPrice) : undefined
      });
      setAlertStatus("Property alerts activated. We will notify you on matching listings.");
      setAlertForm({ name: "", email: "", phone: "", preferredLocation: "", propertyType: "", maxPrice: "" });
    } catch {
      setAlertStatus("Unable to save alert right now. Please try again.");
    }
  };

  return (
    <>
      <Seo
        title="Sagar MP Property Dealer"
        description="Professional real estate platform for Sagar division with verified listings, local tehsil coverage, and direct call/WhatsApp support."
      />

      <section className="hero-panel overflow-hidden rounded-3xl px-5 py-12 text-white md:px-8">
        <div className="max-w-3xl">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="chip border-white/40 bg-white/20 text-white"><FaCheckCircle /> Verified Listings</span>
            <span className="chip border-white/40 bg-white/20 text-white"><FaShieldAlt /> Trusted Dealer</span>
            <span className="chip border-white/40 bg-white/20 text-white"><FaMapMarkerAlt /> Local Expert - Sagar MP</span>
          </div>
          <h1 className="hero-title">Buy, Sell, and Invest in Sagar Division Properties with Confidence</h1>
          <p className="mt-4 max-w-2xl text-sm text-slate-100 md:text-base">
            Owner: {OWNER_PROFILE.name} | Service area across Sagar district tehsils including Sagar City, Jaisinagar, Rahatgarh, Khurai, Bina, Deori, Banda, Shahgarh, Malthone, Rehli, Garhakota, and Kesli.
          </p>
        </div>

        <div className="mt-8 grid gap-3 rounded-2xl bg-white/95 p-4 text-slate-900 md:grid-cols-4">
          <select className="input" value={query.location} onChange={(e) => setQuery((prev) => ({ ...prev, location: e.target.value }))}>
            <option value="">Select Location</option>
            {SERVICE_AREA.primaryLocations.map((location) => <option key={location}>{location}</option>)}
          </select>
          <select className="input" value={query.maxPrice} onChange={(e) => setQuery((prev) => ({ ...prev, maxPrice: e.target.value }))}>
            <option value="">Budget</option>
            <option value="2500000">Up to 25 Lakh</option>
            <option value="5000000">Up to 50 Lakh</option>
            <option value="10000000">Up to 1 Crore</option>
            <option value="10000000+">Above 1 Crore</option>
          </select>
          <select className="input" value={query.propertyType} onChange={(e) => setQuery((prev) => ({ ...prev, propertyType: e.target.value }))}>
            <option value="">Property Type</option>
            {PROPERTY_TYPES.map((type) => <option key={type}>{type}</option>)}
          </select>
          <button type="button" className="btn-primary" onClick={runSearch}>Search Properties</button>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <a href={`tel:${OWNER_PROFILE.phoneRaw}`} className="btn-primary"><FaPhoneAlt /> One-click Call</a>
          <a href={`https://wa.me/${OWNER_PROFILE.whatsappRaw}`} target="_blank" rel="noreferrer" className="btn-outline border-white bg-white text-slate-900 hover:bg-slate-100"><FaWhatsapp /> WhatsApp Inquiry</a>
          <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noreferrer" className="btn-outline border-white bg-white text-slate-900 hover:bg-slate-100"><FaMapMarkerAlt /> Office Map</a>
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="section-title">Featured Properties</h2>
        <PropertySlider items={featured} />
      </section>

      <section className="mt-10">
        <h2 className="section-title">Property Categories</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {PROPERTY_TYPES.map((cat) => (
            <Link key={cat} to={`/properties?propertyType=${cat}`} className="card text-center text-base font-semibold hover:border-brand-500">{cat}</Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="section-title">Trending Properties</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trending.map((item) => <PropertyCard key={item._id} item={item} compact />)}
        </div>
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-3">
        <article className="card lg:col-span-2">
          <h2 className="section-title text-2xl">About Owner</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-[110px_1fr]">
            <img src={OWNER_PROFILE.photo} alt={OWNER_PROFILE.name} className="h-28 w-28 rounded-2xl object-cover" loading="lazy" />
            <div>
              <p className="text-lg font-bold text-slate-900">{OWNER_PROFILE.name}</p>
              <p className="mt-1 text-sm text-slate-600">Experience: {OWNER_PROFILE.experienceYears}+ years in local real estate advisory</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                {OWNER_PROFILE.achievements.map((item) => <li key={item}>- {item}</li>)}
              </ul>
            </div>
          </div>
        </article>

        <article className="card">
          <h3 className="text-lg font-bold">Service Area</h3>
          <p className="mt-2 text-sm text-slate-700">Districts in Sagar Division:</p>
          <p className="mt-1 text-sm text-slate-600">{SERVICE_AREA.divisionDistricts.join(", ")}</p>
          <p className="mt-3 text-sm font-semibold text-slate-800">Primary Sagar Tehsil Coverage:</p>
          <p className="mt-1 text-xs text-slate-600">{SERVICE_AREA.primaryLocations.join(", ")}</p>
        </article>
      </section>

      <section className="mt-10">
        <h2 className="section-title">Recently Sold Properties</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentlySold.map((item) => <PropertyCard key={item._id} item={item} compact />)}
          {!recentlySold.length && <p className="text-sm text-slate-500">No sold inventory available yet.</p>}
        </div>
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <article className="card">
          <h2 className="section-title text-2xl">Customer Testimonials</h2>
          <div className="mt-4 grid gap-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm text-slate-700">"{testimonial.text}"</p>
                <p className="mt-2 text-xs font-semibold text-brand-700">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <h3 className="text-lg font-bold">New Property Alerts</h3>
          <p className="mt-1 text-xs text-slate-600">Get notified when matching listings are added.</p>
          <form className="mt-3 grid gap-2" onSubmit={submitAlert}>
            <input className="input" required placeholder="Name" value={alertForm.name} onChange={(e) => setAlertForm((prev) => ({ ...prev, name: e.target.value }))} />
            <input className="input" required type="email" placeholder="Email" value={alertForm.email} onChange={(e) => setAlertForm((prev) => ({ ...prev, email: e.target.value }))} />
            <input className="input" placeholder="Phone" value={alertForm.phone} onChange={(e) => setAlertForm((prev) => ({ ...prev, phone: e.target.value }))} />
            <select className="input" value={alertForm.preferredLocation} onChange={(e) => setAlertForm((prev) => ({ ...prev, preferredLocation: e.target.value }))}>
              <option value="">Preferred Location</option>
              {SERVICE_AREA.primaryLocations.map((location) => <option key={location}>{location}</option>)}
            </select>
            <select className="input" value={alertForm.propertyType} onChange={(e) => setAlertForm((prev) => ({ ...prev, propertyType: e.target.value }))}>
              <option value="">Property Type</option>
              {PROPERTY_TYPES.map((type) => <option key={type}>{type}</option>)}
            </select>
            <input className="input" type="number" placeholder="Max Budget (INR)" value={alertForm.maxPrice} onChange={(e) => setAlertForm((prev) => ({ ...prev, maxPrice: e.target.value }))} />
            <button className="btn-primary" type="submit">Subscribe Alerts</button>
          </form>
          {alertStatus && <p className="mt-2 text-xs text-slate-600">{alertStatus}</p>}
        </article>
      </section>
    </>
  );
};

export default HomePage;
