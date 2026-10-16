import { articleOgImage } from "@/lib/og-article";

export const alt = "Article cover";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  return articleOgImage("en", (await params).slug);
}
