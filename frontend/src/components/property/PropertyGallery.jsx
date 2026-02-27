import { useMemo, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaPlayCircle } from "react-icons/fa";
import { youtubeEmbedUrl } from "../../utils/format";

const PropertyGallery = ({ title, images = [], videos = [], youtubeUrl = "", media = [] }) => {
  const normalized = useMemo(() => {
    if (media?.length) return media;

    const merged = [
      ...images.map((url) => ({ type: "image", url })),
      ...videos.map((url) => ({ type: "video", url }))
    ];

    if (youtubeUrl) merged.push({ type: "youtube", url: youtubeUrl });

    return merged;
  }, [images, media, videos, youtubeUrl]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [full, setFull] = useState(false);
  const active = normalized[activeIndex];

  const move = (direction) => {
    if (!normalized.length) return;
    const next = direction === "next" ? activeIndex + 1 : activeIndex - 1;
    const bounded = (next + normalized.length) % normalized.length;
    setActiveIndex(bounded);
  };

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl bg-slate-100">
        {active?.type === "image" && (
          <button type="button" className="block w-full" onClick={() => setFull(true)}>
            <img src={active.url} alt={title} className="h-56 w-full object-cover sm:h-72 lg:h-80" loading="lazy" />
          </button>
        )}
        {active?.type === "video" && (
          <video className="h-56 w-full object-cover sm:h-72 lg:h-80" controls preload="metadata">
            <source src={active.url} />
          </video>
        )}
        {active?.type === "youtube" && (
          <iframe
            title={`${title} video`}
            src={youtubeEmbedUrl(active.url)}
            className="h-56 w-full border-0 sm:h-72 lg:h-80"
            loading="lazy"
            allowFullScreen
          />
        )}

        {normalized.length > 1 && (
          <>
            <button type="button" onClick={() => move("prev")} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white">
              <FaChevronLeft />
            </button>
            <button type="button" onClick={() => move("next")} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white">
              <FaChevronRight />
            </button>
          </>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {normalized.map((item, idx) => (
          <button key={`${item.url}-${idx}`} type="button" className="relative shrink-0" onClick={() => setActiveIndex(idx)}>
            {item.type === "image" && (
              <img
                src={item.url}
                alt={`${title}-${idx}`}
                className={`h-20 w-28 rounded-lg object-cover ${activeIndex === idx ? "ring-2 ring-brand-500" : ""}`}
                loading="lazy"
              />
            )}
            {item.type !== "image" && (
              <div className={`flex h-20 w-28 items-center justify-center rounded-lg bg-slate-900 text-white ${activeIndex === idx ? "ring-2 ring-brand-500" : ""}`}>
                <FaPlayCircle />
              </div>
            )}
          </button>
        ))}
      </div>

      {full && active?.type === "image" && (
        <div className="fixed inset-0 z-[60] bg-black/90 p-4" onClick={() => setFull(false)}>
          <img src={active.url} alt={title} className="h-full w-full object-contain" />
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;
