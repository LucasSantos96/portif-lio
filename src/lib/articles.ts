import "server-only";

import { getDatabaseUrl } from "@/lib/database-url";
import { articlePath, readingMinutes } from "@/lib/blog";
import { prisma } from "@/lib/prisma";
import type { Article, ArticleLocale, LocalizedArticle, NewArticleInput } from "@/types";

interface DbArticle {
  id: bigint;
  slug: string;
  slugEn: string;
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
  body: string;
  bodyEn: string;
  coverUrl: string | null;
  coverAlt: string | null;
  coverAltEn: string | null;
  tags: string[];
  tagsEn: string[];
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

function mapArticle(row: DbArticle): Article {
  return {
    id: Number(row.id),
    slug: row.slug,
    slugEn: row.slugEn,
    title: row.title,
    titleEn: row.titleEn,
    excerpt: row.excerpt,
    excerptEn: row.excerptEn,
    body: row.body,
    bodyEn: row.bodyEn,
    coverUrl: row.coverUrl,
    coverAlt: row.coverAlt,
    coverAltEn: row.coverAltEn,
    tags: row.tags ?? [],
    tagsEn: row.tagsEn ?? [],
    published: row.published,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

/** Resolve o artigo para um idioma, com caminhos e tempo de leitura prontos. */
export function localizeArticle(article: Article, locale: ArticleLocale): LocalizedArticle {
  const en = locale === "en";
  const slug = en ? article.slugEn : article.slug;
  const body = en ? article.bodyEn : article.body;

  return {
    id: article.id,
    locale,
    slug,
    path: articlePath(locale, slug),
    alternatePath: articlePath(en ? "pt" : "en", en ? article.slug : article.slugEn),
    title: en ? article.titleEn : article.title,
    excerpt: en ? article.excerptEn : article.excerpt,
    body,
    coverUrl: article.coverUrl,
    coverAlt: (en ? article.coverAltEn : article.coverAlt) ?? "",
    tags: en ? article.tagsEn : article.tags,
    publishedAt: article.publishedAt ?? article.createdAt,
    updatedAt: article.updatedAt,
    readingMinutes: readingMinutes(body),
  };
}

function assertDatabaseConfigured() {
  if (!getDatabaseUrl()) {
    throw new Error(
      "Configure DATABASE_URL ou POSTGRES_PRISMA_URL para conectar o Prisma no ambiente atual.",
    );
  }
}

function logError(action: string, error: unknown) {
  console.error(`Erro ao ${action} com Prisma:`, error instanceof Error ? `${error.name} ${error.message}` : error);
}

/** Todos os artigos (rascunhos incluídos), do mais recente para o mais antigo. Uso do painel. */
export async function getAllArticles(): Promise<Article[]> {
  if (!getDatabaseUrl()) {
    return [];
  }

  try {
    const rows = await prisma.article.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });
    return (rows as DbArticle[]).map(mapArticle);
  } catch (error) {
    logError("buscar artigos", error);
    return [];
  }
}

/** Artigos publicados e já no ar, do mais recente para o mais antigo. */
export async function getPublishedArticles(): Promise<Article[]> {
  if (!getDatabaseUrl()) {
    return [];
  }

  try {
    const rows = await prisma.article.findMany({
      where: { published: true, publishedAt: { lte: new Date() } },
      orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
    });
    return (rows as DbArticle[]).map(mapArticle);
  } catch (error) {
    logError("buscar artigos publicados", error);
    return [];
  }
}

export async function getPublishedArticleBySlug(
  locale: ArticleLocale,
  slug: string,
): Promise<Article | null> {
  if (!getDatabaseUrl()) {
    return null;
  }

  try {
    const row = await prisma.article.findFirst({
      where: {
        ...(locale === "en" ? { slugEn: slug } : { slug }),
        published: true,
        publishedAt: { lte: new Date() },
      },
    });
    return row ? mapArticle(row as DbArticle) : null;
  } catch (error) {
    logError("buscar artigo", error);
    return null;
  }
}

export async function createArticle(input: NewArticleInput) {
  assertDatabaseConfigured();

  const row = await prisma.article.create({
    data: { ...input, publishedAt: input.published ? new Date() : null },
  });
  return mapArticle(row as DbArticle);
}

export async function updateArticle(id: number, input: NewArticleInput) {
  assertDatabaseConfigured();

  const current = await prisma.article.findUniqueOrThrow({ where: { id } });
  // A data de publicação é a da primeira vez que foi ao ar; despublicar e
  // publicar de novo não muda a data nem o endereço indexado.
  const publishedAt = input.published ? (current.publishedAt ?? new Date()) : current.publishedAt;

  const row = await prisma.article.update({
    where: { id },
    data: { ...input, publishedAt },
  });
  return mapArticle(row as DbArticle);
}

export async function deleteArticle(id: number) {
  assertDatabaseConfigured();
  await prisma.article.delete({ where: { id } });
}
