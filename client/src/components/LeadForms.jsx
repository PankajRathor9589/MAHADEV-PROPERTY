import { useState } from 'react';
import { bookVisit, submitCallback, submitInquiry } from '../services/api';

const initial = { name: '', phone: '', message: '', propertyId: '' };

const LeadForms = ({ propertyId = '' }) => {
  const [form, setForm] = useState({ ...initial, propertyId });
  const [visitDate, setVisitDate] = useState('');

  const submit = async (kind) => {
    const payload = { ...form, propertyId };
    if (kind === 'inquiry') await submitInquiry(payload);
    if (kind === 'callback') await submitCallback(payload);
    if (kind === 'visit') await bookVisit({ ...payload, visitDate });
    alert('Request submitted successfully!');
    setForm({ ...initial, propertyId });
    setVisitDate('');
  };

  return (
    <div className="grid md:grid-cols-3 gap-3 text-sm">
      <input className="border rounded-lg px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input className="border rounded-lg px-3 py-2" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <input className="border rounded-lg px-3 py-2" placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      <button onClick={() => submit('inquiry')} className="touch-btn bg-brand-500 text-white">Property Inquiry</button>
      <button onClick={() => submit('callback')} className="touch-btn bg-slate-800 text-white">Request Callback</button>
      <div className="flex gap-2"><input type="date" className="border rounded-lg px-3 py-2 w-full" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} /><button onClick={() => submit('visit')} className="touch-btn bg-emerald-600 text-white">Book Site Visit</button></div>
    </div>
  );
};

export default LeadForms;
