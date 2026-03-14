const toneClasses = {
  brand: {
    card: "from-brand-500 to-brand-700 text-white",
    icon: "bg-white/15 text-white"
  },
  sand: {
    card: "from-sand-100 to-white text-ink",
    icon: "bg-white text-amber-600"
  },
  ink: {
    card: "from-ink to-brand-900 text-white",
    icon: "bg-white/15 text-white"
  }
};

const StatsCard = ({ label, value, tone = "brand", helper, trend, icon: Icon }) => {
  const toneConfig = toneClasses[tone] || toneClasses.brand;

  return (
    <article className={`rounded-[28px] bg-gradient-to-br p-5 shadow-soft ${toneConfig.card}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] opacity-80">{label}</p>
          <p className="mt-3 text-4xl font-semibold">{value}</p>
        </div>
        {Icon && (
          <div className={`grid h-12 w-12 place-items-center rounded-2xl ${toneConfig.icon}`}>
            <Icon className="text-lg" />
          </div>
        )}
      </div>
      {helper && <p className="mt-2 text-sm opacity-80">{helper}</p>}
      {trend && <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] opacity-75">{trend}</p>}
    </article>
  );
};

export default StatsCard;
