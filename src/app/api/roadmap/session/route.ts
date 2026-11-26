import { NextResponse } from "next/server";

import {
  getRoadmapSessionByToken,
  isValidEmail,
  upsertRoadmapSession,
} from "@/lib/roadmap";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token")?.trim() ?? "";

  if (!token) {
    return NextResponse.json({ message: "Token não informado." }, { status: 400 });
  }

  try {
    const session = await getRoadmapSessionByToken(token);
    if (!session) {
      return NextResponse.json({ message: "Sessão não encontrada." }, { status: 404 });
    }
    return NextResponse.json({ session });
  } catch (error) {
    console.error("Erro ao restaurar sessão do roadmap:", error);
    return NextResponse.json({ message: "Erro ao consultar sessão." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: { name?: string; email?: string; locale?: string };

  try {
    body = (await request.json()) as { name?: string; email?: string; locale?: string };
  } catch {
    return NextResponse.json({ message: "Corpo da requisição inválido." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const locale = body.locale === "en" ? "en" : "pt";

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json(
      { message: locale === "en" ? "Please enter your name (at least 2 characters)." : "Informe seu nome (mínimo 2 caracteres)." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { message: locale === "en" ? "Please enter a valid email address." : "Informe um e-mail válido." },
      { status: 400 },
    );
  }

  try {
    const session = await upsertRoadmapSession({ name, email, locale });
    return NextResponse.json({ session }, { status: 200 });
  } catch (error) {
    console.error("Erro ao salvar participante do roadmap:", error);
    return NextResponse.json(
      { message: locale === "en" ? "Could not save your session right now." : "Não foi possível salvar sua sessão agora." },
      { status: 500 },
    );
  }
}
