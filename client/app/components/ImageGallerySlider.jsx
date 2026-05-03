import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { resolveImageUrl } from "../services/api.js";
import { normalizePropertyImageEntries, PROPERTY_FALLBACK_IMAGE } from "../utils/format.js";
import ResponsiveImage from "./ResponsiveImage.jsx";

const ImageGallerySlider = ({ images = [], title = "Property" }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  const normalizedImages = normalizePropertyImageEntries({ images });
  const galleryImages = normalizedImages.length
    ? normalizedImages.map((image) => ({
        ...image,
        resolved: resolveImageUrl(image.url, { width: 1600, height: 1040, crop: "fill" }) || PROPERTY_FALLBACK_IMAGE
      }))
    : [{ resolved: PROPERTY_FALLBACK_IMAGE, filename: "fallback", url: PROPERTY_FALLBACK_IMAGE }];

  const activeImage = galleryImages[activeIndex] || galleryImages[0];

  const moveSlide = (direction) => {
    setActiveIndex((current) => {
      const next = current + direction;

      if (next < 0) {
        return galleryImages.length - 1;
      }

      if (next >= galleryImages.length) {
        return 0;
      }

      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-[32px] border border-[#e7dccb] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-[#e2d6c6] bg-white/92 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-ink-600 backdrop-blur-xl">
          <ImageIcon size={14} className="text-gold-600" />
          Gallery
        </div>
        <ResponsiveImage
          src={activeImage.resolved}
          alt={title}
          className="aspect-[16/10] w-full object-cover md:aspect-[16/8.8]"
          loading="eager"
          decoding="async"
          sizes="(min-width: 1024px) 62vw, 100vw"
          widths={[640, 960, 1280, 1600, 1920]}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(15,23,42,0.18))]" />

        {galleryImages.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => moveSlide(-1)}
              className="absolute left-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#e6dbcd] bg-white/92 text-ink-800 shadow-[0_14px_32px_rgba(15,23,42,0.08)] backdrop-blur-xl transition hover:border-gold-300 hover:text-gold-700"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => moveSlide(1)}
              className="absolute right-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#e6dbcd] bg-white/92 text-ink-800 shadow-[0_14px_32px_rgba(15,23,42,0.08)] backdrop-blur-xl transition hover:border-gold-300 hover:text-gold-700"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-4 right-4 rounded-full border border-[#e6dbcd] bg-white/92 px-3 py-2 text-xs font-semibold tracking-[0.22em] text-ink-600 backdrop-blur-xl">
              {activeIndex + 1}/{galleryImages.length}
            </div>
          </>
        ) : null}
      </div>

      {galleryImages.length > 1 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-6">
          {galleryImages.map((image, index) => (
            <button
              key={`${image.filename}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`overflow-hidden rounded-[22px] border transition duration-300 ${
                index === activeIndex
                  ? "border-gold-300 bg-white ring-2 ring-gold-200"
                  : "border-[#eadfce] bg-[#fbf7f1] hover:border-gold-300"
              }`}
            >
              <ResponsiveImage
                src={resolveImageUrl(image.url, { width: 320, height: 220, crop: "fill" }) || image.resolved}
                alt={`${title} ${index + 1}`}
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
                decoding="async"
                sizes="(min-width: 1024px) 10vw, 28vw"
                widths={[240, 320, 480]}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ImageGallerySlider;
