import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { resolveImageUrl } from "../services/api.js";

const ImageGallerySlider = ({ images = [], title = "Property" }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const normalized = useMemo(() => {
    return images.map((image) => ({ ...image, resolvedUrl: resolveImageUrl(image.url) }));
  }, [images]);

  const activeImage = normalized[activeIndex]?.resolvedUrl;

  const goNext = () => {
    if (normalized.length < 2) {
      return;
    }

    setActiveIndex((current) => (current + 1) % normalized.length);
  };

  const goPrev = () => {
    if (normalized.length < 2) {
      return;
    }

    setActiveIndex((current) => (current - 1 + normalized.length) % normalized.length);
  };

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        {activeImage ? (
          <img src={activeImage} alt={title} className="h-72 w-full object-cover md:h-[460px]" />
        ) : (
          <div className="flex h-72 items-center justify-center text-slate-500 md:h-[460px]">No image</div>
        )}

        {normalized.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/65 p-2 text-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/65 p-2 text-white"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {normalized.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
          {normalized.map((image, index) => (
            <button
              type="button"
              key={image.filename || image.resolvedUrl || index}
              onClick={() => setActiveIndex(index)}
              className={`overflow-hidden rounded-lg border ${
                activeIndex === index ? "border-brand-600" : "border-slate-300"
              }`}
            >
              <img
                src={image.resolvedUrl}
                alt={`${title} ${index + 1}`}
                loading="lazy"
                className="h-16 w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallerySlider;
