"use client";

import React from "react";
import Image from "next/image";
import { Bot, Globe, LayoutDashboard, Workflow, type LucideIcon } from "lucide-react";
import {
  SiLangchain,
  SiLanggraph,
  SiN8n,
  SiPython,
  SiTypescript,
} from "@icons-pack/react-simple-icons";

import Reveal from "@/components/motion/Reveal";
import SectionHeading, { sectionContainer } from "@/components/SectionHeading";
import { GlowCard } from "@/components/ui/glow-card";
import { useLocale } from "@/i18n/useLocale";

type IconComponent = React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

interface StackItem {
  name: string;
  icon: IconComponent;
}

// O Simple Icons ainda não tem a marca do Mastra; usamos um ícone neutro.
const automationStack: Record<"orchestration" | "agents" | "languages", StackItem[]> = {
  orchestration: [{ name: "n8n", icon: SiN8n }],
  agents: [
    { name: "LangChain", icon: SiLangchain },
    { name: "LangGraph", icon: SiLanggraph },
    { name: "Mastra", icon: Bot },
  ],
  languages: [
    { name: "Python", icon: SiPython },
    { name: "TypeScript", icon: SiTypescript },
  ],
};

const partnerLogos = [
  { name: "Bling", src: "/services/bling.webp" },
  { name: "Olist", src: "/services/olist.webp" },
  { name: "CardápioWeb", src: "/services/cardapioweb.webp" },
];

function ServiceIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="mb-6 flex size-11 items-center justify-center rounded-full border border-monitor/25 bg-monitor/10 text-monitor">
      <Icon className="size-5" aria-hidden />
    </span>
  );
}

const Services: React.FC = () => {
  const { t } = useLocale();
  const s = t.services;

  return (
    <section id="servicos" aria-labelledby="servicos-title" className="scroll-mt-24 py-20 md:py-28">
      <div className={sectionContainer}>
        <SectionHeading id="servicos-title" title={s.title} intro={s.intro} />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[auto_auto_auto]">
          <Reveal className="md:col-span-2 lg:row-span-2">
            <GlowCard className="h-full p-6 md:p-8">
              <div className="flex h-full flex-col">
                <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl border border-paper/[0.08] bg-[#14141a]">
                  <Image
                    src="/services/n8n-flow.png"
                    alt={s.automation.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 760px, 100vw"
                    className="object-cover transition-transform duration-[1.2s] ease-out group-hover/glow:scale-[1.03]"
                  />
                </div>

                <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
                  <div>
                    <ServiceIcon icon={Workflow} />
                    <h3 className="type-heading text-3xl text-paper md:text-4xl">{s.automation.title}</h3>
                    <p className="mt-4 max-w-[46ch] text-lg text-fog">{s.automation.description}</p>
                  </div>

                  <dl className="grid gap-4 md:min-w-[260px]">
                    {(Object.keys(automationStack) as (keyof typeof automationStack)[]).map((group) => (
                      <div key={group}>
                        <dt className="mb-2 text-sm text-fog">{s.automation.groups[group]}</dt>
                        <dd className="flex flex-wrap gap-2">
                          {automationStack[group].map(({ name, icon: Icon }) => (
                            <span
                              key={name}
                              className="inline-flex items-center gap-2 rounded-full border border-paper/10 bg-paper/[0.04] px-3 py-1.5 text-sm text-paper"
                            >
                              <Icon className="size-4" aria-hidden />
                              {name}
                            </span>
                          ))}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </GlowCard>
          </Reveal>

          <Reveal delay={0.08}>
            <GlowCard className="h-full p-6 md:p-8">
              <ServiceIcon icon={Globe} />
              <h3 className="type-heading text-2xl text-paper md:text-3xl">{s.sites.title}</h3>
              <p className="mt-3 text-fog">{s.sites.description}</p>
            </GlowCard>
          </Reveal>

          <Reveal delay={0.12}>
            <GlowCard className="h-full p-6 md:p-8">
              <ServiceIcon icon={LayoutDashboard} />
              <h3 className="type-heading text-2xl text-paper md:text-3xl">{s.systems.title}</h3>
              <p className="mt-3 text-fog">{s.systems.description}</p>
            </GlowCard>
          </Reveal>

          <Reveal delay={0.08} className="md:col-span-2 lg:col-span-3">
            <GlowCard className="p-6 md:p-8">
              <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="max-w-[56ch]">
                  <h3 className="type-heading text-2xl text-paper md:text-3xl">{s.erp.title}</h3>
                  <p className="mt-3 text-fog">{s.erp.description}</p>
                </div>

                <div>
                  <p className="mb-3 text-sm text-fog">{s.erp.partners}</p>
                  <ul className="flex gap-5">
                    {partnerLogos.map((logo) => (
                      <li key={logo.name} className="flex flex-col items-center gap-2">
                        <span className="size-16 overflow-hidden rounded-full ring-1 ring-paper/15">
                          <Image
                            src={logo.src}
                            alt=""
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                          />
                        </span>
                        <span className="text-sm text-paper">{logo.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </GlowCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Services;
