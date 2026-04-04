import { ArrowRight, ChevronLeft, ChevronRight, MapPin, MoveRight, Ruler } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { resolveImageUrl } from "../services/api.js";
import {
  PROPERTY_FALLBACK_IMAGE,
  formatCurrency,
  formatLocation
} from "../utils/format.js";

const FeaturedPropertyCarousel = ({ properties = [] }) => {
  const slides = useMemo(
    () =>
      properties.map((property) => ({
        ...property,
        heroImage: resolveImageUrl(property.images?.[0]?.url) || PROPERTY_FALLBACK_IMAGE
      })),
    [properties]
  );

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (activeIndex <= slides.length - 1) {
      return;
    }

    setActiveIndex(0);
  }, [activeIndex, slides.length]);

  if (!slides.length) {
    return (
      <div className="card border-dashed border-white/15 text-center">
        <p className="text-sm text-white/60">Featured properties will appear here once listings are added.</p>
      </div>
    );
  }

  const activeSlide = slides[activeIndex];

  return (
    <section className="card overflow-hidden p-0">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative min-h-[360px] overflow-hidden">
          <img
            src={activeSlide.heroImage}
            alt={activeSlide.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/10" />
          <div className="relative flex h-full flex-col justify-end gap-4 p-6 sm:p-8">
            <span className="w-fit rounded-full border border-gold-300/35 bg-gold-300/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-100">
              Featured Address
            </span>
            <div>
              <h3 className="font-display text-4xl font-semibold text-white">{activeSlide.title}</h3>
              <p className="mt-3 flex items-center gap-2 text-sm text-white/70">
                <MapPin size={16} />
                {formatLocation(activeSlide.location, true)}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-white/75">
              <span className="rounded-full border border-white/12 bg-white/8 px-4 py-2">{activeSlide.category}</span>
              <span className="rounded-full border border-white/12 bg-white/8 px-4 py-2">
                {activeSlide.listingType === "rent" ? "Rent" : "Buy"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2">
                <Ruler size={14} />
                {activeSlide.area} sq.ft
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-2xl font-bold text-gold-200">{formatCurrency(activeSlide.price)}</p>
              <Link to={`/properties/${activeSlide._id}`} className="btn-primary">
                View Property
                <MoveRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="surface-grid flex flex-col justify-between gap-6 p-6 sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">Signature Showcase</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">
              Handpicked residences and investment-ready addresses from Sagar Infra.
            </h3>
            <p className="mt-3 text-sm leading-7 text-white/62">
              Each featured listing is screened for documentation quality, location strength, and market potential.
            </p>
          </div>

          <div className="grid gap-3">
            {slides.slice(0, 3).map((property, index) => (
              <button
                type="button"
                key={property._id}
                onClick={() => setActiveIndex(index)}
                className={`rounded-[24px] border p-4 text-left transition ${
                  activeIndex === index
                    ? "border-gold-300/45 bg-gold-300/10 text-white"
                    : "border-white/10 bg-white/5 text-white/75 hover:bg-white/8"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{property.title}</p>
                    <p className="mt-1 text-xs text-white/50">{formatLocation(property.location, true)}</p>
                  </div>
                  <ArrowRight size={16} />
                </div>
              </button>
            ))}
          </div>

          {slides.length > 1 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveIndex((current) => (current - 1 + slides.length) % slides.length)}
                className="btn-secondary"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setActiveIndex((current) => (current + 1) % slides.length)}
                className="btn-secondary"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPropertyCarousel;
