"use client";

import React from "react";
import Image from "next/image";

const Hero = () => {
  const handleSubmit = () => {
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
          className=" lg:hidden"
        />

        <Image
          src={"/eu.png"}
          alt="Foto"
          width={510}
          height={224}
          className="hidden lg:flex"
        />
      </div>

      <div className="lg:flex lg:flex-col lg:items-start">
        <div className="mt-4 flex justify-center flex-col lg:text-left">
          <h2 className="text-sm text-white lg:text-3xl">
            Oi, Sou Lucas Santos
          </h2>
          <h1 className="text-[20px] uppercase font-bold text-[#0A80ED] lg:text-[40px]">
            Desenvolvedor full-stack
          </h1>
          <p className="text-sm text-white lg:text-3xl">
            apaixonado por criar aplicações web{" "}
            <br className="hidden lg:flex" /> inovadoras e fáceis de usar.
          </p>
        </div>

        <div className="flex gap-2 mt-5  lg:mt-20">
          <button
            className="flex px-4 py0 rounded-[20px] text-white bg-[#F57D38] h-[34px] items-center gap-1 cursor-pointer "
            onClick={handleSubmit}
          >
            Fale comigo
            <Image
              src={"/ChatBubble.png"}
              alt="chat icon"
              width={20}
              height={24}
            />
          </button>

          <a
            href="/lucasDev.pdf"
            download
            className="flex px-4 py0 rounded-[20px] text-white bg-[#0A80ED] h-[34px] items-center gap-1 cursor-pointer"
          >
            Baixar curriculo
            <Image
              src={"/Download.png"}
              alt="chat icon"
              width={24}
              height={24}
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
