"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { useLocale } from "@/i18n/useLocale";

type Theme = "dark" | "light";

const THEME_COLOR: Record<Theme, string> = { dark: "#0e191c", light: "#eef3f3" };

export default function ThemeToggle() {
    const { t } = useLocale();
    const [theme, setTheme] = useState<Theme>("dark");

    // O script do <head> já aplicou o tema salvo; aqui só sincronizamos o estado.
    useEffect(() => {
        setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
    }, []);

    const toggle = () => {
        const next: Theme = theme === "dark" ? "light" : "dark";

        document.documentElement.dataset.theme = next;
        document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[next]);
        setTheme(next);

        try {
            localStorage.setItem("theme", next);
        } catch {
            // Armazenamento bloqueado: o tema vale só nesta visita.
        }
    };

    const Icon = theme === "dark" ? Sun : Moon;

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={theme === "dark" ? t.header.themeToLight : t.header.themeToDark}
            className="flex size-11 items-center justify-center rounded-full border border-paper/10 bg-night/70 text-paper backdrop-blur-xl transition-colors hover:border-paper/25"
        >
            <Icon className="size-5" aria-hidden />
        </button>
    );
}
