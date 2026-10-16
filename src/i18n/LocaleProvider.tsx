"use client";

import React, { createContext, useEffect, useState, type ReactNode } from "react";
import { type Locale } from "./dictionaries";

const STORAGE_KEY = "locale";

interface LocaleContextValue {
  locale: Locale;
  /** `persist: false` troca o idioma só desta visita, sem lembrar a escolha. */
  setLocale: (locale: Locale, options?: { persist?: boolean }) => void;
  /** Endereço da mesma página no outro idioma, quando a página tem URL por idioma. */
  alternatePath: string | null;
  setAlternatePath: (path: string | null) => void;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

interface LocaleProviderProps {
  children: ReactNode;
  /** Idioma imposto pela URL (ex.: /en/blog). Sem ele vale a escolha salva do visitante. */
  forcedLocale?: Locale;
}

export function LocaleProvider({ children, forcedLocale }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(forcedLocale ?? "pt");
  const [alternatePath, setAlternatePath] = useState<string | null>(null);

  useEffect(() => {
    if (forcedLocale) {
      return;
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "pt" || stored === "en") {
        setLocaleState(stored);
      }
    } catch {
      // localStorage indisponível (ex.: modo privado) — mantém o padrão "pt"
    }
  }, [forcedLocale]);

  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : "pt-BR";
  }, [locale]);

  const setLocale = (next: Locale, options?: { persist?: boolean }) => {
    setLocaleState(next);

    if (options?.persist === false) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignora falha ao persistir
    }
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, alternatePath, setAlternatePath }}>
      {children}
    </LocaleContext.Provider>
  );
}
