import "server-only";

import { prisma } from "@/lib/prisma";
import type { NewPortfolioProjectInput, PortfolioProject } from "@/types";

interface DbPortfolioProject {
  id: bigint;
  title: string;
  description: string;
  projectUrl: string;
  imageUrl: string;
  technologies: string[];
  githubRepo: string | null;
  source: string;
  published: boolean;
  sortOrder: number;
  createdAt: Date;
}

function assertDatabaseConfigured() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL não configurada.");
  }
}

function mapDbProject(project: DbPortfolioProject): PortfolioProject {
  return {
    id: Number(project.id),
    title: project.title,
    description: project.description,
    projectUrl: project.projectUrl,
    imageUrl: project.imageUrl,
    technologies: project.technologies,
    githubRepo: project.githubRepo,
    source: project.source as "manual" | "github",
    published: project.published,
    sortOrder: project.sortOrder,
    createdAt: project.createdAt.toISOString(),
  };
}

function normalizeTechnologies(technologies: string[]) {
  return [...new Set(technologies.map((item) => item.trim()).filter(Boolean))];
}

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    const data = await prisma.portfolioProject.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }, { id: "desc" }],
    });

    return (data as DbPortfolioProject[]).map(mapDbProject);
  } catch (error) {
    console.error("Erro ao buscar projetos com Prisma:", error);
    return [];
  }
}

export async function createPortfolioProject(input: NewPortfolioProjectInput) {
  assertDatabaseConfigured();

  const minSortOrder = await prisma.portfolioProject.aggregate({
    _min: { sortOrder: true },
  });

  const payload = buildProjectPayload(input);
  payload.sortOrder = input.sortOrder ?? (minSortOrder._min.sortOrder ?? 0) - 1;

  const data = await prisma.portfolioProject.create({
    data: payload,
  });

  return mapDbProject(data as DbPortfolioProject);
}

export async function updatePortfolioProject(
  id: number,
  input: NewPortfolioProjectInput,
) {
  assertDatabaseConfigured();

  const payload = buildProjectPayload(input);

  const data = await prisma.portfolioProject.update({
    where: { id },
    data: payload,
  });

  return mapDbProject(data as DbPortfolioProject);
}

export async function deletePortfolioProject(id: number) {
  assertDatabaseConfigured();

  await prisma.portfolioProject.delete({
    where: { id },
  });
}

function buildProjectPayload(input: NewPortfolioProjectInput) {
  return {
    title: input.title.trim(),
    description: input.description.trim(),
    projectUrl: input.projectUrl.trim(),
    imageUrl: input.imageUrl.trim(),
    technologies: normalizeTechnologies(input.technologies),
    githubRepo: input.githubRepo?.trim() || null,
    source: input.source ?? "manual",
    published: input.published ?? true,
    sortOrder: input.sortOrder ?? 0,
  };
}

export async function reorderPortfolioProjects(idsInOrder: number[]) {
  assertDatabaseConfigured();

  await prisma.$transaction(
    idsInOrder.map((id, index) =>
      prisma.portfolioProject.update({
        where: { id },
        data: { sortOrder: index },
      }),
    ),
  );
}
