import Link from "next/link";
import { BadgeCheck, Blocks, Hammer, Grid3X3, Wrench, Zap } from "lucide-react";
import type { TradeName, VerifiedTradesperson } from "@/lib/content";
import type { tradeCategories } from "@/lib/content";

type Category = (typeof tradeCategories)[number];

const icons = {
  Tiler: Grid3X3,
  Electrician: Zap,
  Plumber: Wrench,
  Carpenter: Hammer,
  Mason: Blocks,
} satisfies Record<TradeName, typeof Grid3X3>;

export function TradeCategoryCard({
  category,
  professionals,
}: {
  category: Category;
  professionals: VerifiedTradesperson[];
}) {
  const Icon = icons[category.singular];
  return (
    <article className="flex h-full flex-col rounded-2xl border border-stone/70 bg-white p-7 transition-shadow duration-300 hover:shadow-[0_24px_50px_-30px_rgba(37,41,37,0.4)] sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-forest-100 text-forest-900">
          <Icon size={22} strokeWidth={1.7} aria-hidden />
        </span>
        <span className="rounded-full bg-bone px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-forest-900">
          {professionals.length ? `${professionals.length} verified` : "Taking applications"}
        </span>
      </div>
      <h3 className="mt-6 text-xl font-semibold text-forest-900">{category.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink/70">{category.summary}</p>

      {professionals.length ? (
        <ul className="mt-6 space-y-3 border-t border-stone pt-5">
          {professionals.map((person) => (
            <li key={person.id} className="rounded-xl bg-bone/80 p-4">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-forest-900">{person.public_name}</p>
                <BadgeCheck size={15} className="shrink-0 text-forest-700" aria-label="Verified professional" />
              </div>
              <p className="mt-1 text-xs text-muted">{person.service_area} · {person.experience_years} years' experience</p>
              {person.bio && <p className="mt-2 text-sm leading-relaxed text-ink/75">{person.bio}</p>}
              {person.portfolio_url && (
                <a href={person.portfolio_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs font-semibold text-forest-900 underline underline-offset-4">
                  View work samples
                </a>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 rounded-xl border border-dashed border-stone bg-bone/70 p-4 text-xs leading-relaxed text-muted">
          No verified {category.name.toLowerCase()} profiles are published yet. You can still post a job; GBC will review the request and confirm whether a suitable professional is available.
        </p>
      )}

      <div className="mt-auto flex flex-wrap gap-3 pt-6">
        <Link href="/contact#enquiry" className="inline-flex items-center justify-center bg-ink px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-bone transition-colors hover:bg-ink-soft">
          Post a {category.singular.toLowerCase()} job
        </Link>
      </div>
    </article>
  );
}
