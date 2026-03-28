import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createPortfolioProject } from "@/lib/projects";
import {
  parseProjectBody,
  type ProjectRequestBody,
  validateProjectBody,
} from "@/lib/project-validation";
import { isUploadSessionValid, UPLOAD_SESSION_COOKIE } from "@/lib/upload-auth";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(UPLOAD_SESSION_COOKIE)?.value;

  if (!isUploadSessionValid(sessionCookie)) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  const body = (await request.json()) as ProjectRequestBody;
  const validationError = validateProjectBody(body);

  if (validationError) {
    return NextResponse.json(
      { message: validationError },
      { status: 400 },
    );
  }

  try {
    const project = await createPortfolioProject(parseProjectBody(body));

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível salvar o projeto.",
      },
      { status: 500 },
    );
  }
}
