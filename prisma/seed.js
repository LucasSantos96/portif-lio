const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const projects = [
  {
    title: "Diario Contabil",
    description:
      "Sistema de gestao de assinaturas MEI com checkout transparente e automacao de cobrancas.",
    projectUrl: "https://mei-landing.vercel.app/",
    imageUrl: "/diario-contabil.png",
    technologies: ["Next.js", "Tailwind CSS", "TypeScript", "Node.js", "Git"],
    githubRepo: null,
    source: "manual",
    published: true,
  },
  {
    title: "API Barber",
    description:
      "Sistema de gestao de clientes com planos, renovacao e status dinamico para barbearia.",
    projectUrl: "https://github.com/LucasSantos96/api_barber",
    imageUrl: "/system-barber.png",
    technologies: [
      "Next.js",
      "Tailwind CSS",
      "TypeScript",
      "Prisma",
      "Node.js",
      "MySQL",
      "Git",
    ],
    githubRepo: "https://github.com/LucasSantos96/api_barber",
    source: "manual",
    published: true,
  },
  {
    title: "Edu ai",
    description:
      "Geracao automatizada de planos de estudo com n8n, IA e dashboard de acompanhamento.",
    projectUrl: "https://saas-study-21vg.vercel.app/",
    imageUrl: "/eduai.png",
    technologies: ["React", "Node.js", "SQLite", "Git", "n8n"],
    githubRepo: null,
    source: "manual",
    published: true,
  },
  {
    title: "Stefani Fotografia",
    description:
      "Landing page responsiva para fotografa profissional com foco em conversao e portfolio visual.",
    projectUrl: "https://lp-stefani.vercel.app/",
    imageUrl: "/stefani.png",
    technologies: ["Next.js", "Tailwind CSS", "TypeScript", "Git"],
    githubRepo: null,
    source: "manual",
    published: true,
  },
  {
    title: "BlogNode",
    description:
      "Aplicacao fullstack com autenticacao, CRUD de posts e organizacao por categorias.",
    projectUrl: "https://blognode-mntu.onrender.com/",
    imageUrl: "/blognode.png",
    technologies: ["Node.js", "Express", "MongoDB", "JavaScript", "Bootstrap", "Git"],
    githubRepo: null,
    source: "manual",
    published: true,
  },
  {
    title: "Shanty",
    description:
      "Projeto front-end de estudio de yoga com base em prototipo Figma e foco em UX responsiva.",
    projectUrl: "https://lpyoga.vercel.app/",
    imageUrl: "/shanty.png",
    technologies: ["Next.js", "Tailwind CSS", "JavaScript", "Git"],
    githubRepo: null,
    source: "manual",
    published: true,
  },
  {
    title: "Um sol pra cada um",
    description:
      "Projeto Next.js baseado em Figma para praticar hierarquia visual e componentizacao.",
    projectUrl:
      "https://sunglassesproject-git-main-lucassantos96s-projects.vercel.app",
    imageUrl: "/projetoOculos.png",
    technologies: ["Next.js", "Tailwind CSS", "JavaScript", "Git"],
    githubRepo: null,
    source: "manual",
    published: true,
  },
  {
    title: "Ticket Generator",
    description:
      "Desafio Frontend Mentor com foco em formularios e experiencia de criacao de tickets.",
    projectUrl:
      "https://ticket-generator-kwl1-git-main-lucassantos96s-projects.vercel.app",
    imageUrl: "/projectTicket.png",
    technologies: ["Next.js", "Tailwind CSS", "TypeScript", "Git"],
    githubRepo: null,
    source: "manual",
    published: true,
  },
  {
    title: "Boa forma",
    description:
      "Site com calculo de IMC e conteudos de saude usando HTML, CSS e JavaScript.",
    projectUrl: "https://lucassantos96.github.io/boa-forma/",
    imageUrl: "/boaForma.png",
    technologies: ["HTML", "CSS", "JavaScript", "Git"],
    githubRepo: null,
    source: "manual",
    published: true,
  },
  {
    title: "Links Seu Beca",
    description:
      "Pagina de links uteis para barbearia com acesso rapido aos canais da marca.",
    projectUrl: "https://lucassantos96.github.io/linksseubeca/",
    imageUrl: "/seuBeca.png",
    technologies: ["HTML", "CSS", "JavaScript", "Git"],
    githubRepo: null,
    source: "manual",
    published: true,
  },
];

async function main() {
  for (const project of projects) {
    await prisma.portfolioProject.upsert({
      where: { projectUrl: project.projectUrl },
      update: {
        title: project.title,
        description: project.description,
        imageUrl: project.imageUrl,
        technologies: project.technologies,
        githubRepo: project.githubRepo,
        source: project.source,
        published: project.published,
      },
      create: project,
    });
  }

  const count = await prisma.portfolioProject.count();
  console.log(`Seed concluido. Projetos cadastrados: ${count}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
