"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

import ArticleCard from "@/components/blog/ArticleCard";
import { revealProps } from "@/components/motion/Reveal";
import SectionHeading, { sectionContainer } from "@/components/SectionHeading";
import { useLocale } from "@/i18n/useLocale";
import { blogIndexPath } from "@/lib/blog";
import type { LocalizedArticle } from "@/types";

interface LatestArticlesClientProps {
  articles: { pt: LocalizedArticle; en: LocalizedArticle }[];
}

export default function LatestArticlesClient({ articles }: LatestArticlesClientProps) {
  const { locale, t } = useLocale();

  if (!articles.length) {
    return null;
  }

  return (
    <section id="artigos" aria-labelledby="artigos-title" className="scroll-mt-24 pb-20 md:pb-28">
      <div className={sectionContainer}>
        <SectionHeading id="artigos-title" title={t.blog.latest} intro={t.blog.intro} />

        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <motion.li key={article.pt.id} {...revealProps((index % 3) * 0.06)}>
              <ArticleCard article={article[locale]} />
            </motion.li>
          ))}
        </ul>

        <Link
          href={blogIndexPath(locale)}
          className="mt-8 inline-flex items-center gap-2 text-lamp transition-colors hover:text-paper"
        >
          {t.blog.allArticles}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
