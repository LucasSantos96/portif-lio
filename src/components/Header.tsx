"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { locale, setLocale, t } = useLocale();

    const toggleMenu = (): void => {
        setIsOpen(!isOpen);
    };

    const toggleLocale = (): void => {
        setLocale(locale === "pt" ? "en" : "pt");
    };

    const LangToggle = (
        <button
            onClick={toggleLocale}
            aria-label={t.header.langToggleLabel}
            className="flex items-center gap-1 text-sm font-medium tracking-wide"
        >
            <span className={locale === "pt" ? "text-[#F57D38]" : "text-white/60"}>PT</span>
            <span className="text-white/40">/</span>
            <span className={locale === "en" ? "text-[#F57D38]" : "text-white/60"}>EN</span>
        </button>
    );

    return (
        <header className="w-full text-white flex py-6 mb-4 lg:justify-center lg:py-7 border-b border-[#ffffff2c]">

            {/*menu mobile */}
            <nav className={`${isOpen ? "flex" : "hidden"} lg:hidden flex-col fixed inset-0 z-50 gap-10 bg-[#000000fa] items-center justify-center list-none text-2xl shadow-2xl transition-all duration-300`}>
                <li onClick={toggleMenu}>
                    <Link href={"#sobre"} className="hover:text-[#F57D38]">{t.header.nav.about}</Link>
                </li>
                <li onClick={toggleMenu}>
                    <Link href={"#habilidades"} className="hover:text-[#F57D38]">{t.header.nav.skills}</Link>
                </li>
                <li onClick={toggleMenu}>
                    <Link href={"#projetos"} className="hover:text-[#F57D38]">{t.header.nav.projects}</Link>
                </li>
                <li onClick={toggleMenu}>
                    <Link href={"#contato"} className="hover:text-[#F57D38]">{t.header.nav.contact}</Link>
                </li>
                <li>{LangToggle}</li>
            </nav>
            {/*Botão menu mobile */}
            <button
                onClick={toggleMenu}
                aria-label={isOpen ? t.header.closeMenu : t.header.openMenu}
                className="lg:hidden px-4 absolute right-4 top-2 z-[60]"
            >
                {isOpen ? (
                    <X size={32} />
                ) : (
                    <Menu size={32} />
                )}
            </button>

            {/*menu desktop */}
            <nav className="hidden list-none gap-10 lg:flex lg:items-center">
                <li className="hover:text-[#F57D38]">
                    <Link href={"#sobre"}>{t.header.nav.about}</Link>
                </li>
                <li className="hover:text-[#F57D38]">
                    <Link href={"#habilidades"}>{t.header.nav.skills}</Link>
                </li>
                <li className="hover:text-[#F57D38]">
                    <Link href={"#projetos"}>{t.header.nav.projects}</Link>
                </li>
                <li className="hover:text-[#F57D38]">
                    <Link href={"#contato"}>{t.header.nav.contact}</Link>
                </li>
                <li>{LangToggle}</li>
            </nav>
        </header>
    );
};

export default Header;
