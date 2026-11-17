"use client";

import Image from "next/image";
import { motion } from "motion/react";

import { revealProps } from "@/components/motion/Reveal";
import { useLocale } from "@/i18n/useLocale";
import type { ProjectUpdate } from "@/types";

interface ProjectTimelineProps {
  projectTitle: string;
  updates: ProjectUpdate[];
  /** Abre a imagem no lightbox da página (índice na lista de fotos). */
  onOpenImage: (src: string) => void;
}

function formatMonth(iso: string, locale: "pt" | "en") {
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

/** Linha do tempo vertical das atualizações do projeto. Sem atualizações, não renderiza nada. */
export default function ProjectTimeline({ projectTitle, updates, onOpenImage }: ProjectTimelineProps) {
  const { locale, t } = useLocale();

  if (!updates.length) {
    return null;
  }

  return (
    <section aria-labelledby="timeline-title" className="mt-20 md:mt-28">
      <motion.div {...revealProps()}>
        <h2 id="timeline-title" className="type-heading text-4xl text-paper md:text-5xl">
          {t.gallery.timelineTitle}
        </h2>
        <p className="mt-4 max-w-[60ch] text-fog">{t.gallery.timelineIntro}</p>
      </motion.div>

      <ol className="mt-10 border-l border-paper/15 md:mt-14">
        {updates.map((update, index) => {
          const title = locale === "en" ? update.titleEn ?? update.title : update.title;
          const description =
            locale === "en" ? update.descriptionEn ?? update.description : update.description;

          return (
            <motion.li
              key={update.id}
              {...revealProps((index % 3) * 0.05)}
              className="relative pb-12 pl-6 last:pb-0 md:pl-10"
            >
              <span
                aria-hidden
                className="absolute top-2 -left-[5px] size-2.5 rounded-full bg-lamp ring-4 ring-[var(--background)]"
              />
              <time
                dateTime={update.occurredAt}
                className="block text-sm font-medium tracking-wide text-lamp first-letter:uppercase"
              >
                {formatMonth(update.occurredAt, locale)}
              </time>
              <h3 className="type-heading mt-2 text-2xl text-paper md:text-3xl">{title}</h3>
              <p className="mt-3 max-w-[65ch] text-fog">{description}</p>

              {update.images.length ? (
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {update.images.map((src) => (
                    <li key={src}>
                      <button
                        type="button"
                        onClick={() => onOpenImage(src)}
                        aria-label={t.gallery.openUpdateImage(title)}
                        className="group block w-full overflow-hidden rounded-[1rem] border border-paper/[0.08] bg-night-high"
                      >
                        <Image
                          src={src}
                          alt={t.gallery.timelineImageAlt(projectTitle, title)}
                          width={1600}
                          height={900}
                          sizes="(min-width: 1024px) 40vw, (min-width: 640px) 45vw, 100vw"
                          className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
