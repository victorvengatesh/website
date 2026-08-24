import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function Rating({
  value,
  count,
  compact = false,
  className,
}: {
  value: number;
  count?: number;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("flex items-center gap-1.5", className)}
      aria-label={`${value} out of 5 stars${count ? ` from ${count} reviews` : ""}`}
    >
      <span className="flex" aria-hidden="true">
        {Array.from({ length: compact ? 1 : 5 }, (_, index) => (
          <Star
            key={index}
            className="size-3.5 fill-accent text-accent"
          />
        ))}
      </span>
      <span className="text-xs font-bold text-ink">{value.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-xs text-muted">({count.toLocaleString("en-IN")})</span>
      )}
    </div>
  );
}
