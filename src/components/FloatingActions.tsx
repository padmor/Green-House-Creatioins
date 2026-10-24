"use client";

import { ArrowUp, MessageCircle, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { company } from "@/lib/content";

// Bottom-right helpers: "back to top" after scrolling down, and on phones a one-tap contact button
// (WhatsApp when a WhatsApp number is configured, otherwise a phone call).
export function FloatingActions() {
  const [down, setDown] = useState(false);

  useEffect(() => {
    const onScroll = () => setDown(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
    document.getElementById("main")?.focus({ preventScroll: true });
  };

  const wa = company.whatsapp;
  const round = "grid h-12 w-12 place-items-center rounded-full shadow-[0_14px_30px_-14px_rgba(22,39,32,0.7)] transition-[background-color,opacity,translate] duration-300";

  return (
    <div className="fixed bottom-5 right-5 z-30 flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={toTop}
        aria-label="Back to top"
        tabIndex={down ? 0 : -1}
        aria-hidden={!down}
        className={`${round} bg-white text-ink ring-1 ring-stone hover:bg-ink hover:text-bone ${
          down ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <ArrowUp size={18} strokeWidth={1.75} aria-hidden />
      </button>
      {wa ? (
        <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" aria-label="Chat with GBC on WhatsApp" className={`${round} bg-ink text-bone hover:bg-ink-soft md:hidden`}>
          <MessageCircle size={20} strokeWidth={1.75} aria-hidden />
        </a>
      ) : (
        <a href={`tel:${company.phone.replace(/\s/g, "")}`} aria-label={`Call GBC on ${company.phone}`} className={`${round} bg-ink text-bone hover:bg-ink-soft md:hidden`}>
          <Phone size={19} strokeWidth={1.75} aria-hidden />
        </a>
      )}
    </div>
  );
}
