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
 * Projects with saved coordinates sit at their exact site. The rest are laid out on a small
 * arc inland of Cape Coast centre (clearly marked as approximate) so they stay visible and
 * don't stack on one point, until real coordinates are added in the dashboard.
 */
export function toMapProjects(projects: Project[]): MapProject[] {
  const loose = projects.filter((p) => p.latitude == null || p.longitude == null);
  const [lat0, lng0] = company.coords;
  const r = 0.025; // about 2.5 km
  return projects.map((p, i) => {
    const base = { slug: p.slug, title: p.title, category: p.category, location: p.location, image: coverFor(p, i) };
    if (p.latitude != null && p.longitude != null) {
      return { ...base, latitude: p.latitude, longitude: p.longitude, approximate: false };
    }
    const k = loose.indexOf(p);
    // Spread across 145°..35° (west through north to east), keeping clear of the sea to the south.
    const deg = loose.length === 1 ? 90 : 145 - (110 / (loose.length - 1)) * k;
    const a = (deg * Math.PI) / 180;
    return { ...base, latitude: lat0 + r * Math.sin(a), longitude: lng0 + r * Math.cos(a), approximate: true };
  });
}
