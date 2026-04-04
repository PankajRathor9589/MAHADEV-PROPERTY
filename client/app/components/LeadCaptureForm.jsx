import { ArrowRight, CheckCircle2, PhoneCall } from "lucide-react";
import { useEffect, useState } from "react";
import { COMPANY_INFO } from "../data/siteContent.js";
import { submitLead } from "../services/api.js";
import { toPhoneHref } from "../utils/format.js";

const baseForm = {
  name: "",
  phone: "",
  requirement: ""
};

const LeadCaptureForm = ({
  title,
  description,
  submitLabel = "Submit Requirement",
  successMessage = "Your request has been shared with our team.",
  propertyId = "",
  source = "homepage",
  requirementSeed = "",
  compact = false
}) => {
  const [form, setForm] = useState(baseForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!requirementSeed) {
      return;
    }

    setForm((prev) => {
      if (prev.requirement) {
        return prev;
      }

      return { ...prev, requirement: requirementSeed };
    });
  }, [requirementSeed]);

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
        message: form.requirement
      });

      setSuccess(successMessage);
      setForm(baseForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`card ${compact ? "space-y-4" : "space-y-5"}`}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold-200/80">Contact Form</p>
        <h3 className={`${compact ? "text-2xl" : "text-3xl"} mt-2 font-display font-semibold text-white`}>
          {title}
        </h3>
        {description ? <p className="mt-2 text-sm leading-6 text-white/65">{description}</p> : null}
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
        <textarea
          className="textarea-field"
          name="requirement"
          value={form.requirement}
          onChange={handleChange}
          placeholder="Requirement"
          required
        />
      </div>

      {error ? <p className="rounded-2xl bg-rose-500/12 px-4 py-3 text-sm text-rose-200">{error}</p> : null}
      {success ? (
        <p className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/12 px-4 py-3 text-sm text-emerald-200">
          <CheckCircle2 size={16} /> {success}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Submitting..." : submitLabel}
          {!submitting && <ArrowRight size={16} />}
        </button>
        <a href={toPhoneHref(COMPANY_INFO.phoneDisplay)} className="btn-secondary">
          <PhoneCall size={16} />
          Call {COMPANY_INFO.phoneDisplay}
        </a>
      </div>
    </form>
  );
};

export default LeadCaptureForm;
