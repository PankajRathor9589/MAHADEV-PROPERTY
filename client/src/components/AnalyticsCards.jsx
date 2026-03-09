const AnalyticsCards = ({ items }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <article key={item.label} className="card bg-gradient-to-br from-white to-cyan-50">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{item.value}</p>
        </article>
      ))}
    </div>
  );
};

export default AnalyticsCards;
