const AnalyticsCards = ({ items = [] }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <article
            key={item.label}
            className="group relative overflow-hidden rounded-[28px] border border-[#172235] bg-[#07111e] p-5 text-white shadow-[0_22px_70px_rgba(3,7,17,0.18)] transition duration-500 hover:-translate-y-1 hover:border-gold-300/70"
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(212,175,55,0.12),transparent_42%,rgba(255,255,255,0.05))] opacity-70" />
            <div className="flex items-start justify-between gap-4">
              <div className="relative">
                <p className="section-kicker text-gold-200">{item.label}</p>
                <p className="mt-3 text-4xl font-semibold text-white">{item.value}</p>
                {item.helper ? <p className="mt-2 text-sm text-white/58">{item.helper}</p> : null}
              </div>
              {Icon ? (
                <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold-300/50 bg-white/8 text-gold-200 backdrop-blur-xl transition group-hover:scale-105">
                  <Icon size={18} />
                </span>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default AnalyticsCards;
