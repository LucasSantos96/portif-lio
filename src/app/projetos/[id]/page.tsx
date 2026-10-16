import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProjectGallery from "@/components/project/ProjectGallery";
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

  if (!project || !project.published) {
    return { title: "Projeto não encontrado" };
  }

  return {
    title: `${project.title} | Lucas Santos`,
    description: project.description,
    openGraph: { images: [project.imageUrl] },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const id = parseId((await params).id);

  if (!id) {
    notFound();
  }

  const projects = (await getPortfolioProjects()).filter((project) => project.published);
  const index = projects.findIndex((project) => project.id === id);

  if (index === -1) {
    notFound();
  }

  const nextProject = projects.length > 1 ? projects[(index + 1) % projects.length] : null;

  return <ProjectGallery project={projects[index]} nextProject={nextProject} />;
}
