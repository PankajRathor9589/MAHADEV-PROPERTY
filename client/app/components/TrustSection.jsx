import { BadgeCheck, FileText, Landmark, ShieldCheck } from "lucide-react";
import { TRUST_PILLARS } from "../data/siteContent.js";

const icons = [BadgeCheck, Landmark, ShieldCheck, FileText];

const TrustSection = () => {
  return (
    <section id="trust" className="section-shell space-y-5">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-200/80">Trust Signals</p>
        <h2 className="section-title mt-2">Proof-led trust for serious construction and contractor work</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {TRUST_PILLARS.map((item, index) => {
          const Icon = icons[index % icons.length];

          return (
            <article key={item.title} className="card card-hover">
              <span className="inline-flex rounded-2xl border border-gold-300/20 bg-gold-300/10 p-3 text-gold-100">
                <Icon size={18} />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/60">{item.copy}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default TrustSection;
