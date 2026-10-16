import "server-only";

import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export function articleErrorResponse(error: unknown, fallback: string) {
  // P2002: violação de unicidade (slug já usado por outro artigo).
  if (typeof error === "object" && error && "code" in error && error.code === "P2002") {
    return NextResponse.json(
      { message: "Já existe um artigo com esse endereço (slug). Escolha outro." },
      { status: 409 },
    );
  }

  return NextResponse.json(
    { message: error instanceof Error ? error.message : fallback },
    { status: 500 },
  );
}

export function revalidateBlog() {
  revalidatePath("/sitemap.xml");
  revalidatePath("/llms.txt");
}
