import "server-only";

import { getDatabaseUrl } from "@/lib/database-url";
import { prisma } from "@/lib/prisma";
import type { ProjectUpdate } from "@/types";

/**
 * Atualizações (linha do tempo) de um projeto, da mais recente para a mais antiga.
 * Qualquer falha (inclusive a tabela ainda não existir) vira lista vazia: a página
 * do projeto continua funcionando e a linha do tempo simplesmente não aparece.
 */
export async function getProjectUpdates(projectId: number): Promise<ProjectUpdate[]> {
  if (!getDatabaseUrl()) {
    return [];
  }

  try {
    const rows = await prisma.projectUpdate.findMany({
      where: { projectId },
      orderBy: [{ occurredAt: "desc" }, { sortOrder: "desc" }, { id: "desc" }],
    });

    return rows.map((row) => ({
      id: Number(row.id),
      projectId: Number(row.projectId),
      slug: row.slug,
      occurredAt: row.occurredAt.toISOString().slice(0, 10),
      title: row.title,
      titleEn: row.titleEn,
      description: row.description,
      descriptionEn: row.descriptionEn,
      images: row.images ?? [],
      sortOrder: row.sortOrder,
    }));
  } catch (error) {
    console.error(
      "Erro ao buscar atualizações do projeto:",
      error instanceof Error ? `${error.name}: ${error.message}` : error,
    );
    return [];
  }
}
