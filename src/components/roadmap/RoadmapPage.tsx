import type { Metadata } from "next";

import RoadmapClient from "@/components/roadmap/RoadmapClient";
import { absoluteUrl, site } from "@/lib/site";
import type { ArticleLocale } from "@/types";

export function roadmapPath(locale: ArticleLocale) {
  return locale === "en" ? "/en/roadmap" : "/roadmap";
}

export function roadmapMetadata(locale: ArticleLocale): Metadata {
  const isEn = locale === "en";
  const title = isEn
    ? "My Roadmap: AI Engineer 2027"
    : "Meu Roadmap: Engenheiro de IA 2027";
  const description = isEn
    ? "Interactive open-source roadmap from beginner to production AI Engineer: Python, RAG, LangChain, LangGraph, MCP, Langfuse, and Evals."
    : "Árvore interativa de estudos do iniciante ao avançado para se tornar Engenheiro de IA em 2027 com recursos gratuitos e open source.";

  const path = roadmapPath(locale);

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        "pt-BR": roadmapPath("pt"),
        en: roadmapPath("en"),
      },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title,
      description,
      url: absoluteUrl(path),
      locale: isEn ? "en_US" : "pt_BR",
    },
  };
}

export default function RoadmapPage({ locale }: { locale: ArticleLocale }) {
  return <RoadmapClient locale={locale} />;
}
