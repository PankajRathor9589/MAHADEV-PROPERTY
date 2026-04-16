import { ArrowRight, CheckCircle2, PhoneCall } from "lucide-react";
import { useEffect, useState } from "react";
import { COMPANY_INFO } from "../data/siteContent.js";
import { submitLead } from "../services/api.js";
import { toPhoneHref } from "../utils/format.js";

const LeadCaptureForm = ({
  title,
  description,
  submitLabel = "Submit Requirement",
  successMessage = "Your request has been shared with our team.",
  propertyId = "",
  source = "homepage",
  requirementSeed = "",
  compact = false,
  showEmail = true,
  showLocation = false,
  serviceOptions = []
}) => {
  const getBaseForm = () => ({
    name: "",
    phone: "",
    email: "",
    location: "",
    serviceType: serviceOptions[0]?.value || "",
    requirement: requirementSeed || ""
  });

  const [form, setForm] = useState(getBaseForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      serviceType: prev.serviceType || serviceOptions[0]?.value || "",
      requirement: prev.requirement || requirementSeed
    }));
  }, [requirementSeed, serviceOptions]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await submitLead({
        propertyId,
        source,
        name: form.name,
        phone: form.phone,
        email: form.email,
        location: form.location,
        serviceType: form.serviceType,
        message: form.requirement
      });

      setSuccess(successMessage);
      setForm(getBaseForm());
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`card ${compact ? "space-y-4" : "space-y-5"}`}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-600">Contact Form</p>
        <h3 className={`${compact ? "text-2xl" : "text-3xl"} mt-2 font-display font-semibold text-ink-700`}>
          {title}
        </h3>
        {description ? <p className="mt-2 text-sm leading-7 text-ink-500">{description}</p> : null}
      </div>

      <div className="grid gap-3">
        <input
          className="input-field"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          className="input-field"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          required
        />
        {showEmail ? (
          <input
            className="input-field"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
          />
        ) : null}
        {showLocation ? (
          <input
            className="input-field"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
          />
        ) : null}
        {serviceOptions.length ? (
          <select className="input-field" name="serviceType" value={form.serviceType} onChange={handleChange}>
            {serviceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : null}
        <textarea
          className="textarea-field"
          name="requirement"
          value={form.requirement}
          onChange={handleChange}
          placeholder="Requirement"
          required
        />
      </div>

      {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
      {success ? (
        <p className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 size={16} /> {success}
        </p>
      ) : null}

      <p className="text-xs leading-6 text-ink-400">Your details stay private and are only used by Sagar Infra for follow-up.</p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="submit" className="btn-primary w-full sm:w-auto" disabled={submitting}>
          {submitting ? "Submitting..." : submitLabel}
          {!submitting ? <ArrowRight size={16} /> : null}
        </button>
        <a href={toPhoneHref(COMPANY_INFO.phoneDisplay)} className="btn-secondary w-full sm:w-auto">
          <PhoneCall size={16} />
          Call {COMPANY_INFO.phoneDisplay}
        </a>
      </div>
    </form>
  );
};

export default LeadCaptureForm;
