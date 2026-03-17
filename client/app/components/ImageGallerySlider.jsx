import { useEffect, useState } from "react";
import { resolveImageUrl } from "../services/api.js";

const ImageGallerySlider = ({ images = [], title }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  if (!images.length) {
    return (
      <div className="flex h-80 items-center justify-center rounded-[28px] bg-slate-200 text-slate-500">
        No images uploaded for this property.
      </div>
    );
  }

  const activeImage = images[activeIndex] || images[0];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[28px] border border-white/60 bg-slate-100">
        <img
          src={resolveImageUrl(activeImage?.url)}
          alt={title}
          className="h-[420px] w-full object-cover"
        />
      </div>

      <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
        {images.map((image, index) => (
          <button
            key={`${image.filename}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`overflow-hidden rounded-2xl border transition ${
              index === activeIndex ? "border-brand-500 ring-2 ring-brand-100" : "border-white/60"
            }`}
          >
            <img
              src={resolveImageUrl(image.url)}
              alt={`${title} ${index + 1}`}
              className="h-20 w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageGallerySlider;
