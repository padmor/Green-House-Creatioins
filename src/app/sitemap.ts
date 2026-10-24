import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const pages = ["", "/about", "/projects", "/map", "/services", "/sustainability", "/careers", "/contact", "/privacy"].map((p) => ({ url: `${base}${p}` }));
  const projects = (await getProjects()).filter((p) => !p.is_placeholder).map((p) => ({ url: `${base}/projects/${p.slug}` }));
  return [...pages, ...projects];
}
