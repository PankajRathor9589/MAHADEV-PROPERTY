import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { propertyApi, userApi } from "../api/services";
import PropertyCard from "../components/property/PropertyCard";
import PropertyFilters from "../components/property/PropertyFilters";
import Seo from "../components/ui/Seo";
import { useAuth } from "../context/AuthContext";

const PropertiesPage = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({ sizeUnit: "sqft" });
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [locationTree, setLocationTree] = useState([]);
  const { user } = useAuth();
  const mapQuery = filters.village || filters.tehsil || filters.district || filters.location || "";

  const initFilters = useMemo(() => ({
    location: searchParams.get("location") || "",
    district: searchParams.get("district") || "",
    tehsil: searchParams.get("tehsil") || "",
    village: searchParams.get("village") || "",
    propertyType: searchParams.get("propertyType") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sizeUnit: searchParams.get("sizeUnit") || "sqft"
  }), [searchParams]);

  const fetchProperties = async (extra = {}) => {
    const params = { ...filters, ...extra, page: 1, limit: 12 };
    Object.keys(params).forEach((key) => {
      if (params[key] === "" || params[key] === undefined || params[key] === null) delete params[key];
    });
    const { data } = await propertyApi.list(params);
    setItems(data.items);
    setMeta(data.meta);
  };

  useEffect(() => {
    setFilters(initFilters);
  }, [initFilters]);

  useEffect(() => {
    fetchProperties(initFilters);
  }, [initFilters]);

  useEffect(() => {
    propertyApi.locationTree().then((res) => setLocationTree(res.data.items || [])).catch(() => setLocationTree([]));
  }, []);

  const onFavorite = async (id) => {
    if (!user) return;
    await userApi.toggleFavorite(id);
    alert("Updated favorites");
  };

  const onCompare = async (id) => {
    if (!user) return;
    try {
      await userApi.toggleCompare(id);
      alert("Updated compare list");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to compare");
    }
  };

  return (
    <>
      <Seo title="Properties" />
      <PropertyFilters
        filters={filters}
        setFilters={setFilters}
        locationTree={locationTree}
        onSearch={() => fetchProperties()}
        onReset={() => {
          const reset = { sizeUnit: "sqft" };
          setFilters(reset);
          fetchProperties(reset);
        }}
      />
      {mapQuery && (
        <section className="card mt-4 space-y-2">
          <h2 className="text-lg font-bold">Map View: {mapQuery}</h2>
          <iframe
            title="Location map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(`${mapQuery}, Madhya Pradesh, India`)}&z=11&output=embed`}
            className="h-64 w-full rounded-xl border-0"
            loading="lazy"
          />
          <a
            className="btn-outline"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${mapQuery}, Madhya Pradesh, India`)}`}
            target="_blank"
            rel="noreferrer"
          >
            Open Full Map
          </a>
        </section>
      )}
      <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <PropertyCard key={item._id} item={item} onFavorite={onFavorite} onCompare={onCompare} />
        ))}
      </section>
      {meta && <p className="mt-4 text-sm text-slate-600">Showing {items.length} of {meta.total} properties</p>}
    </>
  );
};

export default PropertiesPage;
