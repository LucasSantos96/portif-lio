"use client";

import Image from "next/image";
import Link from "next/link";
import { Camera, Images, PlayCircle } from "lucide-react";

import { motion } from "motion/react";

import { revealProps } from "@/components/motion/Reveal";
import SectionHeading, { sectionContainer } from "@/components/SectionHeading";
import { useLocale } from "@/i18n/useLocale";
import { cn } from "@/lib/utils";
import type { PortfolioProject } from "@/types";

interface ProjectsClientProps {
  projects: PortfolioProject[];
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const { locale, t } = useLocale();

  return (
    <section id="projetos" aria-labelledby="projetos-title" className="scroll-mt-24 py-20 md:py-28">
      <div className={sectionContainer}>
        <SectionHeading id="projetos-title" title={t.projects.title} intro={t.projects.intro} />

        {projects.length ? (
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => {
              const featured = index === 0;
              const title = locale === "en" ? project.titleEn ?? project.title : project.title;
              const description =
                locale === "en" ? project.descriptionEn ?? project.description : project.description;
              const photoCount = 1 + project.galleryImages.length;
              const videoCount = project.videoUrls.length;
              const extraTechs = project.technologies.length - 4;

              return (
                <motion.li
                  key={project.id}
                  {...revealProps((index % 3) * 0.06)}
                  className={cn(featured && "md:col-span-2 lg:row-span-2")}
                >
                    <Link
                      href={`/projetos/${project.id}`}
                      className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-night-raised transition-colors duration-300 hover:border-white/20"
                    >
                      <div
                        className={cn(
                          "relative overflow-hidden bg-night-high",
                          featured ? "aspect-[16/10] lg:aspect-auto lg:min-h-[320px] lg:flex-1" : "aspect-[16/10]",
                        )}
                      >
                        <Image
                          src={project.imageUrl}
                          alt=""
                          fill
                          sizes={featured ? "(min-width: 1024px) 800px, 100vw" : "(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"}
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />

                        <div className="absolute top-3 left-3 flex gap-2 text-xs text-paper">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-night/75 px-2.5 py-1 backdrop-blur-md">
                            <Camera className="size-3.5" aria-hidden />
                            {t.projects.photos(photoCount)}
                          </span>
                          {videoCount ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-night/75 px-2.5 py-1 backdrop-blur-md">
                              <PlayCircle className="size-3.5" aria-hidden />
                              {t.projects.videos(videoCount)}
                            </span>
                          ) : null}
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center bg-night/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                          <span className="inline-flex translate-y-2 items-center gap-2 rounded-full bg-lamp px-5 py-2.5 text-sm font-semibold text-night transition-transform duration-300 group-hover:translate-y-0">
                            <Images className="size-4" aria-hidden />
                            {t.projects.openGallery}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col p-6">
                        <h3 className={cn("type-heading text-paper", featured ? "text-3xl md:text-4xl" : "text-2xl")}>
                          {title}
                        </h3>
                        <p className={cn("mt-3 text-fog", featured ? "line-clamp-3 max-w-[60ch] text-lg" : "line-clamp-2")}>
                          {description}
                        </p>

                        {project.technologies.length ? (
                          <ul className="mt-5 flex flex-wrap gap-2" aria-label={t.gallery.technologies}>
                            {project.technologies.slice(0, 4).map((technology) => (
                              <li
                                key={technology}
                                className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-paper/85"
                              >
                                {technology}
                              </li>
                            ))}
                            {extraTechs > 0 ? (
                              <li className="px-1 py-0.5 text-xs text-fog">+{extraTechs}</li>
                            ) : null}
                          </ul>
                        ) : null}
                      </div>
                    </Link>
                </motion.li>
              );
            })}
          </ul>
        ) : (
          <p className="text-fog">{t.projects.empty}</p>
        )}
      </div>
    </section>
  );
}
