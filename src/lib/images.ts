// GBC site imagery (public/images/gbc), used wherever a project has no image of its own.
export const art = [
  "/images/gbc/residential.jpg", // 0
  "/images/gbc/hero.jpg", // 1
  "/images/gbc/commercial.jpg", // 2
  "/images/gbc/institutional.jpg", // 3
  "/images/gbc/team.jpg", // 4
];

const byCategory: Record<string, number> = { Residential: 0, Commercial: 2, Institutional: 3 };

/** Picks an image that suits a project category, falling back to its list position. */
export function artFor(category: string, index = 0) {
  return byCategory[category] ?? [0, 2, 3][index % 3];
}

/** A project's cover image, or the category image when it has none. */
export function coverFor(p: { image_urls: string[]; category: string }, index = 0) {
  return p.image_urls[0] ?? art[artFor(p.category, index)];
}
