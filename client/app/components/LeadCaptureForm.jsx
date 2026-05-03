import { ArrowRight, CheckCircle2, MessageCircleMore, PhoneCall } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { COMPANY_INFO } from "../data/siteContent.js";
import { submitLead } from "../services/api.js";
import { toPhoneHref, toWhatsAppHref } from "../utils/format.js";

const LeadCaptureForm = ({
  title,
  description,
  submitLabel = "Submit Requirement",
  successMessage = "Your requirement has been shared with Sagar Infra.",
  propertyId = "",
  source = "homepage",
  requirementSeed = "",
  compact = false,
  showEmail = false,
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
    setForm((current) => ({
      ...current,
      serviceType: current.serviceType || serviceOptions[0]?.value || "",
      requirement: current.requirement || requirementSeed
    }));
  }, [requirementSeed, serviceOptions]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const whatsappHref = useMemo(() => {
    const lines = [
      `Hi SAGAR INFRA, I want to submit a ${source.replace(/_/g, " ")} enquiry.`,
      form.name ? `Name: ${form.name}` : "",
      form.phone ? `Phone: ${form.phone}` : "",
      form.location ? `Location: ${form.location}` : "",
      form.serviceType ? `Requirement Type: ${form.serviceType}` : "",
      form.requirement ? `Requirement: ${form.requirement}` : ""
    ].filter(Boolean);

    return toWhatsAppHref(COMPANY_INFO.whatsappNumber, lines.join("\n"));
  }, [form.location, form.name, form.phone, form.requirement, form.serviceType, source]);

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
        requirement: form.requirement,
        message: form.requirement
      });

      setSuccess(successMessage);
      setForm(getBaseForm());
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`card ${compact ? "space-y-4" : "space-y-5"}`}>
      <div>
        <p className="section-kicker">Inquiry Form</p>
        <h3 className={`${compact ? "text-2xl" : "text-3xl"} mt-2 font-semibold text-ink-900`}>{title}</h3>
        {description ? <p className="mt-2 text-sm leading-7 text-ink-500">{description}</p> : null}
      </div>

      <div className="grid gap-3">
        <input
          className="input-field"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
          required
        />
        <input
          className="input-field"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone number"
          required
        />

        {showEmail ? (
          <input
            className="input-field"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email address"
          />
        ) : null}

        {showLocation ? (
          <input
            className="input-field"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Preferred location"
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
          <CheckCircle2 size={16} />
          {success}
        </p>
      ) : null}

      <div className="rounded-[24px] border border-[#eee2d2] bg-[#faf6ef] px-4 py-4 text-xs leading-6 text-ink-500">
        Your inquiry goes to the protected lead system and can also be continued instantly on WhatsApp for faster
        response.
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button type="submit" className="btn-primary w-full sm:w-auto" disabled={submitting}>
          {submitting ? "Submitting..." : submitLabel}
          {!submitting ? <ArrowRight size={16} /> : null}
        </button>
        <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-whatsapp w-full sm:w-auto">
          <MessageCircleMore size={16} />
          Send on WhatsApp
        </a>
        <a href={toPhoneHref(COMPANY_INFO.phoneDisplay)} className="btn-secondary w-full sm:w-auto">
          <PhoneCall size={16} />
          Call {COMPANY_INFO.phoneDisplay}
        </a>
      </div>
    </form>
  );
};

export default LeadCaptureForm;
