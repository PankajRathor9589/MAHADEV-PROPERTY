import { FileCheck2, GraduationCap, Route, School2, Shovel } from "lucide-react";
import { CONTRACTOR_SERVICES, SERVICES_DESCRIPTION } from "../data/siteContent.js";

const iconMap = {
  "National Highway Projects": Route,
  "School & College Construction": School2,
  "Government Contracts": FileCheck2,
  "Verified Property Support": GraduationCap
};

const ServicesSection = () => {
  return (
    <section id="services" className="section-shell space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600">Services</p>
          <h2 className="section-title mt-2">Government contracts, construction, and plot development with responsive local support</h2>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-ink-500">{SERVICES_DESCRIPTION}</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {CONTRACTOR_SERVICES.map((service, index) => {
          const Icon = iconMap[service.title] || Shovel;

          return (
            <article key={service.title} className="card card-hover h-full space-y-4">
              <span className="inline-flex rounded-2xl bg-brand-50 p-3 text-brand-700">
                <Icon size={20} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-500">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-xl font-semibold text-ink-700">{service.title}</h3>
                <p className="mt-3 line-clamp-4 text-sm leading-7 text-ink-500">{service.copy}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {service.highlights?.map((highlight) => (
                  <span key={highlight} className="pill">
                    {highlight}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ServicesSection;
