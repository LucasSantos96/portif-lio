"use client";

import { ProjectCard } from "@/components/ui/project-card";
import { useLocale } from "@/i18n/useLocale";
import type { PortfolioProject } from "@/types";

interface ProjectsClientProps {
  projects: PortfolioProject[];
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const { locale, t } = useLocale();

  return (
    <section
      className="my-20 mx-4 mb-14 flex flex-col items-center text-white lg:mx-32 lg:py-28"
      id="projetos"
    >
      <div>
        <h2 className="mb-5 text-[20px] lg:text-center lg:text-[40px]">{t.projects.title}</h2>
      </div>

      {projects.length ? (
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              imgSrc={project.imageUrl}
              title={locale === "en" ? project.titleEn ?? project.title : project.title}
              description={
                locale === "en"
                  ? project.descriptionEn ?? project.description
                  : project.description
              }
              link={project.projectUrl}
              technologies={project.technologies}
              linkText={t.projects.viewProject}
              className="bg-[#ffffff0d] text-white ring-white/10"
            />
          ))}
        </div>
      ) : (
        <p className="text-zinc-300">{t.projects.empty}</p>
      )}
    </section>
  );
}
