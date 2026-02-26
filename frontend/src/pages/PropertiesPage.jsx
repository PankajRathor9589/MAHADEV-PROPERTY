import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { propertyApi, userApi } from "../api/services";
import PropertyCard from "../components/property/PropertyCard";
import PropertyFilters from "../components/property/PropertyFilters";
import Seo from "../components/ui/Seo";
import { useAuth } from "../context/AuthContext";

const PropertiesPage = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({});
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const { user } = useAuth();

  const initFilters = useMemo(() => ({
    city: searchParams.get("city") || "",
    propertyType: searchParams.get("propertyType") || ""
  }), [searchParams]);

  const fetchProperties = async (extra = {}) => {
    const { data } = await propertyApi.list({ ...filters, ...extra, page: 1, limit: 12 });
    setItems(data.items);
    setMeta(data.meta);
  };

  useEffect(() => {
    setFilters(initFilters);
  }, [initFilters]);

  useEffect(() => {
    fetchProperties(initFilters);
  }, [initFilters]);

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
      <PropertyFilters filters={filters} setFilters={setFilters} onSearch={() => fetchProperties()} onReset={() => { setFilters({}); fetchProperties({}); }} />
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
