const AnalyticsCards = ({ items = [] }) => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <article key={item.label} className="card h-full">
          <p className="section-kicker">{item.label}</p>
          <p className="mt-3 text-3xl font-bold text-ink-800">{item.value}</p>
          {item.helper ? <p className="mt-2 text-sm text-ink-500">{item.helper}</p> : null}
        </article>
      ))}
    </div>
  );
};

export default AnalyticsCards;
