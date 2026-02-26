import { useEffect, useState } from "react";
import { userApi } from "../api/services";
import Seo from "../components/ui/Seo";
import { formatPrice } from "../utils/format";

const ComparePage = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    userApi.collections().then((res) => setItems(res.data.compareList || []));
  }, []);

  return (
    <>
      <Seo title="Compare" />
      <h1 className="section-title">Compare Properties</h1>
      {items.length ? (
        <div className="mt-4 overflow-auto">
          <table className="w-full min-w-[700px] overflow-hidden rounded-xl bg-white text-sm">
            <thead className="bg-slate-100 text-left">
              <tr><th className="p-3">Field</th>{items.map((x) => <th key={x._id} className="p-3">{x.title}</th>)}</tr>
            </thead>
            <tbody>
              <tr><td className="p-3 font-semibold">Price</td>{items.map((x) => <td key={x._id} className="p-3">{formatPrice(x.price)}</td>)}</tr>
              <tr><td className="p-3 font-semibold">Type</td>{items.map((x) => <td key={x._id} className="p-3">{x.propertyType}</td>)}</tr>
              <tr><td className="p-3 font-semibold">Area</td>{items.map((x) => <td key={x._id} className="p-3">{x.areaSqft} sqft</td>)}</tr>
              <tr><td className="p-3 font-semibold">BHK</td>{items.map((x) => <td key={x._id} className="p-3">{x.bedrooms}</td>)}</tr>
              <tr><td className="p-3 font-semibold">Bathrooms</td>{items.map((x) => <td key={x._id} className="p-3">{x.bathrooms}</td>)}</tr>
              <tr><td className="p-3 font-semibold">Location</td>{items.map((x) => <td key={x._id} className="p-3">{x.location?.locality}, {x.location?.city}</td>)}</tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4">No properties in compare list.</p>
      )}
    </>
  );
};

export default ComparePage;
