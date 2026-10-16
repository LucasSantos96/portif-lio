"use client";

import { useEffect } from "react";

import { useLocale } from "@/i18n/useLocale";
import type { ArticleLocale } from "@/types";

interface BlogLocaleBridgeProps {
  locale: ArticleLocale;
  /** Endereço da mesma página no outro idioma. */
  alternatePath: string;
}

/**
 * Alinha o cabeçalho do site à língua da página do blog (que vem da URL) e
 * faz o botão PT/EN levar à versão equivalente em vez de só trocar os textos.
 */
export default function BlogLocaleBridge({ locale, alternatePath }: BlogLocaleBridgeProps) {
  const { setLocale, setAlternatePath } = useLocale();

  useEffect(() => {
    setLocale(locale, { persist: false });
    setAlternatePath(alternatePath);

    return () => setAlternatePath(null);
    // setLocale/setAlternatePath mudam a cada render do provider; só importam os valores da página.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, alternatePath]);

  return null;
}
