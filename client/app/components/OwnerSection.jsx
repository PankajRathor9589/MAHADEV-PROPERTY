import { ArrowRight, Phone, ShieldCheck } from "lucide-react";
import { COMPANY_INFO, OWNER_SECTION } from "../data/siteContent.js";
import { toPhoneHref, toWhatsAppHref } from "../utils/format.js";

const OwnerSection = () => {
  return (
    <section id="owner" className="section-shell">
      <div className="card glass-card-strong relative overflow-hidden">
        <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-gold-300/10 blur-3xl" />
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-200/80">Leadership & Trust</p>
            <h2 className="section-title">{OWNER_SECTION.title}</h2>
            <p className="text-sm leading-8 text-white/65">{OWNER_SECTION.copy}</p>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-white/60">
              {OWNER_SECTION.note}
            </div>
          </div>

          <div className="relative flex flex-col gap-4">
            <div className="rounded-[28px] border border-white/10 bg-slate-950/50 p-5">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-gold-100">
                <ShieldCheck size={16} />
                Direct owner connect
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">{COMPANY_INFO.owner}</p>
              <p className="mt-2 text-sm text-white/55">
                Trusted local contractor support for consultation, documentation discussion, and site coordination.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default OwnerSection;
