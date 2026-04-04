import { Eye, FileBadge2, ShieldCheck } from "lucide-react";
import { COMPANY_INFO, DOCUMENT_PROOFS } from "../data/siteContent.js";
import { toWhatsAppHref } from "../utils/format.js";

const DocumentProofSection = () => {
  return (
    <section id="documents" className="section-shell">
      <div className="card surface-grid overflow-hidden">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-200/80">
              Verified Work & Documents
            </p>
            <h2 className="section-title">Document-backed work that builds trust before the project starts in Sagar Madhya Pradesh</h2>
            <p className="text-sm leading-8 text-white/65">
              Sagar Infra works with documented agreements, government tender work, legal documentation, and verified
              contracts. Sensitive details are intentionally blurred here for privacy, while the overall documentation
              approach remains visible and trust-building.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-gold-100">
                  <ShieldCheck size={16} />
                  Verified contracts
                </p>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  Government tender work, legal paperwork, and agreement-backed execution.
                </p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-gold-100">
                  <Eye size={16} />
                  Privacy safe preview
                </p>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  Sensitive names, numbers, and signatures are blurred in preview cards for secure presentation.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {DOCUMENT_PROOFS.map((document) => (
              <article key={document.title} className="document-card card card-hover">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gold-300/25 bg-gold-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-gold-100">
                      <FileBadge2 size={14} />
                      PDF Preview
                    </span>
                    <h3 className="text-xl font-semibold text-white">{document.title}</h3>
                    <p className="text-sm text-white/45">{document.subtitle}</p>
                  </div>
                  <a
                    href={toWhatsAppHref(
                      COMPANY_INFO.whatsappNumber,
                      `Hi ${COMPANY_INFO.name}, please share more details about the verified document for ${document.title}.`
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary w-full sm:w-auto"
                  >
                    View Document
                  </a>
                </div>

                <p className="mt-4 text-sm leading-7 text-white/60">{document.copy}</p>

                <div className="mt-5 rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-white">Agreement Summary</span>
                    <span className="rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                      Verified
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="document-blur-line w-[92%]" />
                    <div className="document-blur-line w-[84%]" />
                    <div className="document-blur-line w-[76%]" />
                    <div className="document-blur-line w-[68%]" />
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/35">
                    Sensitive data blurred for privacy
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocumentProofSection;
