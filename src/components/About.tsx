"use client";

import React from "react";
import Image from "next/image";

import Reveal from "@/components/motion/Reveal";
import SectionHeading, { sectionContainer } from "@/components/SectionHeading";
import { useLocale } from "@/i18n/useLocale";

const About: React.FC = () => {
  const { t } = useLocale();

  return (
    <section id="sobre" aria-labelledby="sobre-title" className="scroll-mt-24 py-20 md:py-28">
      <div className={`${sectionContainer} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
        <div className="lg:col-span-7">
          <SectionHeading id="sobre-title" title={t.about.title} className="mb-8 md:mb-10" />

          <Reveal delay={0.05}>
            <p className="type-heading max-w-[24ch] text-3xl text-paper md:text-[2.5rem]">
              {t.about.lead}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 max-w-[60ch] space-y-5 text-lg text-fog">
            {t.about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
        </div>

        <Reveal delay={0.15} className="lg:col-span-5 lg:pt-6">
          <div className="relative mx-auto aspect-square w-full max-w-[380px] overflow-hidden rounded-[1.75rem] border border-white/10 lg:ml-auto">
            <Image
              src="/about/lucas.png"
              alt={t.about.photoAlt}
              fill
              sizes="(min-width: 1024px) 380px, 90vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default About;
