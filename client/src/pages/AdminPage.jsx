import { useEffect, useState } from 'react';
import { fetchProperties } from '../services/api';

const AdminPage = () => {
  const [properties, setProperties] = useState([]);
  useEffect(() => { fetchProperties().then((res) => setProperties(res.data.data)); }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <h1 className="section-title">Admin Dashboard</h1>
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4"><p className="text-sm text-slate-500">Total Listings</p><p className="text-2xl font-bold">{properties.length}</p></div>
        <div className="bg-white rounded-xl border p-4"><p className="text-sm text-slate-500">Leads</p><p className="text-2xl font-bold">142</p></div>
        <div className="bg-white rounded-xl border p-4"><p className="text-sm text-slate-500">Views</p><p className="text-2xl font-bold">7,201</p></div>
        <div className="bg-white rounded-xl border p-4"><p className="text-sm text-slate-500">Reported</p><p className="text-2xl font-bold">4</p></div>
      </div>
      <div className="bg-white border rounded-2xl p-4">
        <h2 className="font-bold mb-3">Property Management</h2>
        <ul className="space-y-2 text-sm">{properties.map((p) => <li key={p._id} className="flex justify-between"><span>{p.title}</span><span>{p.status}</span></li>)}</ul>
      </div>
    </main>
  );
};

export default AdminPage;
