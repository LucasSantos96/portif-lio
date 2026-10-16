import type { MetadataRoute } from "next";

import { getPublishedArticles, localizeArticle } from "@/lib/articles";
import { blogIndexPath } from "@/lib/blog";
import { getPortfolioProjects } from "@/lib/projects";
import { absoluteUrl, site } from "@/lib/site";

// Lê os projetos do banco a cada hora, então projeto novo entra sem novo deploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = (await getPortfolioProjects()).filter(
    (project) => project.published && project.category === "project",
  );

  const articles = await getPublishedArticles();
  const lastArticleUpdate = articles.reduce<string | undefined>(
    (latest, article) => (!latest || article.updatedAt > latest ? article.updatedAt : latest),
    undefined,
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
    // Blog: cada página existe em PT e EN e aponta para a outra via hreflang.
    ...(articles.length
      ? [
          {
            url: absoluteUrl(blogIndexPath("pt")),
            lastModified: new Date(lastArticleUpdate as string),
            changeFrequency: "weekly" as const,
            priority: 0.9,
            alternates: {
              languages: {
                "pt-BR": absoluteUrl(blogIndexPath("pt")),
                en: absoluteUrl(blogIndexPath("en")),
              },
            },
          },
          {
            url: absoluteUrl(blogIndexPath("en")),
            lastModified: new Date(lastArticleUpdate as string),
            changeFrequency: "weekly" as const,
            priority: 0.9,
            alternates: {
              languages: {
                "pt-BR": absoluteUrl(blogIndexPath("pt")),
                en: absoluteUrl(blogIndexPath("en")),
              },
            },
          },
        ]
      : []),
    ...articles.flatMap((article) =>
      (["pt", "en"] as const).map((locale) => {
        const localized = localizeArticle(article, locale);
        return {
          url: absoluteUrl(localized.path),
          lastModified: new Date(localized.updatedAt),
          changeFrequency: "monthly" as const,
          priority: 0.8,
          alternates: {
            languages: {
              "pt-BR": absoluteUrl(localizeArticle(article, "pt").path),
              en: absoluteUrl(localizeArticle(article, "en").path),
            },
          },
          ...(article.coverUrl ? { images: [absoluteUrl(article.coverUrl)] } : {}),
        };
      }),
    ),
    ...projects.map((project) => ({
      url: absoluteUrl(`/projetos/${project.id}`),
      lastModified: new Date(project.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      // image:loc exige URL absoluta; projetos antigos guardam imagens locais (/arquivo.png).
      images: [project.imageUrl, ...project.galleryImages].filter(Boolean).map((image) => absoluteUrl(image)),
    })),
  ];
}
