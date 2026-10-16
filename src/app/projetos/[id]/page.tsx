import type { Metadata } from "next";
import { notFound } from "next/navigation";

import JsonLd from "@/components/JsonLd";
import ProjectGallery from "@/components/project/ProjectGallery";
import { projectJsonLd } from "@/lib/structured-data";
import { getPortfolioProjectById, getPortfolioProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

function parseId(rawId: string) {
  const id = Number(rawId);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const id = parseId((await params).id);
  const project = id ? await getPortfolioProjectById(id) : null;

  if (!project || !project.published || project.category !== "project") {
    return { title: "Projeto não encontrado" };
  }

  const path = `/projetos/${project.id}`;
  const description = project.description.replace(/\s+/g, " ").trim();

  return {
    title: project.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: project.title,
      description,
      images: [{ url: project.imageUrl, alt: project.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
      images: [project.imageUrl],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const id = parseId((await params).id);

  if (!id) {
    notFound();
  }

  // Ferramentas não têm galeria: ficam fora desta página e da navegação "Próximo projeto".
  const projects = (await getPortfolioProjects()).filter(
    (project) => project.published && project.category === "project",
  );
  const index = projects.findIndex((project) => project.id === id);

  if (index === -1) {
    notFound();
  }

  const nextProject = projects.length > 1 ? projects[(index + 1) % projects.length] : null;

  const project = projects[index];

  return (
    <>
      <JsonLd data={projectJsonLd(project)} />
      <ProjectGallery project={project} nextProject={nextProject} />
    </>
  );
}
