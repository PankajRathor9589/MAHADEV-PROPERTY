export const PropertyCardSkeleton = () => (
  <div className="overflow-hidden rounded-[30px] border border-white/70 bg-white/88 shadow-card">
    <div className="h-64 animate-pulse bg-slate-200" />
    <div className="space-y-4 p-5">
      <div className="space-y-3">
        <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
        <div className="h-6 w-2/3 animate-pulse rounded-full bg-slate-200" />
        <div className="h-4 w-1/2 animate-pulse rounded-full bg-slate-200" />
      </div>
      <div className="grid grid-cols-3 gap-2 rounded-[24px] bg-slate-50 p-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-6 animate-pulse rounded-full bg-slate-200" />
        ))}
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-7 w-24 animate-pulse rounded-full bg-slate-200" />
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="h-11 animate-pulse rounded-full bg-slate-200" />
        <div className="h-11 animate-pulse rounded-full bg-slate-200" />
      </div>
    </div>
  </div>
);

export const GallerySkeleton = () => (
  <div className="space-y-4">
    <div className="h-[280px] animate-pulse rounded-[32px] bg-slate-200 sm:h-[380px] lg:h-[520px]" />
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-20 animate-pulse rounded-2xl bg-slate-200 sm:h-24" />
      ))}
    </div>
  </div>
);

export const ListingResultsSkeleton = ({ count = 6 }) => (
  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: count }).map((_, index) => (
      <PropertyCardSkeleton key={index} />
    ))}
  </div>
);

export const MapResultsSkeleton = () => (
  <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
    <div className="panel-card p-4">
      <div className="h-[460px] animate-pulse rounded-[28px] bg-slate-200" />
    </div>
    <div className="panel-card p-4">
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-[24px] bg-slate-200" />
        ))}
      </div>
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-card">
    <div className="h-5 w-40 animate-pulse rounded-full bg-slate-200" />
    <div className="mt-4 h-64 animate-pulse rounded-[24px] bg-slate-100" />
  </div>
);
