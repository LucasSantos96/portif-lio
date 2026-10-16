import ArticleCard from "@/components/blog/ArticleCard";
import BlogLocaleBridge from "@/components/blog/BlogLocaleBridge";
import JsonLd from "@/components/JsonLd";
import { sectionContainer } from "@/components/SectionHeading";
import { dictionaries } from "@/i18n/dictionaries";
import { getPublishedArticles, localizeArticle } from "@/lib/articles";
import { blogIndexPath } from "@/lib/blog";
import { blogIndexJsonLd } from "@/lib/structured-data";
import type { ArticleLocale } from "@/types";

export default async function BlogIndexPage({ locale }: { locale: ArticleLocale }) {
  const t = dictionaries[locale].blog;
  const articles = (await getPublishedArticles()).map((article) => localizeArticle(article, locale));
  const [first, ...rest] = articles;

  return (
    <main className="pt-28 pb-24 md:pt-36">
      <BlogLocaleBridge locale={locale} alternatePath={blogIndexPath(locale === "en" ? "pt" : "en")} />
      <JsonLd data={blogIndexJsonLd(locale, t.metaDescription, articles)} />

      <div className={sectionContainer}>
        <header className="mb-12 md:mb-16">
          <h1 className="type-display text-5xl text-paper md:text-7xl">{t.title}</h1>
          <p className="mt-5 max-w-[52ch] text-lg text-fog md:text-xl">{t.intro}</p>
        </header>

        {first ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ArticleCard article={first} featured headingLevel="h2" className="md:col-span-2 lg:col-span-3" />
            {rest.map((article) => (
              <ArticleCard key={article.id} article={article} headingLevel="h2" />
            ))}
          </div>
        ) : (
          <p className="text-fog">{t.empty}</p>
        )}
      </div>
    </main>
  );
}
