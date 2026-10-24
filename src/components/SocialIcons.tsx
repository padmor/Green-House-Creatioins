// Outline brand icons in the Lucide style (Lucide no longer ships brand marks). 20×20 grid, currentColor.
const base = { width: 16, height: 16, viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...base} width={size} height={size} aria-hidden>
      <rect x="2.5" y="2.5" width="15" height="15" rx="3" />
      <path d="M6.5 9v5M6.5 6.2v.1M9.5 14v-3c0-1.2.9-2 2-2s2 .8 2 2v3M9.5 9v5" />
    </svg>
  );
}

export function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...base} width={size} height={size} aria-hidden>
      <path d="M3.5 3.5h3.6l9.4 13h-3.6z" />
      <path d="M16.2 3.5 11.2 9M8.8 11l-5 5.5" />
    </svg>
  );
}

export function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...base} width={size} height={size} aria-hidden>
      <rect x="3" y="3" width="14" height="14" rx="4" />
      <circle cx="10" cy="10" r="3.2" />
      <path d="M14 6v.1" />
    </svg>
  );
}

export function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg {...base} width={size} height={size} aria-hidden>
      <path d="M11.5 17v-6.5h2.2l.3-2.5h-2.5V6.6c0-.7.2-1.2 1.2-1.2H14V3.2c-.3 0-1-.1-1.9-.1-1.9 0-3.2 1.2-3.2 3.3V8H6.8v2.5h2.1V17" />
    </svg>
  );
}
