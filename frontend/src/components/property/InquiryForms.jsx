import { useState } from "react";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { inquiryApi } from "../../api/services";
import { OWNER_PROFILE } from "../../config/site";

const InquiryForms = ({ propertyId }) => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "", preferredDate: "" });
  const [type, setType] = useState("inquiry");
  const [status, setStatus] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await inquiryApi.create({ ...form, property: propertyId, leadType: type, preferredDate: form.preferredDate || undefined });
      setStatus("Submitted successfully");
      setForm({ name: "", phone: "", email: "", message: "", preferredDate: "" });
    } catch {
      setStatus("Failed to submit");
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-bold">Contact Dealer</h3>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <a href={`tel:${OWNER_PROFILE.phoneRaw}`} className="btn-primary"><FaPhoneAlt /> One-click Call</a>
        <a href={`https://wa.me/${OWNER_PROFILE.whatsappRaw}`} target="_blank" rel="noreferrer" className="btn-outline"><FaWhatsapp /> WhatsApp Inquiry</a>
      </div>
      <form className="mt-3 grid gap-3" onSubmit={submit}>
        <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="inquiry">Property Inquiry</option>
          <option value="callback">Request Callback</option>
          <option value="site-visit">Book Site Visit</option>
        </select>
        <input className="input" required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" required placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        {type === "site-visit" && <input className="input" type="date" value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} />}
        <textarea className="input min-h-24" placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <button className="btn-primary" type="submit">Submit</button>
      </form>
      {status && <p className="mt-2 text-sm text-slate-600">{status}</p>}
    </div>
  );
};

export default InquiryForms;
