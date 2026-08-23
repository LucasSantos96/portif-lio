"use client";

import { useContext } from "react";
import { LocaleContext } from "./LocaleProvider";
import { dictionaries } from "./dictionaries";

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale deve ser usado dentro de um LocaleProvider");
  }
  const t = dictionaries[ctx.locale];
  return { locale: ctx.locale, setLocale: ctx.setLocale, t };
}
