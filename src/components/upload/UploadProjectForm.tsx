"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { type ChangeEvent, type DragEvent, type FormEvent, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GripVertical } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { PortfolioProject } from "@/types";

interface GithubImportResult {
  title: string;
  description: string;
  projectUrl: string;
  imageUrl: string;
  githubRepo: string;
  technologies: string[];
}

interface UploadProjectFormProps {
  initialProjects: PortfolioProject[];
}

interface FormState {
  title: string;
  description: string;
  projectUrl: string;
  imageUrl: string;
  technologies: string;
  githubRepo: string;
  published: boolean;
}

const emptyForm: FormState = {
  title: "",
  description: "",
  projectUrl: "",
  imageUrl: "",
  technologies: "",
  githubRepo: "",
  published: true,
};

function sortProjects(projects: PortfolioProject[]) {
  return [...projects].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }

    const dateDiff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return dateDiff || b.id - a.id;
  });
}

function projectToForm(project: PortfolioProject): FormState {
  return {
    title: project.title,
    description: project.description,
    projectUrl: project.projectUrl,
    imageUrl: project.imageUrl,
    technologies: project.technologies.join(", "),
    githubRepo: project.githubRepo ?? "",
    published: project.published,
  };
}

interface SortableProjectCardProps {
  project: PortfolioProject;
  index: number;
  editingProjectId: number | null;
  deleteId: number | null;
  reorderLoading: boolean;
  onEdit: (project: PortfolioProject) => void;
  onDelete: (project: PortfolioProject) => void;
}

