import { useState } from "react";
import { FaPaperPlane, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { propertyApi } from "../../api/services";
import { CONTACT } from "../../config/site";

const ContactAgentForm = ({ property }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: `Hi, I would like to know more about ${property.title}.`
  });
  const [status, setStatus] = useState({ kind: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const agentPhone = property.agent?.phone || CONTACT.phone;
  const whatsapp = property.agent?.whatsapp || CONTACT.whatsappRaw;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ kind: "", message: "" });

    try {
      await propertyApi.inquire(property.id, form);
      setStatus({ kind: "success", message: "Inquiry sent. The agent will get back to you soon." });
      setForm({
        name: "",
        phone: "",
        email: "",
        message: `Hi, I would like to know more about ${property.title}.`
      });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error.response?.data?.message || "Unable to send inquiry right now."
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="panel-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="surface-label">Contact agent form</p>
          <h3 className="mt-1 text-2xl font-semibold text-ink">{property.agent?.name || "Mahadev Property"}</h3>
          <p className="mt-2 text-sm text-slate-600">{agentPhone}</p>
        </div>
        <div className="flex gap-2">
          <a href={`tel:${agentPhone.replace(/[^\d+]/g, "")}`} className="btn-secondary">
            <FaPhoneAlt />
            Call
          </a>
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi, I am interested in ${property.title}`)}`}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
          >
            <FaWhatsapp />
            WhatsApp
          </a>
        </div>
      </div>

      <form className="mt-6 grid gap-3" onSubmit={handleSubmit}>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="field"
            placeholder="Your name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
          <input
            className="field"
            placeholder="Phone number"
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            required
          />
        </div>
        <input
          className="field"
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
        />
        <textarea
          className="field min-h-[140px]"
          placeholder="Tell the agent what you need"
          value={form.message}
          onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
        />
        <button type="submit" className="btn-primary w-full sm:w-auto" disabled={submitting}>
          <FaPaperPlane />
          {submitting ? "Sending..." : "Send inquiry"}
        </button>
      </form>

      {status.message && (
        <p className={`mt-4 text-sm ${status.kind === "error" ? "text-rose-600" : "text-emerald-600"}`}>
          {status.message}
        </p>
      )}
    </section>
  );
};

export default ContactAgentForm;
