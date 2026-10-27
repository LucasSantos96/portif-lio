"use client";

import { ArrowUpRight, Github } from "lucide-react";
import { motion } from "motion/react";

import { revealProps } from "@/components/motion/Reveal";
import SectionHeading, { sectionContainer } from "@/components/SectionHeading";
import { useLocale } from "@/i18n/useLocale";
import type { PortfolioProject } from "@/types";

interface ToolsClientProps {
  tools: PortfolioProject[];
}

/** Mostra o endereço sem o protocolo, para o visitante saber para onde o link vai. */
function displayUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

export default function ToolsClient({ tools }: ToolsClientProps) {
  const { locale, t } = useLocale();

  if (!tools.length) {
    return null;
  }

  return (
    <section id="ferramentas" aria-labelledby="ferramentas-title" className="scroll-mt-24 pb-20 md:pb-28">
      <div className={sectionContainer}>
        <SectionHeading id="ferramentas-title" title={t.tools.title} intro={t.tools.intro} />

        <ul className="grid gap-4 md:grid-cols-2">
          {tools.map((tool, index) => {
            const title = locale === "en" ? tool.titleEn ?? tool.title : tool.title;
            const description =
              locale === "en" ? tool.descriptionEn ?? tool.description : tool.description;
            const link = tool.githubRepo ?? tool.projectUrl;
            const isGithub = link.includes("github.com");

            return (
              <motion.li key={tool.id} {...revealProps((index % 2) * 0.06)}>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-[1.5rem] border border-paper/[0.08] bg-night-raised p-6 transition-colors duration-300 hover:border-paper/20 md:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="type-heading text-2xl text-paper">{title}</h3>
                    <ArrowUpRight
                      className="size-5 shrink-0 text-fog transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-lamp"
                      aria-hidden
                    />
                  </div>

                  <p className="mt-3 text-fog">{description}</p>

                  <ul className="mt-5 flex flex-wrap gap-2" aria-label={t.gallery.technologies}>
                    {tool.technologies.map((technology) => (
                      <li
                        key={technology}
                        className="rounded-full border border-paper/10 px-2.5 py-0.5 text-xs text-paper/85"
                      >
                        {technology}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-auto flex items-center gap-2 pt-6 text-sm text-fog transition-colors group-hover:text-paper">
                    {isGithub ? <Github className="size-4" aria-hidden /> : null}
                    <span className="truncate">{displayUrl(link)}</span>
                    <span className="sr-only">{t.tools.opensInNewTab}</span>
                  </p>
                </a>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