function SortableProjectCard({
  project,
  index,
  editingProjectId,
  deleteId,
  reorderLoading,
  onEdit,
  onDelete,
}: SortableProjectCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-2xl border border-white/10 bg-zinc-950/70 p-4 ${
        isDragging ? "opacity-60 shadow-2xl" : ""
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <button
            type="button"
            aria-label={`Arrastar ${project.title}`}
            className="mt-0.5 cursor-grab rounded-lg border border-white/10 bg-white/5 p-2 text-zinc-300 active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>

          <div>
            <h3 className="font-medium text-white">{project.title}</h3>
            <p className="mt-1 text-xs text-zinc-500">
              {project.published ? "Publicado" : "Rascunho"} - {new Date(project.createdAt).toLocaleString("pt-BR")}
            </p>
          </div>
        </div>

        <Badge className="bg-zinc-800 text-zinc-200">ordem {index + 1}</Badge>
      </div>

      <p className="line-clamp-3 text-sm text-zinc-400">{project.description}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {project.technologies.slice(0, 5).map((technology) => (
          <Badge key={`${project.id}-${technology}`} variant="secondary" className="bg-zinc-800 text-zinc-200">
            {technology}
          </Badge>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" onClick={() => onEdit(project)}>
          {editingProjectId === project.id ? "Editando" : "Editar"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onDelete(project)}
          disabled={deleteId === project.id || reorderLoading}
          className="border-red-500/30 bg-transparent text-red-300 hover:bg-red-500/10 hover:text-red-200"
        >
          {deleteId === project.id ? "Excluindo..." : "Excluir"}
        </Button>
      </div>
    </div>
  );
}

export default function UploadProjectForm({ initialProjects }: UploadProjectFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  const [projects, setProjects] = useState(() => sortProjects(initialProjects));
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [reorderLoading, setReorderLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const techPreview = form.technologies
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const availableTechnologies = useMemo(
    () =>
      [...new Set(projects.flatMap((project) => project.technologies))].sort((a, b) =>
        a.localeCompare(b, "pt-BR"),
      ),
    [projects],
  );

  const isEditing = editingProjectId !== null;

  function updateField(field: keyof FormState, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value } as FormState));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingProjectId(null);
  }

  function updateProjects(nextProjects: PortfolioProject[]) {
    setProjects(sortProjects(nextProjects));
  }

  function addTechnology(technology: string) {
    const normalized = technology.trim();

    if (!normalized) {
      return;
    }

    const current = form.technologies
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (current.some((item) => item.toLowerCase() === normalized.toLowerCase())) {
      return;
    }

    updateField("technologies", [...current, normalized].join(", "));
  }

  async function handleLogout() {
    setLogoutLoading(true);
    await fetch("/api/upload/auth", { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  async function handleGithubImport() {
    if (!form.githubRepo.trim()) {
      setError("Informe a URL do repositório para importar.");
      return;
    }

    setError(null);
    setSuccess(null);
    setImportLoading(true);

    try {
      const response = await fetch("/api/github-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: form.githubRepo }),
      });

      const result = (await response.json()) as GithubImportResult | { message?: string };

      if (!response.ok) {
        setError((result as { message?: string }).message ?? "Falha ao importar.");
        return;
      }

      const data = result as GithubImportResult;

      setForm((current) => ({
        ...current,
        title: data.title,
        description: data.description,
        projectUrl: data.projectUrl,
        imageUrl: data.imageUrl,
        githubRepo: data.githubRepo,
        technologies: data.technologies.join(", "),
      }));

      setSuccess("Dados importados do GitHub. Revise e salve.");
    } catch {
      setError("Erro de conexão ao importar do GitHub.");
    } finally {
      setImportLoading(false);
    }
  }

  async function uploadImageFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Selecione uma imagem válida.");
      return;
    }

    setError(null);
    setSuccess(null);
    setImageUploading(true);
    setUploadProgress(15);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(80);

      const result = (await response.json()) as { publicUrl?: string; message?: string };

      if (!response.ok || !result.publicUrl) {
        setError(result.message ?? "Não foi possível fazer upload da imagem.");
        return;
      }

      updateField("imageUrl", result.publicUrl);
      setUploadProgress(100);
      setSuccess("Imagem enviada para o Supabase Storage.");
    } catch {
      setError("Erro de conexão ao enviar a imagem.");
    } finally {
      setTimeout(() => setUploadProgress(0), 500);
      setImageUploading(false);
    }
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    await uploadImageFile(file);
    event.target.value = "";
  }

  async function handleImageDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDraggingFile(false);

    const file = event.dataTransfer.files?.[0];

    if (!file) {
      return;
    }

    await uploadImageFile(file);
  }

  function handleDragOver(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDraggingFile(true);
  }

  function handleDragLeave(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDraggingFile(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const method = isEditing ? "PUT" : "POST";
      const endpoint = isEditing ? `/api/projects/${editingProjectId}` : "/api/projects";
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          projectUrl: form.projectUrl,
          imageUrl: form.imageUrl,
          technologies: form.technologies,
          githubRepo: form.githubRepo,
          source: form.githubRepo ? "github" : "manual",
          published: form.published,
        }),
      });

      const result = (await response.json()) as { message?: string; project?: PortfolioProject };

      if (!response.ok || !result.project) {
        setError(result.message ?? "Não foi possível salvar o projeto.");
        return;
      }

      updateProjects((() => {
        const current = projects;
        const filtered = current.filter((project) => project.id !== result.project?.id);
        return sortProjects([result.project as PortfolioProject, ...filtered]);
      })());

      setSuccess(isEditing ? "Projeto atualizado com sucesso." : "Projeto criado com sucesso.");
      resetForm();
      router.refresh();
    } catch {
      setError("Erro de conexão ao salvar projeto.");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(project: PortfolioProject) {
    setEditingProjectId(project.id);
    setForm(projectToForm(project));
    setError(null);
    setSuccess(`Editando "${project.title}".`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(project: PortfolioProject) {
    const confirmed = window.confirm(`Excluir o projeto "${project.title}"?`);

    if (!confirmed) {
      return;
    }

    setDeleteId(project.id);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(result.message ?? "Não foi possível excluir o projeto.");
        return;
      }

      updateProjects(projects.filter((item) => item.id !== project.id));

      if (editingProjectId === project.id) {
        resetForm();
      }

      setSuccess("Projeto excluído com sucesso.");
      router.refresh();
    } catch {
      setError("Erro de conexão ao excluir projeto.");
    } finally {
      setDeleteId(null);
    }
  }

  async function persistReorderedProjects(reordered: PortfolioProject[], feedback: string) {
    setReorderLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/projects/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: reordered.map((project) => project.id) }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(result.message ?? "Não foi possível salvar a nova ordem.");
        updateProjects(initialProjects);
        return;
      }

      setSuccess(feedback);
      router.refresh();
    } catch {
      setError("Erro de conexão ao salvar a nova ordem.");
      updateProjects(initialProjects);
    } finally {
      setReorderLoading(false);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = projects.findIndex((project) => project.id === Number(active.id));
    const newIndex = projects.findIndex((project) => project.id === Number(over.id));

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const moved = arrayMove(projects, oldIndex, newIndex).map((project, index) => ({
      ...project,
      sortOrder: index,
    }));

    updateProjects(moved);
    await persistReorderedProjects(moved, "Ordem salva.");
  }

  return (
    <div className="mx-auto mt-10 mb-20 w-full max-w-6xl px-4 text-white">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl">Gerenciar projetos</h1>
          <p className="text-sm text-zinc-400">
            Upload real no bucket `portifolio`, rascunho/publicado e ordem manual.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleLogout}
            disabled={logoutLoading}
            className="border-white/20 bg-transparent text-white hover:bg-white/10"
          >
            {logoutLoading ? "Saindo..." : "Sair"}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]">
        <Card className="bg-[#181B20] text-white ring-white/10">
          <CardHeader>
            <CardTitle>{isEditing ? "Editar projeto" : "Novo item do portfólio"}</CardTitle>
            <CardDescription className="text-zinc-400">
              Importe do GitHub, envie a capa para o Storage e arraste os cards para definir a ordem salva na home.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="mb-6 grid gap-3 md:grid-cols-[1fr_auto]">
              <Input
                value={form.githubRepo}
                onChange={(event) => updateField("githubRepo", event.target.value)}
                placeholder="https://github.com/owner/repo"
                className="border-white/15 bg-zinc-950 text-white"
              />
              <Button type="button" onClick={handleGithubImport} disabled={importLoading}>
                {importLoading ? "Importando..." : "Importar do GitHub"}
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    placeholder="Ex.: API Barber"
                    className="border-white/15 bg-zinc-950 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectUrl">Link do projeto</Label>
                  <Input
                    id="projectUrl"
                    value={form.projectUrl}
                    onChange={(event) => updateField("projectUrl", event.target.value)}
                    placeholder="https://..."
                    className="border-white/15 bg-zinc-950 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="imageFile">Capa do projeto</Label>
                  <Input
                    id="imageFile"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={imageUploading}
                    className="hidden"
                  />
                  <label
                    htmlFor="imageFile"
                    onDrop={handleImageDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-8 text-center transition ${
                      isDraggingFile
                        ? "border-primary bg-primary/10"
                        : "border-white/15 bg-zinc-950 hover:border-white/30 hover:bg-white/5"
                    }`}
                  >
                    <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white">
                      {imageUploading ? "Enviando capa..." : "Fazer upload da imagem"}
                    </div>
                    <p className="text-sm text-zinc-300">
                      Arraste e solte a imagem aqui ou clique para enviar ao bucket `portifolio`.
                    </p>
                    <p className="text-xs text-zinc-500">
                      Aceita PNG, JPG, WEBP e outras imagens.
                    </p>
                  </label>

                  {uploadProgress > 0 ? (
                    <div className="space-y-2">
                      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-zinc-500">Upload {uploadProgress}%</p>
                    </div>
                  ) : null}

                  <p className="text-xs text-zinc-500">
                    {form.imageUrl
                      ? "Imagem pronta para salvar no projeto."
                      : "O link da imagem sera preenchido automaticamente apos o upload."}
                  </p>
                </div>

                {form.imageUrl ? (
                  <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-950">
                    <Image
                      src={form.imageUrl}
                      alt="Prévia da capa"
                      width={800}
                      height={450}
                      className="h-56 w-full object-cover"
                    />
                  </div>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  placeholder="Descreva o projeto e o impacto"
                  className="min-h-32 border-white/15 bg-zinc-950 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tech">Tecnologias (separadas por vírgula)</Label>
                <Input
                  id="tech"
                  value={form.technologies}
                  onChange={(event) => updateField("technologies", event.target.value)}
                  placeholder="Next.js, TypeScript, Tailwind"
                  className="border-white/15 bg-zinc-950 text-white"
                  required
                />

                {availableTechnologies.length ? (
                  <div className="flex flex-wrap gap-2">
                    {availableTechnologies.map((technology) => {
                      const isSelected = techPreview.some(
                        (item) => item.toLowerCase() === technology.toLowerCase(),
                      );

                      return (
                        <button
                          key={technology}
                          type="button"
                          onClick={() => addTechnology(technology)}
                          className={`rounded-full border px-3 py-1 text-xs transition ${
                            isSelected
                              ? "border-primary bg-primary/15 text-white"
                              : "border-white/10 bg-zinc-900 text-zinc-300 hover:border-white/25 hover:bg-white/5"
                          }`}
                        >
                          {technology}
                        </button>
                      );
                    })}
                  </div>
                ) : null}

                {techPreview.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {techPreview.map((tech) => (
                      <Badge key={tech} variant="secondary" className="bg-zinc-800 text-zinc-200">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-950 px-4 py-3">
                <div>
                  <Label htmlFor="published" className="text-white">Publicado</Label>
                  <p className="text-xs text-zinc-500">
                    Quando desligado, o projeto fica salvo como rascunho e some da home.
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={form.published}
                  onCheckedChange={(checked) => updateField("published", checked)}
                />
              </div>

              {error ? <p className="text-sm text-red-400">{error}</p> : null}
              {success ? <p className="text-sm text-emerald-400">{success}</p> : null}

              <div className="flex flex-col gap-3 md:flex-row">
                <Button type="submit" disabled={loading || imageUploading || !form.imageUrl} className="w-full md:w-auto">
                  {loading
                    ? isEditing
                      ? "Atualizando..."
                      : "Salvando..."
                    : isEditing
                      ? "Salvar alterações"
                      : "Salvar projeto"}
                </Button>

                {isEditing ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="border-white/20 bg-transparent text-white hover:bg-white/10"
                  >
                    Cancelar edição
                  </Button>
                ) : null}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-[#181B20] text-white ring-white/10">
          <CardHeader>
            <CardTitle>Projetos cadastrados</CardTitle>
            <CardDescription className="text-zinc-400">
              Edite, exclua, publique/despublique e ajuste a ordem manualmente.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {projects.length ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={projects.map((project) => project.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-4">
                    {projects.map((project, index) => (
                      <SortableProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                        editingProjectId={editingProjectId}
                        deleteId={deleteId}
                        reorderLoading={reorderLoading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <p className="text-sm text-zinc-400">Nenhum projeto cadastrado ainda.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
