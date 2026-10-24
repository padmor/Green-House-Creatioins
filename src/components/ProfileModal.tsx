"use client";

import { Award, BookOpen, Briefcase, ChevronLeft, ChevronRight, GraduationCap, Mail, X, type LucideIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Person } from "@/lib/data";
import { PersonPhoto, RankBadge } from "./PersonBits";
import { FacebookIcon, InstagramIcon, LinkedInIcon, XIcon } from "./SocialIcons";

const items = (text: string) => text.split("\n").map((t) => t.trim()).filter(Boolean);
const paragraphs = (text: string) => text.split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean);
// "https://x.com/name" → "@name"
const handleOf = (url: string) => "@" + (url.replace(/\/+$/, "").split("/").pop() ?? "").replace(/^@/, "");

function handles(p: Person) {
  return [
    p.linkedin_url && { label: "LinkedIn", text: handleOf(p.linkedin_url), href: p.linkedin_url, icon: <LinkedInIcon /> },
    p.x_url && { label: "X", text: handleOf(p.x_url), href: p.x_url, icon: <XIcon /> },
    p.instagram_url && { label: "Instagram", text: handleOf(p.instagram_url), href: p.instagram_url, icon: <InstagramIcon /> },
    p.facebook_url && { label: "Facebook", text: handleOf(p.facebook_url), href: p.facebook_url, icon: <FacebookIcon /> },
    p.public_email && { label: "Email", text: p.public_email, href: `mailto:${p.public_email}`, icon: <Mail size={16} strokeWidth={1.6} aria-hidden /> },
  ].filter(Boolean) as { label: string; text: string; href: string; icon: React.ReactNode }[];
}

function Section({ icon: Icon, title, children, i }: { icon: LucideIcon; title: string; children: React.ReactNode; i: number }) {
  return (
    <section className="gbc-profile-section border-t border-stone/70 py-6 first:border-t-0 first:pt-0" style={{ animationDelay: `${0.12 + i * 0.08}s` }}>
      <h3 className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-forest-900">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-forest-100 text-forest-700">
          <Icon size={15} strokeWidth={1.75} aria-hidden />
        </span>
        {title}
      </h3>
      <div className="mt-3 pl-11 text-[15px] leading-relaxed text-ink/80">{children}</div>
    </section>
  );
}

function List({ text, empty }: { text: string; empty: string }) {
  const list = items(text);
  if (!list.length) return <p className="text-muted">{empty}</p>;
  return (
    <ul className="space-y-2">
      {list.map((t) => (
        <li key={t} className="flex gap-3">
          <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-sage ring-2 ring-forest-100" />
          {t}
        </li>
      ))}
    </ul>
  );
}

