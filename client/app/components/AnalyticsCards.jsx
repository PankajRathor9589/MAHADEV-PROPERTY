const AnalyticsCards = ({ items = [] }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {items.map((item) => (
        <article key={item.label} className="card h-full bg-white/95">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">{item.label}</p>
          <p className="mt-3 text-3xl font-bold text-ink-700">{item.value}</p>
          {item.helper ? <p className="mt-2 text-sm text-ink-500">{item.helper}</p> : null}
        </article>
      ))}
    </div>
  );
};

export default AnalyticsCards;
