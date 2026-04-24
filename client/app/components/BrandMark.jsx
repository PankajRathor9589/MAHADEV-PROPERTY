const BrandMark = ({
  showWordmark = true,
  compact = false,
  className = "",
  textClassName = ""
}) => {
  const iconClasses = compact ? "h-11 w-11 rounded-2xl" : "h-14 w-14 rounded-[24px]";
  const gapClasses = compact ? "gap-3" : "gap-4";
  const titleClasses = compact ? "text-xl" : "text-2xl";
  const labelClasses = compact ? "text-[10px]" : "text-[11px]";

  return (
    <div className={`flex items-center ${gapClasses} ${className}`.trim()}>
      <span
        className={`relative inline-flex ${iconClasses} shrink-0 items-center justify-center overflow-hidden border border-white/20 bg-gradient-to-br from-white/20 via-white/10 to-white/5 shadow-glass backdrop-blur-2xl`}
      >
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.28),_transparent_58%)]" />
        <svg viewBox="0 0 64 64" className="relative h-8 w-8 text-gold-300" fill="none" aria-hidden="true">
          <path
            d="M12 26 32 12l20 14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          />
          <path
            d="M18 26h28v24a2 2 0 0 1-2 2H20a2 2 0 0 1-2-2V26Z"
            fill="rgba(255,255,255,0.12)"
            stroke="rgba(255,255,255,0.82)"
            strokeWidth="2.5"
          />
          <path d="M26 50V36h12v14" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
          <path d="M24 30v8M32 30v8M40 30v8" stroke="currentColor" strokeLinecap="round" strokeWidth="2.6" />
        </svg>
      </span>

      {showWordmark ? (
        <div className={textClassName}>
          <p className={`font-display font-semibold uppercase tracking-[0.18em] text-white ${titleClasses}`.trim()}>
            SAGAR INFRA
          </p>
          <p className={`font-sans uppercase tracking-[0.34em] text-white/70 ${labelClasses}`.trim()}>
            Luxury Real Estate
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default BrandMark;
