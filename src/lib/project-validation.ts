export interface ProjectRequestBody {
  title?: string;
  description?: string;
  projectUrl?: string;
  imageUrl?: string;
  technologies?: string;
  githubRepo?: string;
  source?: "manual" | "github";
  published?: boolean;
}

function toTechnologyList(rawValue: string | undefined) {
  return (rawValue ?? "")
    .split(",")
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
    technologies: toTechnologyList(body.technologies),
    githubRepo: body.githubRepo,
    source: body.source,
    published: body.published,
  };
}

export function validateProjectBody(body: ProjectRequestBody) {
  if (!body.title || !body.description || !body.projectUrl || !body.imageUrl) {
    return "Preencha título, descrição, link e foto.";
  }

  if (!isValidHttpUrl(body.projectUrl)) {
    return "Link do projeto deve ser uma URL válida (http/https).";
  }

  if (!isValidImageValue(body.imageUrl)) {
    return "A foto deve ser uma URL válida, caminho local (/imagem.png) ou data URL.";
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
