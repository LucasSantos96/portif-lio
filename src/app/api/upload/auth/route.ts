import { NextResponse } from "next/server";

import {
  getUploadSessionToken,
  isUploadPasswordValid,
  UPLOAD_SESSION_COOKIE,
} from "@/lib/upload-auth";

interface LoginBody {
  password?: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBody;

  if (!body.password || !isUploadPasswordValid(body.password)) {
    return NextResponse.json(
      { message: "Senha inválida." },
      { status: 401 },
    );
  }

  const token = getUploadSessionToken();

  if (!token) {
    return NextResponse.json(
      { message: "UPLOAD_PASSWORD não configurada no ambiente." },
      { status: 500 },
    );
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: UPLOAD_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: UPLOAD_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
