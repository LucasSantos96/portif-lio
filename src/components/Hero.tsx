"use client";

import React from "react";
import Image from "next/image";
import { MessageCircle, Download } from "lucide-react";

const Hero: React.FC = () => {
    const handleSubmit = (): void => {
        window.open(
            "https://wa.me/5522981073895?text=Olá%20vim%20do%20seu%20portifólio",
            "_blank"
        );
    };

    return (
        <section className="mx-[20px]  lg:mx-32 lg:flex lg:flex-row-reverse lg:justify-between lg:pt-24 lg:pb-24 lg:items-center">

            <div className="flex justify-center">
                <Image
                    src={"/eu.png"}
                    alt="Foto"
                    width={284}
                    height={224}
                    className="animate-float lg:hidden"
                />

                <Image
                    src={"/eu.png"}
                    alt="Foto"
                    width={510}
                    height={224}
                    className="hidden lg:flex animate-float"
                />
            </div>

            <div className="flex flex-col items-center lg:items-start">
                <div className="mt-4 flex justify-center flex-col lg:text-left">
                    <h2 className="text-sm text-white lg:text-3xl">
                        Oi, Sou Lucas Santos
                    </h2>
                    <h1 className="text-2xl font-bold text-[#0A80ED] lg:text-5xl capitalize">
                        Desenvolvedor <br />Full-Stack
                    </h1>
                    <p className="text-sm font-light  text-[#979696] lg:text-2xl">
                        Apaixonado por criar aplicações web{" "}
                        <br className="hidden lg:flex" /> inovadoras e fáceis de usar.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 mt-5  lg:mt-16">
                    <button
                        className=" text-sm flex items-center gap-2 px-10 py-4 rounded-full text-white bg-[#F57D38] cursor-pointer hover:scale-105 duration-300 hover:opacity-70 shadow-lg shadow-[#f57d383d]"
                        onClick={handleSubmit}
                        aria-label="Entrar em contato via WhatsApp"
                    >
                        Fale comigo
                        <MessageCircle size={20} />
                    </button>

                    <a
                        href="/lucasFullstack.pdf"
                        download
                        className="text-sm flex items-center gap-2 px-10 py-4 rounded-full text-white bg-[#0A80ED] cursor-pointer hover:scale-105 duration-300 hover:opacity-70 shadow-lg shadow-[#0a7fed46]"
                        aria-label="Baixar currículo em PDF"
                    >
                        Baixar curriculo
                        <Download size={20} />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
