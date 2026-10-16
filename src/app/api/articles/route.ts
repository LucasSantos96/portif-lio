import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { articleErrorResponse, revalidateBlog } from "@/lib/article-api";
import { createArticle } from "@/lib/articles";
import {
  parseArticleBody,
  validateArticleBody,
  type ArticleRequestBody,
} from "@/lib/article-validation";
import { isUploadSessionValid, UPLOAD_SESSION_COOKIE } from "@/lib/upload-auth";

export async function POST(request: Request) {
  const cookieStore = await cookies();

  if (!isUploadSessionValid(cookieStore.get(UPLOAD_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  const body = (await request.json()) as ArticleRequestBody;
  const validationError = validateArticleBody(body);

  if (validationError) {
    return NextResponse.json({ message: validationError }, { status: 400 });
  }

  try {
    const article = await createArticle(parseArticleBody(body));
    revalidateBlog();
    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    return articleErrorResponse(error, "Não foi possível salvar o artigo.");
  }
}
