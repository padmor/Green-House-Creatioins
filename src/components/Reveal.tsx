"use client";

import { useEffect } from "react";

// React attaches its fiber to a DOM node once that node is hydrated. Page content streams in under
// loading.tsx and can hydrate after this component runs, and changing it before then makes React
// report a hydration mismatch, so elements are only marked once React has taken them over.
const hydrated = (el: Element) => Object.keys(el).some((k) => k.startsWith("__reactFiber$"));

// Fades [data-reveal] elements in as they scroll into view. Also watches for elements
// added later (e.g. project cards after a tab change). Content is visible without JS.
export function Reveal() {
  useEffect(() => {
    const w = window as Window & { __gbcReveal?: boolean };
    w.__gbcReveal = true;
    document.documentElement.classList.add("js");

    const waiting = new Set<Element>();
    let frame = 0;
    const show = (el: Element) => el.setAttribute("data-shown", "");
    const flush = () => {
      frame = 0;
      for (const el of waiting) if (hydrated(el)) (show(el), waiting.delete(el));
      if (waiting.size) frame = requestAnimationFrame(flush);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          if (hydrated(e.target)) show(e.target);
          else {
            waiting.add(e.target);
            if (!frame) frame = requestAnimationFrame(flush);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    const scan = (root: ParentNode) => root.querySelectorAll("[data-reveal]:not([data-shown])").forEach((el) => io.observe(el));
    scan(document);

    const mo = new MutationObserver((muts) => {
      for (const m of muts) m.addedNodes.forEach((n) => {
        if (!(n instanceof Element)) return;
        if (n.matches("[data-reveal]:not([data-shown])")) io.observe(n);
        scan(n);
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}
