import type { MetadataRoute } from "next";

import { PROJECTS } from "@/data/projects";
import { SITE_URL } from "@/lib/site";

/** Every prerendered route: the homepage and one entry per project record. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    ...PROJECTS.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
