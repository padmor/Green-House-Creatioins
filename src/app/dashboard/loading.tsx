// Placeholder rows while a dashboard page loads.
export default function Loading() {
  return (
    <div role="status" aria-label="Loading" className="space-y-6">
      <div className="gbc-skeleton h-8 w-56 rounded bg-stone/70" />
      <div className="overflow-hidden rounded-lg border border-stone bg-white">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-6 border-b border-stone/60 px-5 py-4 last:border-0">
            <div className="gbc-skeleton h-4 w-1/4 rounded bg-stone/60" />
            <div className="gbc-skeleton h-4 w-1/3 rounded bg-stone/50" />
            <div className="gbc-skeleton ml-auto h-4 w-20 rounded bg-stone/50" />
          </div>
        ))}
      </div>
    </div>
  );
}