// Full profile pop-up: photo and handles on the left; biography, qualifications, role on the job and
// contributions on the right. Previous/next (or the arrow keys) move through the people in view.
export function ProfileModal({ people, openId, onChange }: { people: Person[]; openId: string | null; onChange: (id: string | null) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const index = people.findIndex((p) => p.id === openId);
  const p = index >= 0 ? people[index] : null;

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (p && !d.open) d.showModal();
    if (p) closeBtn.current?.focus(); // also after moving to the next person
    if (!p && d.open) d.close();
    document.documentElement.style.overflow = p ? "hidden" : "";
  }, [p]);

  const step = (dir: 1 | -1) => onChange(people[(index + dir + people.length) % people.length]!.id);
  const links = p ? handles(p) : [];

  return (
    <dialog
      ref={dialog}
      aria-labelledby="full-profile-name"
      onClose={() => onChange(null)}
      onClick={(e) => e.target === e.currentTarget && onChange(null)}
      onKeyDown={(e) => {
        if (people.length > 1 && e.key === "ArrowRight") step(1);
        if (people.length > 1 && e.key === "ArrowLeft") step(-1);
      }}
      className="gbc-modal m-auto max-h-[calc(100dvh-2rem)] w-[min(980px,calc(100%-2rem))] overflow-hidden rounded-2xl bg-white p-0 text-ink shadow-[0_40px_90px_-30px_rgba(22,39,32,0.6)] backdrop:bg-forest-950/55 backdrop:backdrop-blur-sm"
    >
      {p && (
        <div key={p.id} className="relative grid max-h-[calc(100dvh-2rem)] overflow-y-auto md:grid-cols-[0.8fr_1.2fr] md:overflow-hidden">
          <button
            type="button"
            ref={closeBtn}
            onClick={() => onChange(null)}
            aria-label="Close profile"
            className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink shadow-sm ring-1 ring-stone transition-colors hover:bg-ink hover:text-bone hover:ring-ink"
          >
            <X size={18} strokeWidth={1.75} aria-hidden />
          </button>

          {/* Identity column */}
          <aside className="flex flex-col bg-bone md:overflow-y-auto">
            <PersonPhoto p={p} className="gbc-profile-photo aspect-[4/3] w-full md:aspect-[4/5]" />
            <div className="flex flex-1 flex-col p-6 sm:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <RankBadge rank={p.rank} />
                {p.sample && <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted ring-1 ring-stone">Sample profile</span>}
              </div>
              <h2 id="full-profile-name" className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-forest-900">{p.full_name}</h2>
              <p className="mt-1 text-sm font-medium text-muted">{p.role_title}</p>
              {links.length > 0 && (
                <ul className="mt-5 space-y-2" aria-label="Handles">
                  {links.map((l) => (
                    <li key={l.label}>
                      {p.sample ? (
                        // Sample handles are illustrations of the layout, not real accounts, so they are not links.
                        <span className="flex items-center gap-3 rounded-xl bg-white px-3.5 py-2.5 text-[13px] text-ink/50 ring-1 ring-stone" title="Sample handle">
                          <span className="text-forest-700/60">{l.icon}</span> {l.text}
                        </span>
                      ) : (
                        <a
                          href={l.href}
                          {...(l.label === "Email" ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                          aria-label={`${p.full_name} on ${l.label}: ${l.text}`}
                          className="group flex items-center gap-3 rounded-xl bg-white px-3.5 py-2.5 text-[13px] text-ink ring-1 ring-stone transition-colors hover:bg-ink hover:text-bone hover:ring-ink"
                        >
                          <span className="text-forest-700 transition-colors group-hover:text-sage">{l.icon}</span>
                          <span className="truncate">{l.text}</span>
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>

          {/* Details column */}
          <div className="flex flex-col md:max-h-[calc(100dvh-2rem)] md:overflow-y-auto">
            <div className="flex-1 p-6 sm:p-9 md:pr-16">
              <Section icon={BookOpen} title="Biography" i={0}>
                {p.bio ? <div className="space-y-3">{paragraphs(p.bio).map((t, k) => <p key={k}>{t}</p>)}</div> : <p className="text-muted">Biography coming soon.</p>}
              </Section>
              <Section icon={GraduationCap} title="Qualifications" i={1}>
                <List text={p.qualifications} empty="Qualifications to be added." />
              </Section>
              <Section icon={Briefcase} title="Role on the job" i={2}>
                <List text={p.responsibilities} empty="Role details to be added." />
              </Section>
              <Section icon={Award} title="Contributions" i={3}>
                <List text={p.contributions} empty="Contributions to be added." />
              </Section>
            </div>
            {people.length > 1 && (
              <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-stone bg-white/95 px-6 py-4 backdrop-blur sm:px-9">
                <button type="button" onClick={() => step(-1)} className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-ink/70 transition-colors hover:text-ink">
                  <ChevronLeft size={16} strokeWidth={1.75} aria-hidden /> Previous
                </button>
                <span className="text-[11px] text-muted">
                  {index + 1} / {people.length}
                </span>
                <button type="button" onClick={() => step(1)} className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-ink/70 transition-colors hover:text-ink">
                  Next <ChevronRight size={16} strokeWidth={1.75} aria-hidden />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
