import pt, { type Dictionary } from "./pt";
import en from "./en";

export type Locale = "pt" | "en";

export const dictionaries: Record<Locale, Dictionary> = { pt, en };

export type { Dictionary };
