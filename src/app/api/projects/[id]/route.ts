import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  deletePortfolioProject,
  updatePortfolioProject,
} from "@/lib/projects";
import {
  parseProjectBody,
  validateProjectBody,
} from "@/lib/project-validation";
import { isUploadSessionValid, UPLOAD_SESSION_COOKIE } from "@/lib/upload-auth";

function getProjectId(rawId: string) {
  const id = Number(rawId);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function ensureAuthorized() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(UPLOAD_SESSION_COOKIE)?.value;

  return isUploadSessionValid(sessionCookie);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await ensureAuthorized())) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  const { id: rawId } = await context.params;
  const id = getProjectId(rawId);

  if (!id) {
    return NextResponse.json({ message: "Projeto inválido." }, { status: 400 });
  }

  const body = await request.json();
  const validationError = validateProjectBody(body);

  if (validationError) {
    return NextResponse.json({ message: validationError }, { status: 400 });
  }

  try {
    const project = await updatePortfolioProject(id, parseProjectBody(body));
    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível atualizar o projeto.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await ensureAuthorized())) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  const { id: rawId } = await context.params;
  const id = getProjectId(rawId);

  if (!id) {
    return NextResponse.json({ message: "Projeto inválido." }, { status: 400 });
  }

  try {
    await deletePortfolioProject(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível excluir o projeto.",
      },
      { status: 500 },
    );
  }
}
