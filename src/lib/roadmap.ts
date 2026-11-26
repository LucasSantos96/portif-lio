import "server-only";

import crypto from "node:crypto";

import { ALL_ROADMAP_NODES, VALID_ROADMAP_NODE_IDS } from "@/data/roadmap-ai-2027";
import { getDatabaseUrl } from "@/lib/database-url";
import { prisma } from "@/lib/prisma";
import type { ArticleLocale } from "@/types";

export interface RoadmapSessionDto {
  token: string;
  name: string;
  email: string;
  locale: ArticleLocale;
  completedNodeIds: string[];
}

export interface RoadmapParticipantSummary {
  id: number;
  name: string;
  email: string;
  locale: string;
  completedNodeIds: string[];
  completedCount: number;
  totalNodes: number;
  progressPercent: number;
  createdAt: string;
  lastActiveAt: string;
}

function assertDatabaseConfigured() {
  if (!getDatabaseUrl()) {
    throw new Error("Banco de dados não configurado.");
  }
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 160;
}

export async function getRoadmapSessionByToken(token: string): Promise<RoadmapSessionDto | null> {
  if (!getDatabaseUrl() || !token.trim()) {
    return null;
  }

  const participant = await prisma.roadmapParticipant.findUnique({
    where: { token: token.trim() },
    include: { completions: { select: { nodeId: true } } },
  });

  if (!participant) {
    return null;
  }

  return {
    token: participant.token,
    name: participant.name,
    email: participant.email,
    locale: participant.locale === "en" ? "en" : "pt",
    completedNodeIds: participant.completions.map((c) => c.nodeId),
  };
}

export async function upsertRoadmapSession(input: {
  name: string;
  email: string;
  locale: ArticleLocale;
}): Promise<RoadmapSessionDto> {
  assertDatabaseConfigured();

  const name = input.name.trim().slice(0, 80);
  const email = normalizeEmail(input.email);
  const locale = input.locale === "en" ? "en" : "pt";

  const existing = await prisma.roadmapParticipant.findUnique({
    where: { email },
    include: { completions: { select: { nodeId: true } } },
  });

  if (existing) {
    const updated = await prisma.roadmapParticipant.update({
      where: { id: existing.id },
      data: {
        name: name || existing.name,
        locale,
        lastActiveAt: new Date(),
      },
      include: { completions: { select: { nodeId: true } } },
    });

    return {
      token: updated.token,
      name: updated.name,
      email: updated.email,
      locale: updated.locale === "en" ? "en" : "pt",
      completedNodeIds: updated.completions.map((c) => c.nodeId),
    };
  }

  const created = await prisma.roadmapParticipant.create({
    data: {
      token: crypto.randomUUID(),
      name,
      email,
      locale,
    },
  });

  return {
    token: created.token,
    name: created.name,
    email: created.email,
    locale: created.locale === "en" ? "en" : "pt",
    completedNodeIds: [],
  };
}

export async function setRoadmapNodeCompletion(input: {
  token: string;
  nodeId: string;
  completed: boolean;
}): Promise<{ completedNodeIds: string[] } | null> {
  assertDatabaseConfigured();

  if (!VALID_ROADMAP_NODE_IDS.has(input.nodeId)) {
    throw new Error("Tópico inválido.");
  }

  const participant = await prisma.roadmapParticipant.findUnique({
    where: { token: input.token.trim() },
  });

  if (!participant) {
    return null;
  }

  if (input.completed) {
    await prisma.roadmapCompletion.upsert({
      where: {
        participantId_nodeId: {
          participantId: participant.id,
          nodeId: input.nodeId,
        },
      },
      update: {},
      create: {
        participantId: participant.id,
        nodeId: input.nodeId,
      },
    });
  } else {
    await prisma.roadmapCompletion.deleteMany({
      where: {
        participantId: participant.id,
        nodeId: input.nodeId,
      },
    });
  }

  const [, completions] = await Promise.all([
    prisma.roadmapParticipant.update({
      where: { id: participant.id },
      data: { lastActiveAt: new Date() },
    }),
    prisma.roadmapCompletion.findMany({
      where: { participantId: participant.id },
      select: { nodeId: true },
    }),
  ]);

  return {
    completedNodeIds: completions.map((c) => c.nodeId),
  };
}

export async function getAllRoadmapParticipants(): Promise<RoadmapParticipantSummary[]> {
  if (!getDatabaseUrl()) {
    return [];
  }

  const totalNodes = ALL_ROADMAP_NODES.length;

  try {
    const rows = await prisma.roadmapParticipant.findMany({
      orderBy: [{ lastActiveAt: "desc" }, { id: "desc" }],
      include: {
        completions: {
          select: { nodeId: true },
          orderBy: { completedAt: "asc" },
        },
      },
    });

    return rows.map((row) => {
      const completedNodeIds = row.completions.map((c) => c.nodeId);
      const completedCount = completedNodeIds.length;
      return {
        id: Number(row.id),
        name: row.name,
        email: row.email,
        locale: row.locale,
        completedNodeIds,
        completedCount,
        totalNodes,
        progressPercent: totalNodes > 0 ? Math.round((completedCount / totalNodes) * 100) : 0,
        createdAt: row.createdAt.toISOString(),
        lastActiveAt: row.lastActiveAt.toISOString(),
      };
    });
  } catch (error) {
    console.error("Erro ao buscar participantes do roadmap:", error);
    return [];
  }
}
