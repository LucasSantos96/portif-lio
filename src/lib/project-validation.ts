import { getYoutubeId } from "@/lib/youtube";
import type { ProjectCategory } from "@/types";

export interface ProjectRequestBody {
  title?: string;
  description?: string;
  projectUrl?: string;
  imageUrl?: string;
  galleryImages?: string[];
  videoUrls?: string[];
  category?: ProjectCategory;
  technologies?: string;
  githubRepo?: string;
  source?: "manual" | "github";
  published?: boolean;
}

const MAX_GALLERY_IMAGES = 30;
const MAX_VIDEOS = 10;

function toTechnologyList(rawValue: string | undefined) {
  return (rawValue ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toStringList(rawValue: unknown) {
  if (!Array.isArray(rawValue)) {
    return [];
  }

  return rawValue
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidImageValue(value: string) {
  return (
    value.startsWith("/") ||
    value.startsWith("data:image/") ||
    isValidHttpUrl(value)
  );
}

export function parseProjectBody(body: ProjectRequestBody) {
  return {
    title: body.title ?? "",
    description: body.description ?? "",
    projectUrl: body.projectUrl ?? "",
    imageUrl: body.imageUrl ?? "",
    galleryImages: toStringList(body.galleryImages),
    videoUrls: toStringList(body.videoUrls),
    category: body.category === "tool" ? ("tool" as const) : ("project" as const),
    technologies: toTechnologyList(body.technologies),
    githubRepo: body.githubRepo,
    source: body.source,
    published: body.published,
  };
}

export function validateProjectBody(body: ProjectRequestBody) {
  if (body.category !== undefined && body.category !== "project" && body.category !== "tool") {
    return "Categoria inválida.";
  }

  // Ferramentas aparecem numa lista sem imagem, então a capa é opcional para elas.
  const requiresImage = body.category !== "tool";

  if (!body.title || !body.description || !body.projectUrl || (requiresImage && !body.imageUrl)) {
    return requiresImage
      ? "Preencha título, descrição, link e foto."
      : "Preencha título, descrição e link.";
  }

  if (!isValidHttpUrl(body.projectUrl)) {
    return "Link do projeto deve ser uma URL válida (http/https).";
  }

  if (body.imageUrl && !isValidImageValue(body.imageUrl)) {
    return "A foto deve ser uma URL válida, caminho local (/imagem.png) ou data URL.";
  }

  const galleryImages = toStringList(body.galleryImages);

  if (galleryImages.length > MAX_GALLERY_IMAGES) {
    return `A galeria aceita até ${MAX_GALLERY_IMAGES} fotos.`;
  }

  if (galleryImages.some((image) => !isValidImageValue(image))) {
    return "Uma das fotos da galeria tem um link inválido. Remova e envie de novo.";
  }

  const videoUrls = toStringList(body.videoUrls);

  if (videoUrls.length > MAX_VIDEOS) {
    return `Adicione até ${MAX_VIDEOS} vídeos por projeto.`;
  }

  const invalidVideo = videoUrls.find((video) => !getYoutubeId(video));

  if (invalidVideo) {
    return `"${invalidVideo}" não é um link do YouTube válido.`;
  }

  const technologies = toTechnologyList(body.technologies);

  if (!technologies.length) {
    return "Informe pelo menos uma tecnologia.";
  }

  if (body.githubRepo && !isValidHttpUrl(body.githubRepo)) {
    return "URL de repositório GitHub inválida.";
  }

  return null;
}
