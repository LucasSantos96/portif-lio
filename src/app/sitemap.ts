import type { MetadataRoute } from "next";

import { getPortfolioProjects } from "@/lib/projects";
import { absoluteUrl, site } from "@/lib/site";

// Lê os projetos do banco a cada hora, então projeto novo entra sem novo deploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = (await getPortfolioProjects()).filter(
    (project) => project.published && project.category === "project",
  );

  const lastProjectUpdate = projects.reduce<string | undefined>(
    (latest, project) => (!latest || project.updatedAt > latest ? project.updatedAt : latest),
    undefined,
  );

  return [
    {
      url: absoluteUrl("/"),
      lastModified: lastProjectUpdate ? new Date(lastProjectUpdate) : new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl(site.resume),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...projects.map((project) => ({
      url: absoluteUrl(`/projetos/${project.id}`),
      lastModified: new Date(project.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: [project.imageUrl, ...project.galleryImages].filter(Boolean),
    })),
  ];
}
