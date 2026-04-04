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
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/50">
        <img src={activeImage.resolved} alt={title} className="h-[420px] w-full object-cover md:h-[520px]" />
      </div>

      {normalizedImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          {normalizedImages.map((image, index) => (
            <button
              key={`${image.filename}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`overflow-hidden rounded-2xl border transition ${
                index === activeIndex ? "border-gold-300 ring-2 ring-gold-300/20" : "border-white/10"
              }`}
            >
              <img src={image.resolved} alt={`${title} ${index + 1}`} className="h-20 w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallerySlider;
