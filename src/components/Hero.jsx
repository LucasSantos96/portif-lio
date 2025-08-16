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

      <div className="flex flex-col items-center lg:items-start">
        <div className="mt-4 flex justify-center flex-col lg:text-left">
          <h2 className="text-sm text-white lg:text-3xl">
            Oi, Sou Lucas Santos
          </h2>
          <h1 className="text-2xl uppercase font-bold text-[#0A80ED] lg:text-5xl">
            Desenvolvedor <br />full-stack
          </h1>
          <p className="text-sm font-light mt-5 text-[#979696] lg:text-2xl">
            apaixonado por criar aplicações web{" "}
            <br className="hidden lg:flex" /> inovadoras e fáceis de usar.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mt-5  lg:mt-16">
          <button
            className=" text-sm flex px-10 py-4 rounded-full text-white bg-[#F57D38] items-center gap-1 cursor-pointer "
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
            href="/lucasdev.pdf"
            download
            className="text-sm flex px-10 py-4 rounded-full text-white bg-[#0A80ED] items-center gap-1 cursor-pointer"
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
