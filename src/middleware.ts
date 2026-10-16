import { NextResponse, type NextRequest } from "next/server";

/**
 * O blog tem URLs por idioma (/blog em português, /en/blog em inglês). O layout
 * raiz lê este cabeçalho para renderizar `<html lang>` e o idioma inicial do
 * site já corretos no HTML que o buscador recebe.
 */
export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-site-locale", request.nextUrl.pathname.startsWith("/en") ? "en" : "pt");

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/blog", "/blog/:path*", "/en/:path*"],
};
