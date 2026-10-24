import { LogoMark } from "@/components/Logo";

// Shown instantly while a page is being prepared: the page-title band with the GBC mark,
// a "preparing" indicator, and soft placeholders where the content will appear.
export default function Loading() {
  return (
    <div role="status" aria-label="Loading page">
      <section className="relative flex h-[300px] items-end bg-forest-950 pt-[72px] sm:h-[360px]">
        <div className="container-gbc pb-12">
          <div className="flex items-center gap-4">
            <LogoMark light size={40} className="gbc-breathe" />
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-sage">
              Preparing page
              <span className="gbc-dots" aria-hidden>
                <i />
                <i />
                <i />
              </span>
            </div>
          </div>
          <div className="gbc-skeleton mt-6 h-10 w-72 max-w-full rounded-lg bg-white/10" />
        </div>
      </section>
      <section className="bg-bone py-16">
        <div className="container-gbc grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-4">
              <div className="gbc-skeleton aspect-[4/5] rounded-xl bg-stone/50" />
              <div className="gbc-skeleton h-4 w-2/3 rounded bg-stone/60" />
              <div className="gbc-skeleton h-3 w-1/3 rounded bg-stone/50" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
