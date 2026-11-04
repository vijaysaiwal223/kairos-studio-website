import type { MetadataRoute } from "next";

import { PROJECTS } from "@/data/projects";
import { SITE_URL } from "@/lib/site";

/** Every public content route, including the about page and project records. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/about-us`, changeFrequency: "monthly", priority: 0.8 },
    ...PROJECTS.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
