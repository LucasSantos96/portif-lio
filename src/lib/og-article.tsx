import { ImageResponse } from "next/og";

import { getPublishedArticleBySlug, localizeArticle } from "@/lib/articles";
import { loadOgAssets } from "@/lib/og";
import { site } from "@/lib/site";
import type { ArticleLocale } from "@/types";

const size = { width: 1200, height: 630 };

/** Cartão de compartilhamento do artigo: foto do site ao fundo, título grande e autor. */
export async function articleOgImage(locale: ArticleLocale, slug: string) {
  const [row, { posterSrc, fonts }] = await Promise.all([
    getPublishedArticleBySlug(locale, slug),
    loadOgAssets(),
  ]);
  const article = row ? localizeArticle(row, locale) : null;
  const title = article?.title ?? site.title;
  // Títulos longos precisam de fonte menor para caber em até 4 linhas.
  const titleSize = title.length > 55 ? 60 : title.length > 35 ? 72 : 84;

  return new ImageResponse(
    (
      <div style={{ position: "relative", display: "flex", width: "100%", height: "100%", background: "#0e191c" }}>
        {/* Satori (next/og) só renderiza <img> comum. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={posterSrc}
          alt=""
          width={1200}
          height={675}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(90deg, rgba(14,25,28,0.97) 0%, rgba(14,25,28,0.9) 60%, rgba(14,25,28,0.5) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 80px",
            width: "100%",
            height: "100%",
            color: "#e8eeec",
            fontFamily: fonts.length ? "Bricolage" : undefined,
          }}
        >
          <div style={{ fontSize: 34, color: "#f2b36b" }}>Blog</div>
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              maxWidth: 980,
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 36, fontWeight: 700 }}>{site.name}</div>
            <div style={{ marginTop: 6, fontSize: 28, color: "#94a8aa" }}>{site.jobTitle}</div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
