import { articleOgImage } from "@/lib/og-article";

export const alt = "Capa do artigo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  return articleOgImage("pt", (await params).slug);
}
