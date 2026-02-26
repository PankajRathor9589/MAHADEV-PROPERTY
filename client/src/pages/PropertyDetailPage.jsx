import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPropertyById } from '../services/api';
import LeadForms from '../components/LeadForms';
import { useApp } from '../context/AppContext';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const { markViewed } = useApp();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    fetchPropertyById(id).then((res) => {
      setProperty(res.data.data);
      markViewed(id);
    });
  }, [id, markViewed]);

  if (!property) return <div className="p-8">Loading...</div>;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2 space-y-5">
        <img src={property.images[0]} alt={property.title} className="w-full h-80 object-cover rounded-2xl" />
        <h1 className="text-3xl font-bold">{property.title}</h1>
        <p className="text-2xl text-brand-600 font-extrabold">₹ {property.price.toLocaleString()}</p>
        <p>{property.description}</p>
        <div>
          <h3 className="font-semibold mb-2">Highlights</h3>
          <ul className="grid sm:grid-cols-2 gap-2 list-disc pl-5">{property.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Nearby Places</h3>
          <ul className="grid sm:grid-cols-2 gap-2 list-disc pl-5">{property.nearbyPlaces.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <iframe title="Google Map" loading="lazy" className="w-full h-72 rounded-2xl"
          src={`https://www.google.com/maps?q=${property.location.coordinates.lat},${property.location.coordinates.lng}&z=14&output=embed`} />
      </section>
      <aside className="space-y-4">
        <div className="bg-white rounded-2xl border p-4">
          <h3 className="font-bold">Dealer Profile</h3>
          <p className="mt-2">{property.agent.name} • {property.agent.experienceYears} years</p>
          <p>Agency: Mahadev Property ✅ Verified</p>
          <a className="touch-btn bg-brand-500 text-white inline-block mt-3" href={`tel:${property.agent.phone}`}>Call Now</a>
          <a className="touch-btn bg-green-500 text-white inline-block mt-3 ml-2" href={`https://wa.me/${property.agent.whatsapp}`}>WhatsApp</a>
        </div>
        <div className="bg-white rounded-2xl border p-4">
          <h3 className="font-bold mb-3">Inquire</h3>
          <LeadForms propertyId={id} />
        </div>
      </aside>
    </main>
  );
};

export default PropertyDetailPage;
