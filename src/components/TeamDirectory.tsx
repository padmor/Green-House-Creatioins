"use client";

import { ArrowUpRight, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { staffRanks } from "@/lib/content";
import type { Person } from "@/lib/data";
import { PersonPhoto, RankBadge } from "./PersonBits";
import { ProfileModal } from "./ProfileModal";
import { delay } from "./ui";

const paragraphs = (text: string) => text.split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean);

// About page team: rank tabs and photo cards. Selecting a card reveals a short profile on the card
// itself (a circle wipes out from the + button and the details rise in); "Full profile" then opens
// the complete profile pop-up. Select again, press Escape or open another card to close the card.
export function TeamDirectory({ team }: { team: Person[] }) {
  const ranks = staffRanks.filter((r) => team.some((p) => p.rank === r));
  const [rank, setRank] = useState<string>("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const [fullId, setFullId] = useState<string | null>(null);
  const shown = rank === "All" ? team : team.filter((p) => p.rank === rank);

  useEffect(() => {
    if (!openId || fullId) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId, fullId]);

  return (
    <>
      {ranks.length > 1 && (
        <div role="tablist" aria-label="Filter team by rank" className="mt-8 flex flex-wrap gap-2">
          {["All", ...ranks].map((r) => (
            <button
              key={r}
              type="button"
              role="tab"
              aria-selected={rank === r}
              onClick={() => {
                setRank(r);
                setOpenId(null);
              }}
              className={`rounded-full border px-4 py-2 text-[12px] font-medium transition-colors ${
                rank === r ? "border-ink bg-ink text-bone" : "border-stone bg-white text-ink/75 hover:border-ink hover:text-ink"
              }`}
            >
              {r}
              <span className={`ml-2 text-[11px] ${rank === r ? "text-bone/60" : "text-muted"}`}>
                {r === "All" ? team.length : team.filter((p) => p.rank === r).length}
              </span>
            </button>
          ))}
        </div>
      )}

      <ul key={rank} className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, i) => {
          const open = openId === p.id;
          const toggle = () => setOpenId(open ? null : p.id);
          const label = open ? `Hide ${p.full_name}'s profile` : `Show ${p.full_name}'s profile`;
          return (
            <li key={p.id} data-reveal style={delay((i % 4) * 0.1)} className="gbc-person">
              <div data-open={open} className="gbc-card gbc-person__photo group relative aspect-[4/5] overflow-hidden rounded-2xl">
                {/* Front: photo. The whole picture opens the profile. */}
                <button type="button" onClick={toggle} aria-expanded={open} aria-controls={`profile-${p.id}`} className="absolute inset-0 block w-full text-left">
                  <span className="sr-only">{label}</span>
                  <PersonPhoto p={p} className="gbc-card__photo absolute inset-0 [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-[1.06]" />
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </button>
                <div className="pointer-events-none absolute left-4 right-4 top-4 flex flex-wrap items-center gap-2">
                  <RankBadge rank={p.rank} />
                  {p.sample && <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted ring-1 ring-stone">Sample</span>}
                </div>

                {/* Back: profile details, revealed on the same card */}
                <div id={`profile-${p.id}`} role="region" aria-label={`${p.full_name}, profile`} inert={!open} className="gbc-card__info absolute inset-0 flex flex-col bg-ink p-6 text-bone">
                  <RankBadge rank={p.rank} className="!bg-sage !text-forest-900" />
                  <p className="mt-4 text-xl font-semibold leading-tight tracking-[-0.015em]">{p.full_name}</p>
                  <p className="mt-1 text-[13px] text-bone/60">{p.role_title}</p>
                  <div className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto pb-12 pr-1 text-[13px] leading-relaxed text-bone/85">
                    {p.bio ? paragraphs(p.bio).map((t, k) => <p key={k}>{t}</p>) : <p className="text-bone/50">Profile details coming soon.</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => setFullId(p.id)}
                    aria-haspopup="dialog"
                    className="absolute bottom-5 left-6 inline-flex items-center gap-1.5 rounded-full bg-bone px-4 py-2 text-[11px] font-semibold text-ink transition-colors hover:bg-sage"
                  >
                    Full profile <ArrowUpRight size={13} strokeWidth={2} aria-hidden />
                  </button>
                </div>

                {/* The + turns into × while the profile is open */}
                <button
                  type="button"
                  onClick={toggle}
                  aria-expanded={open}
                  aria-controls={`profile-${p.id}`}
                  aria-label={label}
                  className={`absolute bottom-4 right-4 z-10 grid h-11 w-11 place-items-center rounded-full shadow-[0_10px_24px_-10px_rgba(37,41,37,0.7)] transition-colors duration-300 ${
                    open ? "bg-bone text-ink" : "bg-ink text-bone group-hover:bg-bone group-hover:text-ink"
                  }`}
                >
                  <Plus size={18} strokeWidth={1.9} aria-hidden className={`transition-transform duration-500 ${open ? "rotate-[135deg]" : ""}`} />
                </button>
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em] text-forest-900">{p.full_name}</h3>
              <p className="mt-1 text-sm text-muted">{p.role_title}</p>
            </li>
          );
        })}
      </ul>

      <ProfileModal people={shown} openId={fullId} onChange={setFullId} />
    </>
  );
}
