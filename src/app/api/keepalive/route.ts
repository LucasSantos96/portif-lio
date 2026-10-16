import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { getDatabaseUrl } from "@/lib/database-url";
import { prisma } from "@/lib/prisma";
import { getSupabaseAdminClient } from "@/lib/supabase-storage";

/**
 * Mantém o projeto do Supabase (plano Free) ativo. O Supabase pausa projetos
 * sem atividade de usuário por 7 dias, e conta como atividade chamadas à API
 * e requisições de uma aplicação conectada. Esta rota faz as duas coisas e é
 * chamada pelos Cron Jobs da Vercel (ver vercel.json).
 */
export const dynamic = "force-dynamic";

interface CheckResult {
  ok: boolean;
  error?: string;
}

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;

  // Sem CRON_SECRET a rota fica aberta: ela só faz leituras leves.
  if (!secret) {
    return true;
  }

  const provided = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);

  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

function toMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

async function pingRestApi(): Promise<CheckResult> {
  try {
    const { error } = await getSupabaseAdminClient()
      .from("portfolio_projects")
      .select("id")
      .limit(1);

    if (error) {
      throw new Error(error.message);
    }

    return { ok: true };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
  }
}

async function pingDatabase(): Promise<CheckResult> {
  if (!getDatabaseUrl()) {
    return { ok: false, error: "DATABASE_URL não configurada." };
  }

  try {
    await prisma.portfolioProject.count();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
  }
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  const [restApi, database] = await Promise.all([pingRestApi(), pingDatabase()]);
  const ok = restApi.ok || database.ok;

  if (!restApi.ok) {
    console.error("[keepalive] Falha na API REST do Supabase:", restApi.error);
  }
  if (!database.ok) {
    console.error("[keepalive] Falha na consulta ao banco:", database.error);
  }

  // Detalhes dos erros ficam só nos logs; a resposta diz apenas o que funcionou.
  return NextResponse.json(
    {
      ok,
      checkedAt: new Date().toISOString(),
      restApi: { ok: restApi.ok },
      database: { ok: database.ok },
    },
    { status: ok ? 200 : 500 },
  );
}
