"use client";

import dynamic from "next/dynamic";

// Leaflet needs `window`, so the map only loads in the browser.
export const ProjectMapLazy = dynamic(() => import("./ProjectMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-[#dfe6d6]" aria-hidden />,
});
