import type { Metadata } from "next";
import { MapExplorer } from "@/components/MapExplorer";
import { company, projectCategories } from "@/lib/content";
import { getContent, getProjects } from "@/lib/data";
import { toMapProjects } from "@/lib/map";

export const metadata: Metadata = {
  title: "Interactive Project Map",
  description: "Where Green-Building Creations Ltd. works: Cape Coast and the surrounding area, Ghana.",
};
export const revalidate = 60;

export default async function MapPage() {
  const [content, projects] = await Promise.all([getContent(), getProjects()]);
  return (
    <MapExplorer
      projects={toMapProjects(projects)}
      categories={projectCategories}
      title={`${company.city}, ${company.country}`}
      intro={content["home.locations"]}
    />
  );
}
