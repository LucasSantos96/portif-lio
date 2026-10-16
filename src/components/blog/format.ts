import type { ArticleLocale } from "@/types";

/** Data por extenso no idioma da página. UTC para o servidor e o navegador mostrarem o mesmo dia. */
export function formatArticleDate(iso: string, locale: ArticleLocale) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "pt-BR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(iso));
}
