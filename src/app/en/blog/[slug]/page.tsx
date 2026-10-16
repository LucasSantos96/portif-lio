import type { Metadata } from "next";

import ArticlePage from "@/components/blog/ArticlePage";
import { articleMetadata } from "@/lib/blog-seo";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return articleMetadata("en", (await params).slug);
}

export default async function Page({ params }: PageProps) {
  return <ArticlePage locale="en" slug={(await params).slug} />;
}
