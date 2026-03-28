import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { uploadProjectImage } from "@/lib/supabase-storage";
import { isUploadSessionValid, UPLOAD_SESSION_COOKIE } from "@/lib/upload-auth";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(UPLOAD_SESSION_COOKIE)?.value;

  if (!isUploadSessionValid(sessionCookie)) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Arquivo inválido." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ message: "Envie apenas imagens." }, { status: 400 });
  }

  try {
    const uploaded = await uploadProjectImage(file);
    return NextResponse.json(uploaded, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível enviar a imagem para o Storage.",
      },
      { status: 500 },
    );
  }
}
