import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PropertyGallery = ({ title, images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const activeImage = images[activeIndex]?.url || images[0]?.url;

  const move = (direction) => {
    if (!images.length) return;

    const nextIndex = direction === "next" ? activeIndex + 1 : activeIndex - 1;
    const wrappedIndex = (nextIndex + images.length) % images.length;
    setActiveIndex(wrappedIndex);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-[32px] bg-slate-200 shadow-card">
          <button type="button" className="block w-full" onClick={() => setShowFullscreen(true)}>
            <img
              src={activeImage}
              alt={title}
              className="h-[280px] w-full object-cover sm:h-[380px] lg:h-[520px]"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => move("prev")}
                className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white backdrop-blur"
              >
                <FaChevronLeft />
              </button>
              <button
                type="button"
                onClick={() => move("next")}
                className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white backdrop-blur"
              >
                <FaChevronRight />
              </button>
            </>
          )}
        </div>

        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-6">
          {images.map((image, index) => (
            <button
              key={`${image.filename || "image"}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`overflow-hidden rounded-2xl border transition ${
                index === activeIndex ? "border-brand-500 shadow-soft" : "border-white/60"
              }`}
            >
              <img
                src={image.url}
                alt={`${title} ${index + 1}`}
                className="h-20 w-full object-cover sm:h-24"
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      </div>

      {showFullscreen && (
        <button type="button" onClick={() => setShowFullscreen(false)} className="fixed inset-0 z-[70] bg-slate-950/92 p-5">
          <img src={activeImage} alt={title} className="h-full w-full object-contain" loading="eager" decoding="async" />
        </button>
      )}
    </>
  );
};

export default PropertyGallery;
