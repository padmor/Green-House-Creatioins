"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Project photos: a large cover plus thumbnails; any photo opens full-screen.
// Uses a native <dialog> for focus trapping and Escape-to-close.
export function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const many = images.length > 1;

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  useEffect(() => {
    if (open === null || !many) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, many, images.length]);

  const alt = (i: number) => `${title}, photo ${i + 1} of ${images.length}`;

  return (
    <>
      <div className="relative pb-3 pr-3">
        <div aria-hidden className="absolute bottom-0 left-3 right-0 top-3 border-[3px] border-sage" />
        <button type="button" onClick={() => setOpen(0)} className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden bg-forest-900">
          <Image src={images[0]} alt={alt(0)} fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
          <span className="absolute bottom-3 right-3 bg-bone/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-forest-900">
            View {many ? `all ${images.length} photos` : "larger"}
          </span>
        </button>
      </div>

      {many && (
        <ul className="mt-6 grid grid-cols-4 gap-3">
          {images.slice(1).map((src, k) => (
            <li key={src}>
              <button type="button" onClick={() => setOpen(k + 1)} className="relative block aspect-square w-full cursor-zoom-in overflow-hidden bg-forest-900">
                <Image src={src} alt={alt(k + 1)} fill sizes="160px" className="object-cover transition-opacity hover:opacity-85" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialog}
        aria-label={`${title} photos`}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-forest-950 p-0 text-white backdrop:bg-transparent"
      >
        {open !== null && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-5 py-4 text-sm">
              <p>
                {title}
                {many && <span className="ml-3 text-white/60">{open + 1} / {images.length}</span>}
              </p>
              <button type="button" onClick={() => setOpen(null)} autoFocus className="grid h-10 w-10 place-items-center border border-white/30 hover:bg-white/10" aria-label="Close photos">
                <svg width="16" height="16" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="M3 3l12 12M15 3L3 15" /></svg>
              </button>
            </div>
            <div className="relative flex-1" onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
              <Image src={images[open]} alt={alt(open)} fill sizes="100vw" className="pointer-events-none object-contain p-4 sm:p-10" />
            </div>
            {many && (
              <div className="flex justify-center gap-3 pb-6">
                <button type="button" onClick={() => setOpen((open - 1 + images.length) % images.length)} className="border border-white/30 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] hover:bg-white/10">
                  ← Previous
                </button>
                <button type="button" onClick={() => setOpen((open + 1) % images.length)} className="border border-white/30 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] hover:bg-white/10">
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
