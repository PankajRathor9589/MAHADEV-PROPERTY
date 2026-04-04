import {
  Building2,
  GraduationCap,
  Hammer,
  Landmark,
  LayoutGrid,
  Route
} from "lucide-react";
import { CONTRACTOR_SERVICES, SERVICES_DESCRIPTION } from "../data/siteContent.js";

const iconMap = {
  "National Highway Contracts": Route,
  "School & College Construction": GraduationCap,
  "Government Projects": Landmark,
  "RCC Roads": Hammer,
  "Building Construction": Building2,
  "Plot Development": LayoutGrid
};

const ServicesSection = () => {
  return (
    <section id="services" className="section-shell space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-200/80">Services</p>
          <h2 className="section-title mt-2">Contractor-grade services for public and private projects</h2>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-white/60">{SERVICES_DESCRIPTION}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {CONTRACTOR_SERVICES.map((service, index) => {
          const Icon = iconMap[service.title] || Building2;

          return (
            <article key={service.title} className="card card-hover glass-card-strong relative overflow-hidden">
              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-gold-300/10 blur-3xl" />
              <div className="relative">
                <span className="inline-flex rounded-2xl border border-gold-300/20 bg-gold-300/10 p-3 text-gold-100">
                  <Icon size={20} />
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.32em] text-white/40">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-white">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/62">{service.copy}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ServicesSection;
