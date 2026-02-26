import { useEffect, useState } from 'react';
import { fetchProperties } from '../services/api';

const ComparePage = () => {
  const [properties, setProperties] = useState([]);
  useEffect(() => { fetchProperties().then((res) => setProperties(res.data.data.slice(0, 3))); }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="section-title">Compare Properties</h1>
      <div className="overflow-auto mt-4 bg-white border rounded-xl">
        <table className="w-full text-sm min-w-[700px]"><thead><tr className="bg-slate-100"><th className="p-3 text-left">Feature</th>{properties.map((p) => <th key={p._id} className="p-3 text-left">{p.title}</th>)}</tr></thead>
          <tbody>
            <tr><td className="p-3">Price</td>{properties.map((p) => <td key={p._id} className="p-3">₹ {p.price.toLocaleString()}</td>)}</tr>
            <tr><td className="p-3">Type</td>{properties.map((p) => <td key={p._id} className="p-3">{p.propertyType}</td>)}</tr>
            <tr><td className="p-3">Area</td>{properties.map((p) => <td key={p._id} className="p-3">{p.areaSqFt} sq ft</td>)}</tr>
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default ComparePage;
