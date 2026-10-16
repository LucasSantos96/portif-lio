"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, FolderOpen, Layers, Mail, UserRound } from "lucide-react";

import { TubelightNavbar, type TubelightNavItem } from "@/components/ui/tubelight-navbar";
import { useLocale } from "@/i18n/useLocale";
import { cn } from "@/lib/utils";

const SECTION_IDS = ["sobre", "servicos", "habilidades", "projetos", "contato"] as const;

function useActiveSection(enabled: boolean) {
    const [active, setActive] = useState<string | null>(null);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        const visible = new Map<string, number>();

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
                }

                let best: string | null = null;
                let bestRatio = 0;
                for (const [id, ratio] of visible) {
                    if (ratio > bestRatio) {
                        best = id;
                        bestRatio = ratio;
                    }
                }
                setActive(best);
            },
            { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
        );

        for (const id of SECTION_IDS) {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        }

        return () => observer.disconnect();
    }, [enabled]);

    return active;
}

const Header: React.FC = () => {
    const pathname = usePathname();
    const { locale, setLocale, t } = useLocale();
    const isHome = pathname === "/";
    const sectionInView = useActiveSection(isHome);
    const activeId = isHome ? sectionInView : pathname.startsWith("/projetos") ? "projetos" : null;

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    if (pathname.startsWith("/upload")) {
        return null;
    }

    const prefix = isHome ? "" : "/";
    const items: TubelightNavItem[] = [
        { id: "sobre", name: t.header.nav.about, href: `${prefix}#sobre`, icon: UserRound },
        { id: "servicos", name: t.header.nav.services, href: `${prefix}#servicos`, icon: Briefcase },
        { id: "habilidades", name: t.header.nav.skills, href: `${prefix}#habilidades`, icon: Layers },
        { id: "projetos", name: t.header.nav.projects, href: `${prefix}#projetos`, icon: FolderOpen },
        { id: "contato", name: t.header.nav.contact, href: `${prefix}#contato`, icon: Mail },
    ];

    const langToggle = (
        <button
            type="button"
            onClick={() => setLocale(locale === "pt" ? "en" : "pt")}
            className="flex h-11 items-center gap-1 rounded-full border border-white/10 bg-night/70 px-4 text-sm font-medium backdrop-blur-xl transition-colors hover:border-white/25"
        >
            <span className={locale === "pt" ? "text-lamp" : "text-fog"}>PT</span>
            <span className="text-fog/50">/</span>
            <span className={locale === "en" ? "text-lamp" : "text-fog"}>EN</span>
            {/* O nome acessível começa pelo texto visível (PT / EN) e explica a ação. */}
            <span className="sr-only">{t.header.langToggleLabel}</span>
        </button>
    );

    return (
        <>
            <header
                className={cn(
                    "fixed inset-x-0 top-0 z-40 transition-[padding] duration-500",
                    scrolled ? "py-3" : "py-5",
                )}
            >
                <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-4 md:px-8">
                    <Link
                        href="/"
                        aria-label={t.header.home}
                        className="type-heading text-lg text-paper"
                    >
                        Lucas Santos
                    </Link>

                    <nav aria-label="Principal" className="hidden md:block">
                        <TubelightNavbar items={items} activeId={activeId} />
                    </nav>

                    {langToggle}
                </div>
            </header>

            <nav
                aria-label="Principal"
                className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 md:hidden"
            >
                <TubelightNavbar items={items} activeId={activeId} compact />
            </nav>
        </>
    );
};

export default Header;
