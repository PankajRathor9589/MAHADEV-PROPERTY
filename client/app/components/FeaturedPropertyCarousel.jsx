import { ArrowRight, ChevronLeft, ChevronRight, MapPin, MoveRight, Ruler } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { resolveImageUrl } from "../services/api.js";
import { PROPERTY_FALLBACK_IMAGE, formatCurrency, formatLocation } from "../utils/format.js";

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
      <div className="card border-dashed text-center">
        <p className="text-sm text-ink-500">Featured properties will appear here once listings are added.</p>
      </div>
    );
  }

  const activeSlide = slides[activeIndex];
  const previewSlides = slides.slice(0, 4);

  return (
    <section className="card overflow-hidden p-0">
      <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative min-h-[340px] overflow-hidden">
          <img
            src={activeSlide.heroImage}
            alt={activeSlide.title}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            sizes="(min-width: 1024px) 58vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-900/75 via-ink-900/40 to-transparent" />
          <div className="relative flex h-full flex-col justify-end gap-4 p-6 text-white md:p-8">
            <span className="w-fit rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] backdrop-blur-sm">
              Featured Property
            </span>
            <div>
              <h3 className="font-display text-4xl font-semibold sm:text-5xl">{activeSlide.title}</h3>
              <p className="mt-3 flex items-center gap-2 text-sm text-white/85">
                <MapPin size={16} />
                {formatLocation(activeSlide.location, true)}
              </p>
              <p className="mt-3 max-w-xl line-clamp-3 text-sm leading-7 text-white/85">
                {activeSlide.shortDescription || activeSlide.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-white/85">
              <span className="rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">{activeSlide.category}</span>
              <span className="rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">
                {activeSlide.listingType === "rent" ? "Rent" : "Buy"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">
                <Ruler size={14} />
                {activeSlide.area} sq.ft
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-2xl font-bold text-white">{formatCurrency(activeSlide.price)}</p>
              <Link to={`/properties/${activeSlide._id}`} className="btn-primary bg-white text-brand-700 hover:bg-brand-50">
                View Property
                <MoveRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="surface-grid flex flex-col justify-between gap-6 bg-cream-50 p-6 md:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-600">Signature Showcase</p>
            <h3 className="mt-3 text-2xl font-semibold text-ink-700">
              Handpicked plots, homes, and commercial spaces from Sagar Infra.
            </h3>
            <p className="mt-3 text-sm leading-7 text-ink-500">
              Each featured listing is presented for documentation clarity, location strength, and easy consultation.
            </p>
          </div>

          <div className="grid gap-3">
            {previewSlides.map((property, index) => (
              <button
                type="button"
                key={property._id}
                onClick={() => setActiveIndex(index)}
                className={`rounded-2xl border p-4 text-left transition ${
                  activeIndex === index
                    ? "border-brand-300 bg-white text-ink-700 shadow-md"
                    : "border-brand-100 bg-cream-100/80 text-ink-500 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{property.title}</p>
                    <p className="mt-1 text-xs text-ink-400">{formatLocation(property.location, true)}</p>
                  </div>
                  <ArrowRight size={16} className="shrink-0 text-brand-600" />
                </div>
              </button>
            ))}
          </div>

          {slides.length > 1 ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveIndex((current) => (current - 1 + slides.length) % slides.length)}
                className="btn-secondary px-4"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setActiveIndex((current) => (current + 1) % slides.length)}
                className="btn-secondary px-4"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPropertyCarousel;
