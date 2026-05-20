const BrandMark = ({
  showWordmark = true,
  compact = false,
  className = "",
  textClassName = "",
  tone = "dark"
}) => {
  const iconClasses = compact ? "h-11 w-11 rounded-2xl" : "h-14 w-14 rounded-[24px]";
  const gapClasses = compact ? "gap-3" : "gap-4";
  const titleClasses = compact ? "text-xl" : "text-2xl";
  const labelClasses = compact ? "text-[10px]" : "text-[11px]";
  const isLight = tone === "light";

  return (
    <div className={`flex items-center ${gapClasses} ${className}`.trim()}>
      <span
        className={`relative inline-flex ${iconClasses} shrink-0 items-center justify-center overflow-hidden border ${
          isLight ? "border-white/18 bg-white/10" : "border-[#e2d5c1] bg-white"
        } shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-2xl`}
      >
        <span
          className={`absolute inset-0 ${
            isLight
              ? "bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.28),_transparent_58%)]"
              : "bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.18),_transparent_58%)]"
          }`}
        />
        <img src="/logo.png" alt="Sagar Infra logo" className="relative h-full w-full object-contain p-1.5" />
      </span>

      {showWordmark ? (
        <div className={textClassName}>
          <p
            className={`font-display font-semibold uppercase tracking-[0.18em] ${
              isLight ? "text-white" : "text-ink-900"
            } ${titleClasses}`.trim()}
          >
            SAGAR INFRA
          </p>
          <p
            className={`font-sans uppercase tracking-[0.34em] ${
              isLight ? "text-white/72" : "text-ink-500"
            } ${labelClasses}`.trim()}
          >
            Premium Real Estate
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default BrandMark;
