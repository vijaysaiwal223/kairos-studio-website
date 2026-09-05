import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectShowcase } from "@/components/project-showcase";
import { PROJECTS, getProject } from "@/lib/projects";

/**
 * A project's showcase page.
 * Figma: "PROJECT PAGE", node 139:865
 *
 * Every project in src/lib/projects.ts is prerendered at build time from the
 * one template. dynamicParams stays off so a slug with no record 404s rather
 * than rendering an empty page.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return {};

  return {
    title: `${project.title} | Kai.ros Studio`,
    description: project.summary,
    openGraph: {
      title: `${project.title} | Kai.ros Studio`,
      description: project.summary,
      images: [{ url: project.hero.src }],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  return <ProjectShowcase project={project} />;
}
