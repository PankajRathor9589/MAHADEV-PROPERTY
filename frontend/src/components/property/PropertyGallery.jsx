import { useState } from "react";

const PropertyGallery = ({ title, images = [] }) => {
  const [active, setActive] = useState(images[0]);
  const [full, setFull] = useState(null);

  const setImage = (img) => {
    setActive(img);
  };

  return (
    <div className="space-y-3">
      <button type="button" className="block w-full" onClick={() => setFull(active)}>
        <img src={active} alt={title} className="h-56 w-full rounded-2xl object-cover sm:h-72 lg:h-80" />
      </button>
      <div className="grid gap-3 sm:grid-cols-4">
        {images.map((img, idx) => (
          <button key={`${img}-${idx}`} type="button" className="block" onClick={() => setImage(img)}>
            <img
              src={img}
              alt={`${title}-${idx}`}
              className={`h-20 w-full rounded-lg object-cover ${active === img ? "ring-2 ring-brand-500" : ""}`}
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {full && (
        <div className="fixed inset-0 z-[60] bg-black/90 p-4" onClick={() => setFull(null)}>
          <img src={full} alt={title} className="h-full w-full object-contain" />
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;
