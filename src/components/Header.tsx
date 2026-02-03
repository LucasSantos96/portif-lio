"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleMenu = (): void => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="w-full text-white flex py-6 mb-4 lg:justify-center lg:py-7 border-b border-[#ffffff2c]">

            {/*menu mobile */}
            <nav className={`${isOpen ? "flex" : "hidden"} lg:hidden flex-col fixed inset-0 z-50 gap-10 bg-[#000000fa] items-center justify-center list-none text-2xl shadow-2xl transition-all duration-300`}>
                <li onClick={toggleMenu}>
                    <Link href={"#sobre"} className="hover:text-[#F57D38]">Sobre</Link>
                </li>
                <li onClick={toggleMenu}>
                    <Link href={"#habilidades"} className="hover:text-[#F57D38]">Habilidades</Link>
                </li>
                <li onClick={toggleMenu}>
                    <Link href={"#projetos"} className="hover:text-[#F57D38]">Projetos</Link>
                </li>
                <li onClick={toggleMenu}>
                    <Link href={"#contato"} className="hover:text-[#F57D38]">Contato</Link>
                </li>
            </nav>
            {/*Botão menu mobile */}
            <button
                onClick={toggleMenu}
                aria-label={isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
                className="lg:hidden px-4 absolute right-4 top-2 z-[60]"
            >
                {isOpen ? (
                    <X size={32} />
                ) : (
                    <Menu size={32} />
                )}
            </button>

            {/*menu desktop */}
            <nav className="hidden list-none gap-10 lg:flex">
                <li className="hover:text-[#F57D38]">
                    <Link href={"#sobre"}>Sobre</Link>
                </li>
                <li className="hover:text-[#F57D38]">
                    <Link href={"#habilidades"}>Habilidades</Link>
                </li>
                <li className="hover:text-[#F57D38]">
                    <Link href={"#projetos"}>Projetos</Link>
                </li>
                <li className="hover:text-[#F57D38]">
                    <Link href={"#contato"}>Contato</Link>
                </li>
            </nav>
        </header>
    );
};

export default Header;
