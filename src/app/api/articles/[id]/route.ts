import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { articleErrorResponse, revalidateBlog } from "@/lib/article-api";
import { deleteArticle, updateArticle } from "@/lib/articles";
import {
  parseArticleBody,
  validateArticleBody,
  type ArticleRequestBody,
} from "@/lib/article-validation";
import { isUploadSessionValid, UPLOAD_SESSION_COOKIE } from "@/lib/upload-auth";


function parseId(rawId: string) {
  const id = Number(rawId);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function isAuthorized() {
  const cookieStore = await cookies();
  return isUploadSessionValid(cookieStore.get(UPLOAD_SESSION_COOKIE)?.value);
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  const id = parseId((await context.params).id);

  if (!id) {
    return NextResponse.json({ message: "Artigo inválido." }, { status: 400 });
  }

  const body = (await request.json()) as ArticleRequestBody;
  const validationError = validateArticleBody(body);

  if (validationError) {
    return NextResponse.json({ message: validationError }, { status: 400 });
  }

  try {
    const article = await updateArticle(id, parseArticleBody(body));
    revalidateBlog();
    return NextResponse.json({ article });
  } catch (error) {
    return articleErrorResponse(error, "Não foi possível atualizar o artigo.");
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  const id = parseId((await context.params).id);

  if (!id) {
    return NextResponse.json({ message: "Artigo inválido." }, { status: 400 });
  }

  try {
    await deleteArticle(id);
    revalidateBlog();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return articleErrorResponse(error, "Não foi possível excluir o artigo.");
  }
}
