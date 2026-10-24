"use client";

import { CircleAlert, CircleCheck, Info, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TOAST_EVENT, type Toast } from "@/lib/toast";

const icons = { success: CircleCheck, info: Info, error: CircleAlert };

// Shows short confirmations and problems ("Email address copied", "Enquiry sent", "You're offline")
// at the bottom of the screen. It is a popover so it also appears above an open pop-up dialog.
// Announced to screen readers; each one fades away after a few seconds (errors stay a little longer).
export function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);
  const next = useRef(0);
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onToast = (e: Event) => {
      const { text, tone } = (e as CustomEvent<Omit<Toast, "id">>).detail;
      const id = ++next.current;
      setItems((t) => [...t.filter((x) => x.text !== text), { id, text, tone }].slice(-3));
      window.setTimeout(() => setItems((t) => t.filter((x) => x.id !== id)), tone === "error" ? 7000 : 4500);
      // Re-open the popover so it sits above anything opened since (e.g. the enquiry dialog).
      const el = layer.current;
      try {
        if (el?.matches(":popover-open")) el.hidePopover();
        el?.showPopover();
      } catch {}
    };
    window.addEventListener(TOAST_EVENT, onToast);
    return () => window.removeEventListener(TOAST_EVENT, onToast);
  }, []);

  return (
    <div
      ref={layer}
      popover="manual"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-5 top-auto m-0 flex h-auto w-full max-w-none flex-col items-center gap-2 overflow-visible border-0 bg-transparent p-0 px-4"
    >
      {items.map((t) => {
        const Icon = icons[t.tone];
        return (
          <div
            key={t.id}
            role={t.tone === "error" ? "alert" : "status"}
            className="gbc-toast pointer-events-auto flex max-w-md items-center gap-3 rounded-full bg-forest-950 py-2.5 pl-4 pr-2 text-sm text-white shadow-[0_18px_40px_-16px_rgba(22,39,32,0.7)]"
          >
            <Icon size={17} strokeWidth={1.75} className={`shrink-0 ${t.tone === "error" ? "text-[#f3a59a]" : "text-sage"}`} aria-hidden />
            <span>{t.text}</span>
            <button
              type="button"
              onClick={() => setItems((all) => all.filter((x) => x.id !== t.id))}
              aria-label="Dismiss"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={14} strokeWidth={1.75} aria-hidden />
            </button>
          </div>
        );
      })}
    </div>
  );
}
