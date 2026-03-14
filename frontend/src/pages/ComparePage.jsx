import { useEffect, useState } from "react";
import { FaBalanceScale, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { propertyApi } from "../api/services";
import Seo from "../components/ui/Seo";
import { PropertyCardSkeleton } from "../components/ui/Skeletons";
import { useApp } from "../context/AppContext";
import { formatArea, formatPrice } from "../utils/format";

const ComparePage = () => {
  const { compareIds, removeFromCompare, clearCompare } = useApp();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (compareIds.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const results = await Promise.all(compareIds.map((id) => propertyApi.byId(id)));
        setItems(results.filter(Boolean));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [compareIds]);

  return (
    <>
      <Seo
        title="Compare Properties"
        description="Compare selected properties by price, area, bedrooms, and location."
        keywords="property compare, compare real estate listings"
      />

      <section className="panel-card overflow-hidden p-0">
        <div className="grid gap-6 p-6 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="surface-label">Property compare</p>
              <h1 className="section-heading mt-2 text-4xl">Compare two properties side by side</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Review price, area, bedrooms, and location at a glance before you decide which property deserves the next call or site visit.
              </p>
            </div>
            {compareIds.length > 0 && (
              <button type="button" onClick={clearCompare} className="btn-secondary">
                <FaTimes />
                Clear compare
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="mt-8">
        {loading ? (
          <div className="grid gap-5 lg:grid-cols-2">
            <PropertyCardSkeleton />
            <PropertyCardSkeleton />
          </div>
        ) : items.length === 0 ? (
          <div className="panel-card p-10 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-brand-600">
              <FaBalanceScale />
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-ink">No properties selected for compare</h2>
            <p className="mt-3 text-sm text-slate-600">Use the compare button on any property card to add up to two listings here.</p>
            <Link to="/properties" className="btn-primary mt-6">
              Browse properties
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-5 lg:grid-cols-2">
              {items.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-[30px] border border-white/70 bg-white/88 shadow-card">
                  <img src={item.images?.[0]?.url} alt={item.title} className="h-56 w-full object-cover" loading="lazy" decoding="async" />
                  <div className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="surface-label">{item.propertyType}</p>
                        <h2 className="mt-2 text-2xl font-semibold text-ink">{item.title}</h2>
                        <p className="mt-2 text-sm text-slate-600">{item.location}</p>
                      </div>
                      <button type="button" onClick={() => removeFromCompare(item.id)} className="btn-secondary px-3 py-2">
                        <FaTimes />
                      </button>
                    </div>
                    <Link to={`/properties/${item.id}`} className="btn-primary">
                      View full details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="overflow-auto rounded-[30px] border border-white/70 bg-white/88 shadow-card">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">Field</th>
                    {items.map((item) => (
                      <th key={item.id} className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">
                        {item.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-100">
                    <td className="px-5 py-4 font-semibold text-ink">Price</td>
                    {items.map((item) => (
                      <td key={item.id} className="px-5 py-4 text-slate-700">
                        {formatPrice(item.price)}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t border-slate-100">
                    <td className="px-5 py-4 font-semibold text-ink">Area</td>
                    {items.map((item) => (
                      <td key={item.id} className="px-5 py-4 text-slate-700">
                        {formatArea(item.area)}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t border-slate-100">
                    <td className="px-5 py-4 font-semibold text-ink">Bedrooms</td>
                    {items.map((item) => (
                      <td key={item.id} className="px-5 py-4 text-slate-700">
                        {item.bedrooms || 0}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t border-slate-100">
                    <td className="px-5 py-4 font-semibold text-ink">Location</td>
                    {items.map((item) => (
                      <td key={item.id} className="px-5 py-4 text-slate-700">
                        {item.location}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t border-slate-100">
                    <td className="px-5 py-4 font-semibold text-ink">Property type</td>
                    {items.map((item) => (
                      <td key={item.id} className="px-5 py-4 text-slate-700">
                        {item.propertyType}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ComparePage;
