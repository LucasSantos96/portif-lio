import pt from "@/i18n/dictionaries/pt";
import { getPortfolioProjects } from "@/lib/projects";
import { absoluteUrl, site } from "@/lib/site";
import type { PortfolioProject } from "@/types";

// Resumo do site em Markdown para modelos de IA (proposta llms.txt, llmstxt.org).
// Gerado a partir do banco, então acompanha projetos novos sem editar arquivo.
export const revalidate = 3600;

function oneLine(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function projectLine(project: PortfolioProject, url: string) {
  const technologies = project.technologies.length ? ` Tecnologias: ${project.technologies.join(", ")}.` : "";
  return `- [${project.title}](${url}): ${oneLine(project.description)}${technologies}`;
}

export async function GET() {
  const published = (await getPortfolioProjects()).filter((project) => project.published);
  const projects = published.filter((project) => project.category === "project");
  const tools = published.filter((project) => project.category === "tool");
  const { services } = pt;

  const sections = [
    `# ${site.name}`,
    `> ${site.fullName}, ${site.jobTitle.toLowerCase()}. ${site.description}`,
    [pt.about.lead, ...pt.about.paragraphs].map(oneLine).join("\n\n"),
    [
      "## Serviços",
      `- ${services.automation.title}: ${services.automation.description}`,
      `- ${services.sites.title}: ${services.sites.description}`,
      `- ${services.systems.title}: ${services.systems.description}`,
      `- ${services.erp.title}: ${services.erp.description}`,
    ].join("\n"),
    projects.length
      ? ["## Projetos", ...projects.map((project) => projectLine(project, absoluteUrl(`/projetos/${project.id}`)))].join("\n")
      : null,
    tools.length
      ? ["## Ferramentas", ...tools.map((tool) => projectLine(tool, tool.githubRepo ?? tool.projectUrl))].join("\n")
      : null,
    [
      "## Contato",
      `- [Site](${absoluteUrl("/")})`,
      `- [Currículo em PDF](${absoluteUrl(site.resume)})`,
      `- [LinkedIn](${site.links.linkedin})`,
      `- [GitHub](${site.links.github})`,
      `- [WhatsApp](${site.links.whatsapp})`,
    ].join("\n"),
  ];

  return new Response(`${sections.filter(Boolean).join("\n\n")}\n`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
