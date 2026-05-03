import { resolveImageUrl } from "../services/api.js";

const MediaPlayer = ({
  item,
  title = "Property media",
  poster = "",
  className = "",
  roundedClassName = "rounded-[28px]"
}) => {
  if (!item?.url) {
    return null;
  }

  const isYoutube = item.type === "youtube" && item.embedUrl;

  return (
    <div
      className={`relative aspect-video overflow-hidden border border-[#e7dccb] bg-[#f4efe7] shadow-[0_18px_46px_rgba(15,23,42,0.08)] ${roundedClassName} ${className}`.trim()}
    >
      {isYoutube ? (
        <iframe
          title={title}
          src={item.embedUrl}
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          controls
          playsInline
          preload="metadata"
          poster={poster ? resolveImageUrl(poster, { width: 1200, height: 675, crop: "fill" }) : undefined}
        >
          <source src={resolveImageUrl(item.url)} />
        </video>
      )}
    </div>
  );
};

export default MediaPlayer;
