import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { propertyApi } from "../api/services";
import PropertyCard from "../components/property/PropertyCard";
import Seo from "../components/ui/Seo";
import PropertySlider from "../components/ui/PropertySlider";

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    Promise.all([propertyApi.featured(), propertyApi.trending()]).then(([f, t]) => {
      setFeatured(f.data.items || []);
      setTrending(t.data.items || []);
    });
  }, []);

  return (
    <>
      <Seo title="Home" />
      <section className="rounded-2xl bg-slate-900 px-5 py-14 text-white">
        <h1 className="max-w-xl text-3xl font-bold leading-tight md:text-5xl">Find Verified Properties in Indore</h1>
        <p className="mt-3 max-w-lg text-slate-300">Explore apartments, villas, independent homes, shops, and farmhouses across Vijay Nagar, Rau, Super Corridor, Bypass Road, and Bengali Square.</p>
        <div className="mt-5 flex flex-col gap-3 rounded-xl bg-white/10 p-3 sm:flex-row">
          <input className="input border-0 bg-white text-slate-900" placeholder="Search by city or locality" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Link className="btn-primary" to={`/properties?city=${encodeURIComponent(query)}`}>Search</Link>
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="section-title">Featured Properties</h2>
        <PropertySlider items={featured} />
      </section>

      <section className="mt-10">
        <h2 className="section-title">Property Categories</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {["Apartment", "Independent House", "Luxury Villa", "Commercial Shop", "Farmhouse", "Budget Home"].map((cat) => (
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

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="card"><h3 className="font-bold">Why Choose Us</h3><p className="mt-2 text-sm">Local expertise, transparent listings, and WhatsApp-first support.</p></div>
        <div className="card"><h3 className="font-bold">Testimonials</h3><p className="mt-2 text-sm">"Best property dealer in our area." - Aman Jain</p></div>
        <div className="card"><h3 className="font-bold">Contact</h3><p className="mt-2 text-sm">Call: +91 7692016188</p><Link to="/contact" className="mt-3 inline-block text-brand-600">Open contact page</Link></div>
      </section>
    </>
  );
};

export default HomePage;
