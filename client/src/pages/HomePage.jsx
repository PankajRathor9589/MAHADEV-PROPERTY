import { useEffect, useState } from 'react';
import { fetchProperties } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import FilterBar from '../components/FilterBar';
import LeadForms from '../components/LeadForms';

const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({ location: '', propertyType: '', minPrice: '', maxPrice: '', bhk: '', status: '' });

  useEffect(() => {
    fetchProperties(filters).then((res) => setProperties(res.data.data));
  }, [filters]);

  return (
    <div className="space-y-12">
      <section className="bg-gradient-to-r from-brand-500 to-cyan-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold">Find Verified Village & City Properties</h1>
          <p className="mt-3 max-w-2xl">Buy, rent, or invest in plots, houses, flats, and commercial spaces with trusted local support.</p>
          <div className="mt-6"><FilterBar filters={filters} setFilters={setFilters} /></div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <h2 className="section-title">Featured & Trending Properties</h2>
        <div className="grid md:grid-cols-3 gap-5 mt-5">{properties.slice(0, 6).map((property) => <PropertyCard key={property._id} property={property} />)}</div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <h2 className="section-title">Why Choose Mahadev Property</h2>
        <div className="grid md:grid-cols-4 gap-4 mt-4 text-sm">
          {['Verified Listings', 'Low-bandwidth Optimized', 'WhatsApp-first Support', 'Transparent Pricing'].map((item) => (
            <div key={item} className="bg-white border border-slate-200 p-4 rounded-xl">{item}</div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <h2 className="section-title">Contact & Lead Forms</h2>
        <div className="bg-white border rounded-2xl p-4 mt-4"><LeadForms /></div>
      </section>
    </div>
  );
};

export default HomePage;
