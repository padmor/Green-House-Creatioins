import { company, type Project } from "./content";
import { coverFor } from "./images";

export type MapProject = {
  slug: string;
  title: string;
  category: string;
  location: string;
  image: string;
  latitude: number;
  longitude: number;
  /** True when the project has no saved coordinates and is shown near the city centre instead. */
  approximate: boolean;
};

/**
 * Show only projects for which a public city-level location or exact coordinates are available.
 * Projects whose location is not public remain in the portfolio but are not assigned invented pins.
 * City-level pins without exact coordinates are visibly marked approximate on the map.
 */
export function toMapProjects(projects: Project[]): MapProject[] {
  const mappable = projects.filter(
    (p) =>
      (p.latitude != null && p.longitude != null) ||
      /cape coast|university of cape coast/i.test(p.location),
  );
  const loose = mappable.filter((p) => p.latitude == null || p.longitude == null);
  const [lat0, lng0] = company.coords;
  const r = 0.025; // about 2.5 km
  return mappable.map((p, i) => {
    const base = { slug: p.slug, title: p.title, category: p.category, location: p.location, image: coverFor(p, i) };
    if (p.latitude != null && p.longitude != null) {
      return { ...base, latitude: p.latitude, longitude: p.longitude, approximate: false };
    }
    const k = loose.indexOf(p);
    // Spread around Cape Coast, keeping the marker visibly approximate until an exact site is supplied.
    const deg = loose.length === 1 ? 90 : 145 - (110 / (loose.length - 1)) * k;
    const a = (deg * Math.PI) / 180;
    return { ...base, latitude: lat0 + r * Math.sin(a), longitude: lng0 + r * Math.cos(a), approximate: true };
  });
}
