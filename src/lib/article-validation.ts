import { BLOG_LIMITS, isValidSlug } from "@/lib/blog";

export interface ArticleRequestBody {
  slug?: string;
  slugEn?: string;
  title?: string;
  titleEn?: string;
  excerpt?: string;
  excerptEn?: string;
  body?: string;
  bodyEn?: string;
  coverUrl?: string | null;
  coverAlt?: string | null;
  coverAltEn?: string | null;
  tags?: string[] | string;
  tagsEn?: string[] | string;
  published?: boolean;
}

function toList(raw: unknown) {
  const items = Array.isArray(raw) ? raw : typeof raw === "string" ? raw.split(",") : [];

  return [
    ...new Set(
      items
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ];
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidImage(value: string) {
  if (value.startsWith("/")) {
    return true;
  }
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function parseArticleBody(body: ArticleRequestBody) {
  return {
    slug: text(body.slug),
    slugEn: text(body.slugEn),
    title: text(body.title),
    titleEn: text(body.titleEn),
    excerpt: text(body.excerpt),
    excerptEn: text(body.excerptEn),
    body: text(body.body),
    bodyEn: text(body.bodyEn),
    coverUrl: text(body.coverUrl) || null,
    coverAlt: text(body.coverAlt) || null,
    coverAltEn: text(body.coverAltEn) || null,
    tags: toList(body.tags),
    tagsEn: toList(body.tagsEn),
    published: body.published === true,
  };
}

/** Devolve a mensagem do primeiro problema, ou null se o artigo está válido. */
export function validateArticleBody(raw: ArticleRequestBody) {
  const article = parseArticleBody(raw);

  const required: [string, string][] = [
    [article.title, "título em português"],
    [article.titleEn, "título em inglês"],
    [article.excerpt, "resumo em português"],
    [article.excerptEn, "resumo em inglês"],
    [article.body, "texto em português"],
    [article.bodyEn, "texto em inglês"],
  ];

  const missing = required.filter(([value]) => !value).map(([, label]) => label);
  if (missing.length) {
    return `Preencha: ${missing.join(", ")}. Todo artigo precisa das duas versões.`;
  }

  if (!isValidSlug(article.slug) || !isValidSlug(article.slugEn)) {
    return "O endereço (slug) deve ter só letras minúsculas, números e hífens, ex.: automacao-com-ia.";
  }

  if (article.title.length > BLOG_LIMITS.title || article.titleEn.length > BLOG_LIMITS.title) {
    return `O título deve ter até ${BLOG_LIMITS.title} caracteres para aparecer inteiro no Google.`;
  }

  if (article.excerpt.length > BLOG_LIMITS.excerpt || article.excerptEn.length > BLOG_LIMITS.excerpt) {
    return `O resumo deve ter até ${BLOG_LIMITS.excerpt} caracteres: ele vira a descrição no Google.`;
  }

  if (article.body.length > BLOG_LIMITS.body || article.bodyEn.length > BLOG_LIMITS.body) {
    return `O texto deve ter até ${BLOG_LIMITS.body} caracteres.`;
  }

  if (article.tags.length > BLOG_LIMITS.tags || article.tagsEn.length > BLOG_LIMITS.tags) {
    return `Use até ${BLOG_LIMITS.tags} tags por idioma.`;
  }

  if (article.coverUrl && !isValidImage(article.coverUrl)) {
    return "A capa deve ser uma URL válida ou um caminho local (/imagem.png).";
  }

  if (article.coverUrl && (!article.coverAlt || !article.coverAltEn)) {
    return "Descreva a capa nos dois idiomas (texto alternativo): ajuda acessibilidade e SEO.";
  }

  return null;
}
