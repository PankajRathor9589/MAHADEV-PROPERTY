import { Eye, FileBadge2, ShieldCheck } from "lucide-react";
import { COMPANY_INFO, DOCUMENT_PROOFS } from "../data/siteContent.js";
import { toWhatsAppHref } from "../utils/format.js";

const DocumentProofSection = () => {
  return (
    <section id="documents" className="section-shell space-y-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="card surface-grid space-y-5 md:col-span-2 xl:col-span-1">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600">Document Proof</p>
            <h2 className="section-title mt-2">Verified documents that build trust before work starts</h2>
          </div>

          <p className="text-sm leading-8 text-ink-500">
            Sagar Infra shares verified documents and redacted proof previews so clients can see a documentation-first
            process without exposing private signatures or sensitive details.
          </p>

          <div className="grid gap-3">
            <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
                <ShieldCheck size={16} />
                Verified documents
              </p>
              <p className="mt-2 text-sm leading-6 text-ink-500">
                Agreements, contract paperwork, and trust signals are shown in a privacy-safe format.
              </p>
            </div>
            <div className="rounded-2xl border border-brand-100 bg-cream-100 p-4">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
                <Eye size={16} />
                Privacy note
              </p>
              <p className="mt-2 text-sm leading-6 text-ink-500">
                Sensitive names, numbers, and signatures are intentionally blurred in previews for secure sharing.
              </p>
            </div>
          </div>
        </div>

        {DOCUMENT_PROOFS.map((document) => (
          <article key={document.title} className="document-card card card-hover h-full space-y-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">
              <FileBadge2 size={14} />
              Verified PDF
            </span>

            <div>
              <h3 className="text-xl font-semibold text-ink-700">{document.title}</h3>
              <p className="mt-2 text-sm text-ink-400">{document.subtitle}</p>
              <p className="mt-3 line-clamp-4 text-sm leading-7 text-ink-500">{document.copy}</p>
            </div>

            <div className="rounded-2xl border border-brand-100 bg-cream-100 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-ink-700">Agreement Summary</span>
                <span className="badge bg-brand-500 text-white">Verified</span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="document-blur-line w-[92%]" />
                <div className="document-blur-line w-[84%]" />
                <div className="document-blur-line w-[76%]" />
                <div className="document-blur-line w-[68%]" />
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.3em] text-ink-400">Sensitive data blurred for privacy</p>
            </div>

            <a
              href={toWhatsAppHref(
                COMPANY_INFO.whatsappNumber,
                `Hi ${COMPANY_INFO.name}, please share more details about the verified document for ${document.title}.`
              )}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary w-full"
            >
              View Document
            </a>
          </article>
        ))}
      </div>
    </section>
  );
};

export default DocumentProofSection;
