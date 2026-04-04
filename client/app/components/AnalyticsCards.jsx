const AnalyticsCards = ({ items = [] }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-soft backdrop-blur"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">{item.label}</p>
          <p className="mt-3 text-3xl font-bold text-white">{item.value}</p>
          {item.helper ? <p className="mt-2 text-sm text-white/60">{item.helper}</p> : null}
        </article>
      ))}
    </div>
  );
};

export default AnalyticsCards;
