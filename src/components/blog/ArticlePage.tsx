import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import ArticleBody from "@/components/blog/ArticleBody";
import ArticleCard from "@/components/blog/ArticleCard";
import ArticleCta from "@/components/blog/ArticleCta";
import BlogLocaleBridge from "@/components/blog/BlogLocaleBridge";
import { formatArticleDate } from "@/components/blog/format";
import TableOfContents from "@/components/blog/TableOfContents";
import JsonLd from "@/components/JsonLd";
import { sectionContainer } from "@/components/SectionHeading";
import { dictionaries } from "@/i18n/dictionaries";
import { getPublishedArticles, localizeArticle } from "@/lib/articles";
import { blogIndexPath, extractToc } from "@/lib/blog";
import { absoluteUrl } from "@/lib/site";
import { articleJsonLd } from "@/lib/structured-data";
import type { ArticleLocale, LocalizedArticle } from "@/types";

/** Outros artigos, dando preferência aos que dividem assuntos com o atual. */
function pickRelated(current: LocalizedArticle, others: LocalizedArticle[]) {
  const score = (article: LocalizedArticle) =>
    article.tags.filter((tag) => current.tags.includes(tag)).length;

  return [...others].sort((a, b) => score(b) - score(a)).slice(0, 2);
}

export default async function ArticlePage({ locale, slug }: { locale: ArticleLocale; slug: string }) {
  const t = dictionaries[locale].blog;
  const all = (await getPublishedArticles()).map((article) => localizeArticle(article, locale));
  const article = all.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  const toc = extractToc(article.body);
  const related = pickRelated(article, all.filter((item) => item.id !== article.id));
  const updated = article.updatedAt.slice(0, 10) > article.publishedAt.slice(0, 10);

  return (
    <main className="pt-28 pb-24 md:pt-36">
      <BlogLocaleBridge locale={locale} alternatePath={article.alternatePath} />
      <JsonLd data={articleJsonLd(article)} />

      <article className={sectionContainer}>
        <header className="max-w-[68ch]">
          <Link
            href={blogIndexPath(locale)}
            className="inline-flex items-center gap-2 text-sm text-fog transition-colors hover:text-paper"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {t.backToBlog}
          </Link>

          <h1 className="type-display mt-6 text-4xl text-paper md:text-6xl">{article.title}</h1>
          <p className="mt-5 text-xl text-fog">{article.excerpt}</p>

          <p className="mt-6 text-sm text-fog">
            {t.publishedOn} <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt, locale)}</time>
            {updated ? (
              <>
                <span aria-hidden> · </span>
                {t.updatedOn} <time dateTime={article.updatedAt}>{formatArticleDate(article.updatedAt, locale)}</time>
              </>
            ) : null}
            <span aria-hidden> · </span>
            {t.minutes(article.readingMinutes)}
          </p>

          {article.tags.length ? (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label={t.tags}>
              {article.tags.map((tag) => (
                <li key={tag} className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-paper/85">
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </header>

        {article.coverUrl ? (
          <div className="relative mt-10 aspect-[16/8] overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-night-high">
            <Image
              src={article.coverUrl}
              alt={article.coverAlt}
              fill
              priority
              sizes="(min-width: 1240px) 1176px, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
          <div className="min-w-0">
            <ArticleBody markdown={article.body} />
            <ArticleCta title={article.title} url={absoluteUrl(article.path)} />
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <TableOfContents items={toc} title={t.toc} />
            </div>
          </aside>
        </div>

        {related.length ? (
          <section aria-labelledby="related-title" className="mt-20">
            <h2 id="related-title" className="type-heading mb-6 text-3xl text-paper">
              {t.related}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {related.map((item) => (
                <ArticleCard key={item.id} article={item} />
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </main>
  );
}
