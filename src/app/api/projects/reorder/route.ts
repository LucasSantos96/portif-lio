import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { reorderPortfolioProjects } from "@/lib/projects";
import { isUploadSessionValid, UPLOAD_SESSION_COOKIE } from "@/lib/upload-auth";

interface ReorderBody {
  ids?: number[];
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(UPLOAD_SESSION_COOKIE)?.value;

  if (!isUploadSessionValid(sessionCookie)) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  const body = (await request.json()) as ReorderBody;

  if (!Array.isArray(body.ids) || !body.ids.every((id) => Number.isInteger(id))) {
    return NextResponse.json({ message: "Ordem inválida." }, { status: 400 });
  }

  try {
    await reorderPortfolioProjects(body.ids);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível reordenar os projetos.",
      },
      { status: 500 },
    );
  }
}
