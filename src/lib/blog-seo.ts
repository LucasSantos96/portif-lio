import type { Metadata } from "next";

import { getPublishedArticleBySlug, localizeArticle } from "@/lib/articles";
import { blogIndexPath } from "@/lib/blog";
import { dictionaries } from "@/i18n/dictionaries";
import { absoluteUrl } from "@/lib/site";
import type { ArticleLocale } from "@/types";

const OG_LOCALE = { pt: "pt_BR", en: "en_US" } as const;
const HREFLANG = { pt: "pt-BR", en: "en" } as const;

export function blogIndexMetadata(locale: ArticleLocale): Metadata {
  const t = dictionaries[locale].blog;
  const path = blogIndexPath(locale);

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: {
      canonical: path,
      languages: {
        [HREFLANG.pt]: absoluteUrl(blogIndexPath("pt")),
        [HREFLANG.en]: absoluteUrl(blogIndexPath("en")),
        "x-default": absoluteUrl(blogIndexPath("pt")),
      },
    },
    openGraph: {
      type: "website",
      url: path,
      title: t.metaTitle,
      description: t.metaDescription,
      locale: OG_LOCALE[locale],
    },
    twitter: { card: "summary_large_image", title: t.metaTitle, description: t.metaDescription },
  };
}

export async function articleMetadata(locale: ArticleLocale, slug: string): Promise<Metadata> {
  const row = await getPublishedArticleBySlug(locale, slug);

  if (!row) {
    return { title: locale === "en" ? "Article not found" : "Artigo não encontrado", robots: { index: false } };
  }

  const article = localizeArticle(row, locale);
  const other = locale === "en" ? "pt" : "en";

  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.tags,
    alternates: {
      canonical: article.path,
      languages: {
        [HREFLANG[locale]]: absoluteUrl(article.path),
        [HREFLANG[other]]: absoluteUrl(article.alternatePath),
        "x-default": absoluteUrl(locale === "pt" ? article.path : article.alternatePath),
      },
    },
    openGraph: {
      type: "article",
      url: article.path,
      title: article.title,
      description: article.excerpt,
      locale: OG_LOCALE[locale],
      alternateLocale: [OG_LOCALE[other]],
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: ["Lucas Santos de Oliveira"],
      tags: article.tags,
      // Sem capa, vale a imagem gerada em opengraph-image.tsx da própria rota.
      ...(article.coverUrl ? { images: [{ url: article.coverUrl, alt: article.coverAlt || article.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      ...(article.coverUrl ? { images: [article.coverUrl] } : {}),
    },
  };
}
