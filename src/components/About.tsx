"use client";

import React from "react";
import Image from "next/image";
import { useLocale } from "@/i18n/useLocale";

const About: React.FC = () => {
  const { t } = useLocale();

  return (
    <section
      className="mt-20 text-white mx-5 lg:mx-32 lg:flex lg:justify-between lg:py-20 lg:items-center"
      id="sobre"
    >
      <div className="lg:w-[660px] ">
        <h2 className="text-[20px] mb-2 lg:text-[40px]">{t.about.title}</h2>
        <p className="font-light text-sm text-[#b0afaf] lg:text-[18px]">
          {t.about.paragraph}
        </p>
      </div>
      <div className="flex justify-center mt-5">
        <Image
          src={"/sobre.png"}
          alt="sobre"
          width={328}
          height={100}
          className="flex lg:hidden"
        />

        <Image
          src={"/sobre.png"}
          alt="sobre"
          width={402}
          height={100}
          className="hidden lg:flex"
        />
      </div>
    </section>
  );
};

export default About;
