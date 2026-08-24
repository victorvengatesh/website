export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface shadow-soft" aria-hidden="true">
      <div className="relative aspect-[1.04] overflow-hidden bg-line/[.55]">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[.55] to-transparent" />
      </div>
      <div className="space-y-3 p-5">
        <div className="h-2.5 w-1/3 rounded-full bg-line/[.70]" />
        <div className="h-4 w-4/5 rounded-full bg-line/[.70]" />
        <div className="h-3 w-full rounded-full bg-line/[.55]" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 w-20 rounded-full bg-line/[.70]" />
          <div className="h-10 w-20 rounded-xl bg-line/[.70]" />
        </div>
      </div>
    </div>
  );
}
