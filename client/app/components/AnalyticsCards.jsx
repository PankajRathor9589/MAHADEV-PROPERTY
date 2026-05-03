const AnalyticsCards = ({ items = [] }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <article
            key={item.label}
            className="rounded-[28px] border border-[#eadfcf] bg-white p-5 shadow-[0_18px_48px_rgba(15,23,42,0.07)] transition duration-500 hover:-translate-y-1 hover:border-gold-300"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-kicker">{item.label}</p>
                <p className="mt-3 text-4xl font-semibold text-ink-900">{item.value}</p>
                {item.helper ? <p className="mt-2 text-sm text-ink-500">{item.helper}</p> : null}
              </div>
              {Icon ? (
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold-300 bg-[#f7ecd7] text-gold-700">
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
