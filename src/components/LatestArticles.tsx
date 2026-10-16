import LatestArticlesClient from "@/components/LatestArticlesClient";
import { getPublishedArticles, localizeArticle } from "@/lib/articles";

const LatestArticles = async () => {
  const articles = (await getPublishedArticles()).slice(0, 3).map((article) => ({
    pt: localizeArticle(article, "pt"),
    en: localizeArticle(article, "en"),
  }));

  return <LatestArticlesClient articles={articles} />;
};

export default LatestArticles;
