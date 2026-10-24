"use client";

import { useEffect, useRef } from "react";

// Thin line under the header showing how far down a long page the reader is.
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.current?.style.setProperty("scale", `${max > 0 ? Math.min(1, window.scrollY / max) : 0} 1`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <div ref={bar} aria-hidden className="fixed inset-x-0 top-[72px] z-40 h-[2px] origin-left bg-forest-600" style={{ scale: "0 1" }} />;
}
