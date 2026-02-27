import { FaBath, FaBed, FaExpandArrowsAlt, FaMapMarkerAlt } from "react-icons/fa";
import { formatArea } from "../../utils/format";

const PropertySpecs = ({ property }) => (
  <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-5">
    <div className="flex items-center gap-2 text-sm"><FaBed className="text-brand-600" /> {property.bedrooms} Bedrooms</div>
    <div className="flex items-center gap-2 text-sm"><FaBath className="text-brand-600" /> {property.bathrooms} Bathrooms</div>
    <div className="flex items-center gap-2 text-sm"><FaExpandArrowsAlt className="text-brand-600" /> {formatArea(property.areaValue || property.areaSqft, property.areaUnit || "sqft")}</div>
    <div className="flex items-center gap-2 text-sm"><FaMapMarkerAlt className="text-brand-600" /> {property.location.tehsil}</div>
    <div className="flex items-center gap-2 text-sm">{property.landStatus || "Ready to Move"}</div>
  </div>
);

export default PropertySpecs;
