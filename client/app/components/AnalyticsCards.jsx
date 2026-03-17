const AnalyticsCards = ({ items = [] }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-[28px] border border-white/60 bg-white/85 p-5 shadow-soft backdrop-blur"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">{item.label}</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{item.value}</p>
          {item.helper ? <p className="mt-2 text-sm text-slate-500">{item.helper}</p> : null}
        </article>
      ))}
    </div>
  );
};

export default AnalyticsCards;
