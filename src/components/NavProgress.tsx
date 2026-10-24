"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Thin bar across the top of the window while the next page is loading, so a tap on a link
// always gets an immediate response. It starts on a link click and finishes when the new page shows.
export function NavProgress() {
  const pathname = usePathname();
  const [from, setFrom] = useState<string | null>(null); // page we were on when loading started
  const loading = from !== null && from === pathname;

  useEffect(() => {
    let giveUp = 0;
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      // Same page, other sites, and the enquiry pop-up link don't load a new page.
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname || url.hash === "#enquiry") return;
      setFrom(window.location.pathname);
      window.clearTimeout(giveUp);
      giveUp = window.setTimeout(() => setFrom(null), 12000); // never leave it hanging
    };
    const onHistory = () => setFrom(null); // back/forward buttons
    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onHistory);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onHistory);
      window.clearTimeout(giveUp);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px]">
      <div className={`h-full origin-left bg-sage shadow-[0_0_10px_rgba(202,217,185,0.9)] ${loading ? "gbc-nav-loading" : "gbc-nav-done"}`} />
    </div>
  );
}
