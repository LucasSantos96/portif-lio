/**
 * Dados do site usados em metadados, sitemap, robots, JSON-LD e llms.txt.
 *
 * A URL pública vem de NEXT_PUBLIC_SITE_URL (domínio próprio) ou, na Vercel,
 * de VERCEL_PROJECT_PRODUCTION_URL, que a plataforma preenche com o domínio
 * de produção do projeto. Sem nenhuma das duas, cai no localhost.
 */
function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProduction) {
    return `https://${vercelProduction}`;
  }

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();

export const site = {
  name: "Lucas Santos",
  fullName: "Lucas Santos de Oliveira",
  title: "Lucas Santos, desenvolvedor full-stack",
  jobTitle: "Desenvolvedor full-stack",
  description:
    "Sites, sistemas web e agentes de IA com n8n, LangChain, LangGraph e Mastra. Portfólio de Lucas Santos de Oliveira.",
  locale: "pt_BR",
  alternateLocale: "en_US",
  links: {
    linkedin: "https://www.linkedin.com/in/lucassantosdeoliveira-dev/",
    github: "https://github.com/LucasSantos96",
    whatsapp: "https://wa.me/5522981073895",
  },
  resume: "/Lucas-Santos-Full-stack.pdf",
  knowsAbout: [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "NestJS",
    "Python",
    "PostgreSQL",
    "Prisma",
    "Agentes de IA",
    "LangChain",
    "LangGraph",
    "Mastra",
    "n8n",
    "RAG",
  ],
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}
