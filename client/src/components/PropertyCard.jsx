import { Heart, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const PropertyCard = ({ property }) => {
  const { favorites, toggleFavorite } = useApp();
  return (
    <article className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
      <img src={property.images[0]} alt={property.title} loading="lazy" className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-slate-900">{property.title}</h3>
          <button onClick={() => toggleFavorite(property._id)}><Heart className={`w-5 h-5 ${favorites.includes(property._id) ? 'fill-red-500 text-red-500' : ''}`} /></button>
        </div>
        <p className="text-brand-600 font-bold mt-1">₹ {property.price.toLocaleString()}</p>
        <p className="text-sm text-slate-600 mt-2 flex items-center gap-1"><MapPin className="w-4 h-4" /> {property.location.area}, {property.location.city}</p>
        <div className="mt-3 text-xs text-slate-500">{property.bedrooms} BHK • {property.areaSqFt} sq ft • {property.status}</div>
        <Link to={`/properties/${property._id}`} className="touch-btn block text-center bg-brand-500 text-white mt-4">View Details</Link>
      </div>
    </article>
  );
};

export default PropertyCard;
