import { NextResponse } from "next/server";

import { VALID_ROADMAP_NODE_IDS } from "@/data/roadmap-ai-2027";
import { setRoadmapNodeCompletion } from "@/lib/roadmap";

export async function POST(request: Request) {
  let body: { token?: string; nodeId?: string; completed?: boolean };

  try {
    body = (await request.json()) as { token?: string; nodeId?: string; completed?: boolean };
  } catch {
    return NextResponse.json({ message: "Corpo inválido." }, { status: 400 });
  }

  const token = typeof body.token === "string" ? body.token.trim() : "";
  const nodeId = typeof body.nodeId === "string" ? body.nodeId.trim() : "";
  const completed = Boolean(body.completed);

  if (!token || !VALID_ROADMAP_NODE_IDS.has(nodeId)) {
    return NextResponse.json({ message: "Dados de progresso inválidos." }, { status: 400 });
  }

  try {
    const result = await setRoadmapNodeCompletion({ token, nodeId, completed });
    if (!result) {
      return NextResponse.json({ message: "Sessão não encontrada." }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao atualizar progresso do roadmap:", error);
    return NextResponse.json({ message: "Não foi possível salvar o progresso." }, { status: 500 });
  }
}
