import type { StaffRank } from "@/lib/content";
import type { Person } from "@/lib/data";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

// Staff-supplied photo (or a badged sample illustration), else the person's initials. Never a stand-in photo of a real face.
export function PersonPhoto({ p, className = "" }: { p: Person; className?: string }) {
  const pos = className.split(" ").includes("absolute") ? "" : "relative";
  return (
    <div className={`${pos} overflow-hidden ${p.photo_url ? "bg-forest-900" : "border border-stone bg-sand"} ${className}`}>
      {p.photo_url ? (
        // Plain <img>: photo URLs can come from any https host staff choose.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.photo_url} alt={`${p.full_name}, ${p.role_title}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <span role="img" aria-label={p.full_name} className="absolute inset-0 grid place-items-center font-serif text-4xl font-semibold tracking-[0.08em] text-forest-900/70">
          {initials(p.full_name)}
        </span>
      )}
    </div>
  );
}

// Small pill showing a person's rank; senior ranks read darker.
const rankStyle: Record<StaffRank, string> = {
  Leadership: "bg-ink text-bone",
  Management: "bg-forest-900 text-bone",
  "Senior staff": "bg-sage text-forest-900",
  Staff: "bg-bone text-ink ring-1 ring-stone",
  "Trainee / intern": "bg-white text-ink/80 ring-1 ring-stone",
};
export function RankBadge({ rank, className = "" }: { rank: StaffRank; className?: string }) {
  return (
    <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] shadow-sm ${rankStyle[rank] ?? rankStyle.Staff} ${className}`}>
      {rank}
    </span>
  );
}
