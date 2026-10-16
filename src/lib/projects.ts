import "server-only";

import { getDatabaseUrl } from "@/lib/database-url";
import { prisma } from "@/lib/prisma";
import { translateText } from "@/lib/translate";
import type { NewPortfolioProjectInput, PortfolioProject, ProjectCategory } from "@/types";

interface DbPortfolioProject {
  id: bigint;
  title: string;
  description: string;
  titleEn: string | null;
  descriptionEn: string | null;
  projectUrl: string;
  imageUrl: string;
  galleryImages: string[];
  videoUrls: string[];
  category: string;
  technologies: string[];
  githubRepo: string | null;
  source: string;
  published: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

function assertDatabaseConfigured() {
  if (!getDatabaseUrl()) {
    throw new Error(
      "Configure DATABASE_URL ou POSTGRES_PRISMA_URL para conectar o Prisma no ambiente atual.",
    );
  }
}

function mapDbProject(project: DbPortfolioProject): PortfolioProject {
  return {
    id: Number(project.id),
    title: project.title,
    description: project.description,
    titleEn: project.titleEn,
    descriptionEn: project.descriptionEn,
    projectUrl: project.projectUrl,
    imageUrl: project.imageUrl,
    galleryImages: project.galleryImages ?? [],
    videoUrls: project.videoUrls ?? [],
    category: project.category === "tool" ? "tool" : "project",
    technologies: project.technologies,
    githubRepo: project.githubRepo,
    source: project.source as "manual" | "github",
    published: project.published,
    sortOrder: project.sortOrder,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

function normalizeTechnologies(technologies: string[]) {
  return [...new Set(technologies.map((item) => item.trim()).filter(Boolean))];
}

function normalizeList(items: string[]) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  if (!getDatabaseUrl()) {
    return [];
  }

  try {
    const data = await prisma.portfolioProject.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }, { id: "desc" }],
    });

    return (data as DbPortfolioProject[]).map(mapDbProject);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao buscar projetos com Prisma:", error.name, error.message);
    } else {
      console.error("Erro ao buscar projetos com Prisma:", error);
    }
    return [];
  }
}

export async function getPortfolioProjectById(
  id: number,
): Promise<PortfolioProject | null> {
  if (!getDatabaseUrl()) {
    return null;
  }

  try {
    const data = await prisma.portfolioProject.findUnique({ where: { id } });
    return data ? mapDbProject(data as DbPortfolioProject) : null;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao buscar projeto com Prisma:", error.name, error.message);
    } else {
      console.error("Erro ao buscar projeto com Prisma:", error);
    }
    return null;
  }
}

export async function createPortfolioProject(input: NewPortfolioProjectInput) {
  assertDatabaseConfigured();

  const minSortOrder = await prisma.portfolioProject.aggregate({
    _min: { sortOrder: true },
  });

  const payload = buildProjectPayload(input);
  payload.sortOrder = input.sortOrder ?? (minSortOrder._min.sortOrder ?? 0) - 1;

  const [titleEn, descriptionEn] = await Promise.all([
    translateText(payload.title),
    translateText(payload.description),
  ]);

  const data = await prisma.portfolioProject.create({
    data: { ...payload, titleEn, descriptionEn },
  });

  return mapDbProject(data as DbPortfolioProject);
}

export async function updatePortfolioProject(
  id: number,
  input: NewPortfolioProjectInput,
) {
  assertDatabaseConfigured();

  const current = await prisma.portfolioProject.findUniqueOrThrow({
    where: { id },
  });

  const payload = buildProjectPayload(input);

  const titleChanged = payload.title !== current.title;
  const descriptionChanged = payload.description !== current.description;

  const [titleEn, descriptionEn] = await Promise.all([
    titleChanged ? translateText(payload.title) : Promise.resolve(current.titleEn),
    descriptionChanged
      ? translateText(payload.description)
      : Promise.resolve(current.descriptionEn),
  ]);

  const data = await prisma.portfolioProject.update({
    where: { id },
    data: { ...payload, titleEn, descriptionEn },
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
    galleryImages: normalizeList(input.galleryImages ?? []),
    videoUrls: normalizeList(input.videoUrls ?? []),
    category: (input.category ?? "project") satisfies ProjectCategory,
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
