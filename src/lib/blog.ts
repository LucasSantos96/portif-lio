import type { ArticleLocale } from "@/types";

export const BLOG_LIMITS = {
  slug: 90,
  title: 70,
  excerpt: 170,
  body: 60000,
  tags: 8,
} as const;

export function blogIndexPath(locale: ArticleLocale) {
  return locale === "en" ? "/en/blog" : "/blog";
}

export function articlePath(locale: ArticleLocale, slug: string) {
  return `${blogIndexPath(locale)}/${slug}`;
}

/** Gera um slug de URL: minúsculas, sem acento, hífens. */
export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, BLOG_LIMITS.slug)
    .replace(/-+$/g, "");
}

export function isValidSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= BLOG_LIMITS.slug;
}

/** Tempo de leitura em minutos (~220 palavras por minuto), no mínimo 1. */
export function readingMinutes(markdown: string) {
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`~\-\[\]()!|]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(words / 220));
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
  /** Linha (1-based) do título no Markdown original; liga o item ao título renderizado. */
  line: number;
}

/** Texto puro de um trecho de Markdown inline (para ids e sumário). */
export function stripInlineMarkdown(text: string) {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .trim();
}

/** Sumário a partir dos títulos ## e ###, ignorando blocos de código. */
export function extractToc(markdown: string): TocItem[] {
  // Troca cada bloco de código por quebras de linha para manter a numeração das linhas.
  const masked = markdown.replace(/```[\s\S]*?```/g, (block) => block.replace(/[^\n]/g, ""));
  const seen = new Map<string, number>();
  const items: TocItem[] = [];

  masked.split("\n").forEach((line, index) => {
    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) {
      return;
    }

    const text = stripInlineMarkdown(match[2]);
    const base = slugify(text) || "secao";
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);

    items.push({
      id: count ? `${base}-${count + 1}` : base,
      text,
      level: match[1].length === 2 ? 2 : 3,
      line: index + 1,
    });
  });

  return items;
}
