import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { formatArticleDate } from "@/components/blog/format";
import { dictionaries } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";
import type { LocalizedArticle } from "@/types";

interface ArticleCardProps {
  article: LocalizedArticle;
  featured?: boolean;
  /** Nível do título do card; deve seguir o título da seção que o contém. */
  headingLevel?: "h2" | "h3";
  className?: string;
}

export default function ArticleCard({ article, featured = false, headingLevel: Heading = "h3", className }: ArticleCardProps) {
  const t = dictionaries[article.locale].blog;

  return (
    <article className={cn("h-full", className)}>
      <Link
        href={article.path}
        className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-night-raised transition-colors duration-300 hover:border-white/20"
      >
        {article.coverUrl ? (
          <div className={cn("relative overflow-hidden bg-night-high", featured ? "aspect-[16/8]" : "aspect-[16/10]")}>
            <Image
              src={article.coverUrl}
              alt={article.coverAlt}
              fill
              sizes={featured ? "(min-width: 1024px) 800px, 100vw" : "(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          </div>
        ) : null}

        <div className="flex flex-1 flex-col p-6 md:p-7">
          <p className="text-sm text-fog">
            <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt, article.locale)}</time>
            <span aria-hidden> · </span>
            {t.minutes(article.readingMinutes)}
          </p>

          <Heading className={cn("type-heading mt-3 text-paper", featured ? "text-3xl md:text-4xl" : "text-2xl")}>
            {article.title}
          </Heading>
          <p className={cn("mt-3 text-fog", featured ? "max-w-[60ch] text-lg" : "line-clamp-3")}>{article.excerpt}</p>

          <span className="mt-auto flex items-center gap-1.5 pt-6 text-sm font-medium text-lamp">
            {t.readArticle}
            <ArrowUpRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </span>
        </div>
      </Link>
    </article>
  );
}
