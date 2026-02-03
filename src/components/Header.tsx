"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleMenu = (): void => {
        setIsOpen(!isOpen);
    };

    return (
        <header className=" text-white flex  py-6 mb-4    lg:justify-center lg:py-7 border-b border-[#ffffff2c] ">

            {/*menu mobile */}
            <nav className={`${isOpen ? "flex" : "hidden"} lg:hidden  flex-col absolute right-0   top-0  gap-6 bg-[#000] h-full list-none px-14 pt-16  text-sm shadow-[#578be760] shadow-2xl`}>
                <li >
                    <Link href={"#sobre"}>Sobre</Link>

                </li>
                <li >
                    <Link href={"#habilidades"}>Habilidades</Link>

                </li>
                <li >
                    <Link href={"#projetos"}>Projetos</Link>

                </li>
                <li >
                    <Link href={"#contato"}>Contato</Link>

                </li>
            </nav>
            {/*Botão menu mobile */}
            <button
                onClick={toggleMenu}
                aria-label="Abrir Menu"
                className="lg:hidden px-4 absolute right-0 top-3"
            >
                {isOpen ? (
                    <Image src={"/x.png"} alt="Menu" width={30} height={20} />
                ) : (
                    <Image src={"/menu.png"} alt="Menu" width={30} height={20} />
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
