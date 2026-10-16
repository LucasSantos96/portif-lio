import type { Metadata } from "next";

import BlogIndexPage from "@/components/blog/BlogIndexPage";
import { blogIndexMetadata } from "@/lib/blog-seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = blogIndexMetadata("en");

export default function Page() {
  return <BlogIndexPage locale="en" />;
}
