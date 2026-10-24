import type { Rating } from "@/lib/content";

const STAR = "M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L10 14.8l-5.2 2.8 1-5.8L1.5 7.7l5.9-.8L10 1.5Z";

function Row({ size, className }: { size: number; className: string }) {
  return (
    <span className={`flex gap-0.5 ${className}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill="currentColor" aria-hidden className="shrink-0">
          <path d={STAR} />
        </svg>
      ))}
    </span>
  );
}

// Five stars filled to `value` (supports halves and decimals).
export function Stars({ value, size = 14, light = false }: { value: number; size?: number; light?: boolean }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span className="relative inline-flex" aria-hidden>
      <Row size={size} className={light ? "text-white/30" : "text-stone"} />
      <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pct}%` }}>
        <Row size={size} className={light ? "text-sage" : "text-forest-700"} />
      </span>
    </span>
  );
}

// "★★★★☆ 4.5 (12 ratings)" with a full text label for screen readers.
export function RatingSummary({ rating, size = 13, light = false, className = "" }: { rating: Rating; size?: number; light?: boolean; className?: string }) {
  const label = `Rated ${rating.average.toFixed(1)} out of 5 from ${rating.total} ${rating.total === 1 ? "rating" : "ratings"}`;
  return (
    <span role="img" aria-label={label} className={`inline-flex items-center gap-2 ${className}`}>
      <Stars value={rating.average} size={size} light={light} />
      <span className={`text-xs font-semibold ${light ? "text-white" : "text-forest-900"}`}>{rating.average.toFixed(1)}</span>
      <span className={`text-xs ${light ? "text-white/60" : "text-muted"}`}>({rating.total})</span>
    </span>
  );
}
