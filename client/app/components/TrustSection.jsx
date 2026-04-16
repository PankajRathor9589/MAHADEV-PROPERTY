import { BadgeCheck, FileText, Landmark, ShieldCheck } from "lucide-react";
import { TRUST_PILLARS } from "../data/siteContent.js";

const icons = [BadgeCheck, Landmark, ShieldCheck, FileText];

const TrustSection = () => {
  return (
    <section id="trust" className="section-shell space-y-5">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600">Trust</p>
        <h2 className="section-title mt-2">Proof-led trust for serious construction and property decisions</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {TRUST_PILLARS.map((item, index) => {
          const Icon = icons[index % icons.length];

          return (
            <article key={item.title} className="card card-hover h-full">
              <span className="inline-flex rounded-2xl bg-brand-50 p-3 text-brand-700">
                <Icon size={18} />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink-700">{item.title}</h3>
              <p className="mt-3 line-clamp-4 text-sm leading-7 text-ink-500">{item.copy}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default TrustSection;
