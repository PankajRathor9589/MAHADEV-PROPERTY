import { ArrowRight, Phone, ShieldCheck } from "lucide-react";
import { COMPANY_INFO, OWNER_SECTION } from "../data/siteContent.js";
import { toPhoneHref, toWhatsAppHref } from "../utils/format.js";

const OwnerSection = () => {
  return (
    <section id="owner" className="section-shell space-y-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <article className="card surface-grid md:col-span-2 xl:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600">Owner</p>
          <h2 className="section-title mt-2">{OWNER_SECTION.title}</h2>
          <p className="mt-4 text-sm leading-8 text-ink-500">{OWNER_SECTION.copy}</p>
          <div className="mt-5 rounded-2xl border border-brand-100 bg-brand-50 p-4 text-sm leading-7 text-ink-600">
            {OWNER_SECTION.note}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href={toPhoneHref(COMPANY_INFO.phoneDisplay)} className="btn-primary w-full sm:w-auto">
              <Phone size={16} />
              Call Now
            </a>
            <a
              href={toWhatsAppHref(
                COMPANY_INFO.whatsappNumber,
                `Hi ${COMPANY_INFO.name}, I want a free consultation with ${COMPANY_INFO.owner}.`
              )}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary w-full sm:w-auto"
            >
              Get Free Consultation
              <ArrowRight size={16} />
            </a>
          </div>
        </article>

        <article className="card card-hover h-full">
          <span className="inline-flex rounded-2xl bg-brand-50 p-3 text-brand-700">
            <ShieldCheck size={18} />
          </span>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.28em] text-brand-500">Direct Owner Connect</p>
          <p className="mt-3 text-2xl font-semibold text-ink-700">Prashant Rathor</p>
          <p className="mt-3 text-sm leading-7 text-ink-500">
            Speak directly with the owner for contracts, plotting discussions, documentation, and serious project planning.
          </p>
        </article>

        <article className="card card-hover h-full">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-500">Trust Message</p>
          <h3 className="mt-3 text-xl font-semibold text-ink-700">Clear advice, visible proof, and local accountability</h3>
          <p className="mt-3 text-sm leading-7 text-ink-500">
            The goal is simple: make it easy for clients in Sagar MP to feel confident before they call, visit, or move forward.
          </p>
        </article>
      </div>
    </section>
  );
};

export default OwnerSection;
