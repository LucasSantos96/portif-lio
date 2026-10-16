export type ArticleLocale = "pt" | "en";

export interface Article {
    id: number;
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
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface NewArticleInput {
    slug: string;
    slugEn: string;
    title: string;
    titleEn: string;
    excerpt: string;
    excerptEn: string;
    body: string;
    bodyEn: string;
    coverUrl?: string | null;
    coverAlt?: string | null;
    coverAltEn?: string | null;
    tags: string[];
    tagsEn: string[];
    published: boolean;
}

/** Artigo já resolvido para um idioma, pronto para páginas, sitemap e SEO. */
export interface LocalizedArticle {
    id: number;
    locale: ArticleLocale;
    slug: string;
    path: string;
    alternatePath: string;
    title: string;
    excerpt: string;
    body: string;
    coverUrl: string | null;
    coverAlt: string;
    tags: string[];
    publishedAt: string;
    updatedAt: string;
    readingMinutes: number;
}
