import { useEffect, useState } from "react";
import { resolveImageUrl } from "../services/api.js";
import { PROPERTY_FALLBACK_IMAGE } from "../utils/format.js";

const ImageGallerySlider = ({ images = [], title = "Property" }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  const normalizedImages = images.length
    ? images.map((image) => ({ ...image, resolved: resolveImageUrl(image.url) || PROPERTY_FALLBACK_IMAGE }))
    : [{ resolved: PROPERTY_FALLBACK_IMAGE, filename: "fallback" }];

  const activeImage = normalizedImages[activeIndex] || normalizedImages[0];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[28px] border border-brand-100 bg-cream-100">
        <img
          src={activeImage.resolved}
          alt={title}
          className="h-[320px] w-full object-cover md:h-[520px]"
          loading="eager"
          decoding="async"
          sizes="(min-width: 1024px) 62vw, 100vw"
        />
      </div>

      {normalizedImages.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          {normalizedImages.map((image, index) => (
            <button
              key={`${image.filename}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`overflow-hidden rounded-2xl border transition ${
                index === activeIndex ? "border-brand-400 ring-2 ring-brand-100" : "border-brand-100"
              }`}
            >
              <img
                src={image.resolved}
                alt={`${title} ${index + 1}`}
                className="h-20 w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ImageGallerySlider;
