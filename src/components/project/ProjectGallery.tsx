"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";

import Reveal, { revealProps } from "@/components/motion/Reveal";
import { sectionContainer } from "@/components/SectionHeading";
import { Lightbox } from "@/components/ui/lightbox";
import { YoutubeEmbed } from "@/components/ui/youtube-embed";
import { useLocale } from "@/i18n/useLocale";
import { getYoutubeId } from "@/lib/youtube";
import type { PortfolioProject } from "@/types";

interface ProjectGalleryProps {
  project: PortfolioProject;
  nextProject: PortfolioProject | null;
}

function localized(project: PortfolioProject, locale: "pt" | "en") {
  return {
    title: locale === "en" ? project.titleEn ?? project.title : project.title,
    description: locale === "en" ? project.descriptionEn ?? project.description : project.description,
  };
}

export default function ProjectGallery({ project, nextProject }: ProjectGalleryProps) {
  const { locale, t } = useLocale();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { title, description } = localized(project, locale);
  const photos = [project.imageUrl, ...project.galleryImages].map((src, index) => ({
    src,
    alt: t.gallery.photoAlt(title, index + 1),
  }));
  // Links diferentes podem apontar para o mesmo vídeo (watch?v=, youtu.be, ?t=).
  const videoIds = [
    ...new Set(
      project.videoUrls
        .map((url) => getYoutubeId(url))
        .filter((id): id is string => Boolean(id)),
    ),
  ];
  const showCodeLink = project.githubRepo && project.githubRepo !== project.projectUrl;
  const next = nextProject ? localized(nextProject, locale) : null;

  return (
    <main className="pt-28 pb-24 md:pt-36 md:pb-36">
      <div className={sectionContainer}>
        <Link
          href="/#projetos"
          className="inline-flex items-center gap-2 rounded-full py-2 text-fog transition-colors hover:text-paper"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {t.gallery.back}
        </Link>

        <header className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h1 className="type-display text-5xl text-paper md:text-7xl lg:text-8xl">{title}</h1>
            <p className="mt-6 max-w-[60ch] text-lg text-fog md:text-xl">{description}</p>
          </div>

          <div className="space-y-6 lg:col-span-4">
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-lamp px-6 font-semibold text-night transition-transform duration-300 hover:-translate-y-0.5"
              >
                <ExternalLink className="size-4" aria-hidden />
                {t.gallery.openSite}
              </a>
              {showCodeLink ? (
                <a
                  href={project.githubRepo ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-6 font-medium text-paper transition-colors hover:border-white/40 hover:bg-white/5"
                >
                  <Github className="size-4" aria-hidden />
                  {t.gallery.viewCode}
                </a>
              ) : null}
            </div>

            {project.technologies.length ? (
              <div>
                <p className="mb-2 text-sm text-fog">{t.gallery.technologies}</p>
                <ul className="flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <li
                      key={technology}
                      className="rounded-full border border-white/10 px-3 py-1 text-sm text-paper/90"
                    >
                      {technology}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </header>

        <Reveal className="mt-14 md:mt-20">
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            aria-label={t.gallery.openPhoto(1)}
            className="group relative block aspect-[16/9] w-full overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-night-high"
          >
            <Image
              src={project.imageUrl}
              alt={photos[0].alt}
              fill
              priority
              sizes="(min-width: 1240px) 1176px, 100vw"
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
            />
          </button>
        </Reveal>

        {videoIds.length ? (
          <section aria-labelledby="videos-title" className="mt-20 md:mt-28">
            <Reveal>
              <h2 id="videos-title" className="type-heading mb-8 text-4xl text-paper md:text-5xl">
                {t.gallery.videosTitle}
              </h2>
            </Reveal>
            <div className="grid gap-4 md:grid-cols-2">
              {videoIds.map((id, index) => (
                <Reveal key={id} delay={(index % 2) * 0.06}>
                  <YoutubeEmbed
                    videoId={id}
                    title={t.gallery.videoTitle(title, index + 1)}
                    playLabel={t.gallery.playVideo(title)}
                  />
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}

        {photos.length > 1 ? (
          <section aria-labelledby="fotos-title" className="mt-20 md:mt-28">
            <Reveal>
              <h2 id="fotos-title" className="type-heading mb-8 text-4xl text-paper md:text-5xl">
                {t.gallery.photosTitle}
              </h2>
            </Reveal>
            <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
              {photos.slice(1).map((photo, index) => (
                <motion.li
                  key={photo.src}
                  {...revealProps((index % 3) * 0.06)}
                  className="mb-4 break-inside-avoid"
                >
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(index + 1)}
                    aria-label={t.gallery.openPhoto(index + 2)}
                    className="group block w-full overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-night-high"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={1200}
                      height={800}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </button>
                </motion.li>
              ))}
            </ul>
          </section>
        ) : null}

        {nextProject && next ? (
          <Reveal className="mt-24 border-t border-white/10 pt-10 md:mt-36">
            <Link href={`/projetos/${nextProject.id}`} className="group grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-fog">{t.gallery.nextProject}</p>
                <p className="type-display mt-2 text-5xl text-paper transition-colors duration-300 group-hover:text-lamp md:text-7xl">
                  {next.title}
                </p>
              </div>
              <div className="relative hidden aspect-[16/10] w-72 overflow-hidden rounded-[1.25rem] border border-white/[0.08] md:block">
                <Image
                  src={nextProject.imageUrl}
                  alt=""
                  fill
                  sizes="288px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
              </div>
            </Link>
          </Reveal>
        ) : null}
      </div>

      <Lightbox
        images={photos}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        labels={{
          close: t.gallery.close,
          previous: t.gallery.previous,
          next: t.gallery.next,
          counter: t.gallery.counter,
        }}
      />
    </main>
  );
}
