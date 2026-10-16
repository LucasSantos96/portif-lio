import { absoluteUrl, site } from "@/lib/site";
import type { LocalizedArticle, PortfolioProject } from "@/types";

const personId = absoluteUrl("/#person");
const websiteId = absoluteUrl("/#website");

export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: site.fullName,
        alternateName: site.name,
        jobTitle: site.jobTitle,
        description: site.description,
        url: absoluteUrl("/"),
        image: absoluteUrl("/about/lucas.png"),
        sameAs: [site.links.linkedin, site.links.github],
        knowsAbout: site.knowsAbout,
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: site.name,
        url: absoluteUrl("/"),
        inLanguage: ["pt-BR", "en"],
        author: { "@id": personId },
      },
    ],
  };
}

export function projectJsonLd(project: PortfolioProject) {
  const url = absoluteUrl(`/projetos/${project.id}`);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        name: project.title,
        description: project.description.replace(/\s+/g, " ").trim(),
        url,
        image: [project.imageUrl, ...project.galleryImages].filter(Boolean),
        keywords: project.technologies.join(", "),
        creator: { "@id": personId },
        dateCreated: project.createdAt,
        dateModified: project.updatedAt,
        ...(project.projectUrl ? { sameAs: project.projectUrl } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: site.name, item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Projetos", item: absoluteUrl("/#projetos") },
          { "@type": "ListItem", position: 3, name: project.title, item: url },
        ],
      },
    ],
  };
}

function blogUrls(locale: "pt" | "en") {
  return { index: absoluteUrl(locale === "en" ? "/en/blog" : "/blog") };
}

export function blogIndexJsonLd(locale: "pt" | "en", description: string, articles: LocalizedArticle[]) {
  const { index } = blogUrls(locale);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${index}#blog`,
        name: `${site.name}, Blog`,
        url: index,
        description,
        inLanguage: locale === "en" ? "en" : "pt-BR",
        author: { "@id": personId },
        blogPost: articles.slice(0, 20).map((article) => ({
          "@type": "BlogPosting",
          headline: article.title,
          url: absoluteUrl(article.path),
          datePublished: article.publishedAt,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: site.name, item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Blog", item: index },
        ],
      },
    ],
  };
}

export function articleJsonLd(article: LocalizedArticle) {
  const url = absoluteUrl(article.path);
  const { index } = blogUrls(article.locale);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: article.title,
        description: article.excerpt,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        image: [article.coverUrl ?? absoluteUrl(`${article.path}/opengraph-image`)],
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        inLanguage: article.locale === "en" ? "en" : "pt-BR",
        keywords: article.tags.join(", "),
        wordCount: article.body.split(/\s+/).filter(Boolean).length,
        author: { "@id": personId },
        publisher: { "@id": personId },
        isPartOf: { "@id": `${index}#blog` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: site.name, item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Blog", item: index },
          { "@type": "ListItem", position: 3, name: article.title, item: url },
        ],
      },
    ],
  };
}
