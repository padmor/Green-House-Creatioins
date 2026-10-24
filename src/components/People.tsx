import { Info } from "lucide-react";
import Link from "next/link";
import { Heading, delay } from "./ui";
import type { Person } from "@/lib/data";
import { sampleTeam } from "@/lib/sampleTeam";
import { PersonPhoto, RankBadge } from "./PersonBits";
import { TeamDirectory } from "./TeamDirectory";


const paragraphs = (text: string) => text.split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean);

// About page: founder feature.
export function FounderFeature({ founder }: { founder: Person }) {
  return (
    <section className="bg-bone py-16 lg:py-24" aria-labelledby="founder-heading">
      <div className="container-gbc grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="relative max-w-sm pb-3 pr-3" data-reveal>
          <div aria-hidden className="absolute bottom-0 left-3 right-0 top-3 border-[3px] border-sage" />
          <PersonPhoto p={founder} className="aspect-[4/5] w-full" />
        </div>
        <div className="max-w-xl">
          <Heading id="founder-heading" eyebrow="Our founder" title={founder.full_name} />
          <div data-reveal className="mt-4 flex flex-wrap items-center gap-3">
            <RankBadge rank={founder.rank} />
            <p className="text-sm font-medium text-muted">{founder.role_title}</p>
          </div>
          <div data-reveal style={delay(0.12)} className="text-body mt-6 space-y-4">
            {paragraphs(founder.bio).map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// About page: team directory (rank filters, profile cards and pop-up profiles).
// Always shown on the About page. Until real profiles are published from the dashboard it shows the
// clearly badged sample profiles from lib/sampleTeam.ts (illustrations, not photos of real people).
export function TeamGrid({ team, hasFounder = false }: { team: Person[]; hasFounder?: boolean }) {
  return (
    <section id="team" className="scroll-mt-24 bg-white py-16 lg:py-28" aria-labelledby="team-heading">
      <div className="container-gbc">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Heading id="team-heading" eyebrow="Our team" title="The People Behind Our Work" />
          <p className="text-body max-w-sm">
            Planners, designers and builders working together on every project. Select a card to read the profile.
          </p>
        </div>
        {!team.length && (
          <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-bone px-4 py-2 text-xs text-muted ring-1 ring-stone">
            <Info size={14} strokeWidth={1.75} aria-hidden /> Sample profiles with illustrations, shown until our team profiles are published.
            {hasFounder ? " Meet our founder above." : ""}
          </p>
        )}
        <TeamDirectory team={team.length ? team : sampleTeam} />
      </div>
    </section>
  );
}

// Homepage: compact "Meet the team" strip (founder first, then up to three more).
export function TeamTeaser({ founder, team }: { founder: Person | null; team: Person[] }) {
  const shown = [...(founder ? [founder] : []), ...team].slice(0, 4);
  return (
    <section className="bg-white py-16 lg:py-24" aria-labelledby="meet-heading">
      <div className="container-gbc">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Heading id="meet-heading" eyebrow="Our people" title="Meet the Team" />
          <Link href={team.length ? "/about#team" : "/about"} className="group inline-flex items-center gap-2 border-b border-forest-900 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-forest-900">
            Meet the team
          </Link>
        </div>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((p, i) => (
            <li key={p.id} data-reveal style={delay(i * 0.1)}>
              <PersonPhoto p={p} className="aspect-[4/5] w-full" />
              <h3 className="mt-4 text-base font-semibold text-forest-900">{p.full_name}</h3>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">{p.role_title}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
