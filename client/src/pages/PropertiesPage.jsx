import { useEffect, useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import FilterBar from '../components/FilterBar';
import { fetchProperties } from '../services/api';

const PropertiesPage = () => {
  const [filters, setFilters] = useState({ location: '', propertyType: '', minPrice: '', maxPrice: '', bhk: '', status: '' });
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchProperties(filters).then((res) => setProperties(res.data.data));
  }, [filters]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="section-title">Search Properties</h1>
      <div className="mt-4"><FilterBar filters={filters} setFilters={setFilters} /></div>
      <div className="grid md:grid-cols-3 gap-5 mt-5">{properties.map((p) => <PropertyCard key={p._id} property={p} />)}</div>
    </main>
  );
};

export default PropertiesPage;
