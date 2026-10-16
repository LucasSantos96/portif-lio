import { absoluteUrl, site } from "@/lib/site";
import type { PortfolioProject } from "@/types";

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
