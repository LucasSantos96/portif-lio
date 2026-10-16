"use client";

import Image from "next/image";
import Link from "next/link";
import { type ChangeEvent, type FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, ImageUp } from "lucide-react";

import ArticleBody from "@/components/blog/ArticleBody";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { BLOG_LIMITS, readingMinutes, slugify } from "@/lib/blog";
import { cn } from "@/lib/utils";
import type { Article } from "@/types";

type Lang = "pt" | "en";

interface LangFields {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  tags: string;
  coverAlt: string;
}

interface FormState {
  pt: LangFields;
  en: LangFields;
  coverUrl: string;
  published: boolean;
}

const emptyLang: LangFields = { slug: "", title: "", excerpt: "", body: "", tags: "", coverAlt: "" };
const emptyForm: FormState = { pt: emptyLang, en: emptyLang, coverUrl: "", published: false };

const langLabel: Record<Lang, string> = { pt: "Português", en: "English" };

function articleToForm(article: Article): FormState {
  return {
    pt: {
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      body: article.body,
      tags: article.tags.join(", "),
      coverAlt: article.coverAlt ?? "",
    },
    en: {
      slug: article.slugEn,
      title: article.titleEn,
      excerpt: article.excerptEn,
      body: article.bodyEn,
      tags: article.tagsEn.join(", "),
      coverAlt: article.coverAltEn ?? "",
    },
    coverUrl: article.coverUrl ?? "",
    published: article.published,
  };
}

function isLangComplete(fields: LangFields) {
  return Boolean(fields.slug && fields.title && fields.excerpt && fields.body);
}

function Counter({ value, max, label }: { value: number; max: number; label: string }) {
  const over = value > max;
  return (
    <span className={cn("text-xs", over ? "text-red-400" : "text-zinc-500")}>
      {value}/{max} {label}
    </span>
  );
}

const inputClass = "border-white/15 bg-night text-white";

export default function UploadArticleForm({ initialArticles }: { initialArticles: Article[] }) {
  const router = useRouter();
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);

  const [articles, setArticles] = useState(initialArticles);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [lang, setLang] = useState<Lang>("pt");
  const [preview, setPreview] = useState(false);
  // Enquanto o slug não é editado à mão, ele acompanha o título.
  const [slugTouched, setSlugTouched] = useState<Record<Lang, boolean>>({ pt: false, en: false });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const isEditing = editingId !== null;
  const current = form[lang];

  function updateLang(field: keyof LangFields, value: string, target: Lang = lang) {
    setForm((state) => ({ ...state, [target]: { ...state[target], [field]: value } }));
  }

  function handleTitleChange(value: string) {
    updateLang("title", value);
    if (!slugTouched[lang]) {
      updateLang("slug", slugify(value));
    }
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setSlugTouched({ pt: false, en: false });
    setLang("pt");
    setPreview(false);
  }

  async function uploadImage(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Selecione uma imagem válida.");
      return null;
    }

    const data = new FormData();
    data.append("file", file);

    try {
      const response = await fetch("/api/upload/image", { method: "POST", body: data });
      const result = (await response.json()) as { publicUrl?: string; message?: string };

      if (!response.ok || !result.publicUrl) {
        setError(result.message ?? `Não foi possível enviar ${file.name}.`);
        return null;
      }

      return result.publicUrl;
    } catch {
      setError(`Erro de conexão ao enviar ${file.name}.`);
      return null;
    }
  }

  async function handleCoverInput(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setError(null);
    setUploading(true);
    const url = await uploadImage(file);
    setUploading(false);

    if (url) {
      setForm((state) => ({ ...state, coverUrl: url }));
      setSuccess("Capa enviada. Descreva a imagem nos dois idiomas antes de salvar.");
    }
  }

  async function handleBodyImageInput(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setError(null);
    setUploading(true);
    const url = await uploadImage(file);
    setUploading(false);

    if (!url) {
      return;
    }

    const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
    const markdown = `\n\n![${alt}](${url})\n\n`;
    const area = bodyRef.current;
    const body = current.body;
    const position = area?.selectionStart ?? body.length;

    updateLang("body", body.slice(0, position) + markdown + body.slice(position));
    setSuccess("Imagem inserida no texto. Troque a descrição entre [ ] por um texto que explique a imagem.");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch(isEditing ? `/api/articles/${editingId}` : "/api/articles", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: form.pt.slug,
          slugEn: form.en.slug,
          title: form.pt.title,
          titleEn: form.en.title,
          excerpt: form.pt.excerpt,
          excerptEn: form.en.excerpt,
          body: form.pt.body,
          bodyEn: form.en.body,
          coverUrl: form.coverUrl,
          coverAlt: form.pt.coverAlt,
          coverAltEn: form.en.coverAlt,
          tags: form.pt.tags,
          tagsEn: form.en.tags,
          published: form.published,
        }),
      });

      const result = (await response.json()) as { message?: string; article?: Article };

      if (!response.ok || !result.article) {
        setError(result.message ?? "Não foi possível salvar o artigo.");
        return;
      }

      const saved = result.article;
      setArticles((list) => [saved, ...list.filter((item) => item.id !== saved.id)]);
      setSuccess(
        `${isEditing ? "Artigo atualizado" : "Artigo criado"}${saved.published ? " e publicado." : " como rascunho."}`,
      );
      resetForm();
      router.refresh();
    } catch {
      setError("Erro de conexão ao salvar o artigo.");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(article: Article) {
    setEditingId(article.id);
    setForm(articleToForm(article));
    setSlugTouched({ pt: true, en: true });
    setLang("pt");
    setPreview(false);
    setError(null);
    setSuccess(`Editando "${article.title}".`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(article: Article) {
    if (!window.confirm(`Excluir o artigo "${article.title}"? Os endereços dele deixam de existir.`)) {
      return;
    }

    setDeleteId(article.id);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/articles/${article.id}`, { method: "DELETE" });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(result.message ?? "Não foi possível excluir o artigo.");
        return;
      }

      setArticles((list) => list.filter((item) => item.id !== article.id));
      if (editingId === article.id) {
        resetForm();
      }
      setSuccess("Artigo excluído.");
      router.refresh();
    } catch {
      setError("Erro de conexão ao excluir o artigo.");
    } finally {
      setDeleteId(null);
    }
  }

  async function handleLogout() {
    setLogoutLoading(true);
    await fetch("/api/upload/auth", { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  const completeness: Record<Lang, boolean> = { pt: isLangComplete(form.pt), en: isLangComplete(form.en) };

  return (
    <div className="mx-auto mt-6 mb-20 w-full max-w-6xl px-4 text-white">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl">Artigos do blog</h1>
          <p className="text-sm text-zinc-400">
            Todo artigo tem as duas versões, cada uma com o próprio endereço. O resumo vira a descrição no Google.
          </p>
        </div>

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

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.8fr)]">
        <Card className="bg-night-raised text-white ring-white/10">
          <CardHeader>
            <CardTitle>{isEditing ? "Editar artigo" : "Novo artigo"}</CardTitle>
            <CardDescription className="text-zinc-400">
              Escreva em Markdown: ## título de seção, **negrito**, listas, tabelas e imagens.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="coverFile">Capa (opcional)</Label>
                <div className="flex flex-wrap items-center gap-3">
                  <input id="coverFile" type="file" accept="image/*" onChange={handleCoverInput} disabled={uploading} className="sr-only" />
                  <Label
                    htmlFor="coverFile"
                    className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-white/15 px-4 text-sm hover:bg-white/10"
                  >
                    <ImageUp className="size-4" aria-hidden />
                    {uploading ? "Enviando..." : form.coverUrl ? "Trocar capa" : "Enviar capa"}
                  </Label>
                  {form.coverUrl ? (
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-red-300 hover:text-red-200"
                      onClick={() => setForm((state) => ({ ...state, coverUrl: "" }))}
                    >
                      Remover capa
                    </Button>
                  ) : (
                    <span className="text-xs text-zinc-500">Sem capa, o artigo usa uma imagem gerada com o título.</span>
                  )}
                </div>
                {form.coverUrl ? (
                  <div className="overflow-hidden rounded-xl border border-white/10">
                    <Image src={form.coverUrl} alt="Prévia da capa" width={900} height={450} className="h-48 w-full object-cover" />
                  </div>
                ) : null}
              </div>

              <div role="tablist" aria-label="Idioma do artigo" className="flex gap-1 rounded-full border border-white/10 bg-night p-1">
                {(["pt", "en"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    role="tab"
                    aria-selected={lang === item}
                    onClick={() => setLang(item)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      lang === item ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white",
                    )}
                  >
                    {langLabel[item]}
                    <Badge variant="secondary" className={completeness[item] ? "bg-emerald-500/20 text-emerald-300" : "bg-zinc-800 text-zinc-400"}>
                      {completeness[item] ? "completo" : "pendente"}
                    </Badge>
                  </button>
                ))}
              </div>

              <div className="space-y-5" lang={lang}>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <Label htmlFor="title">Título ({langLabel[lang]})</Label>
                    <Counter value={current.title.length} max={BLOG_LIMITS.title} label="caracteres" />
                  </div>
                  <Input
                    id="title"
                    value={current.title}
                    onChange={(event) => handleTitleChange(event.target.value)}
                    placeholder={lang === "pt" ? "Como automatizar o atendimento da sua empresa com IA" : "How to automate your company's customer support with AI"}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Endereço ({langLabel[lang]})</Label>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <span className="shrink-0">{lang === "pt" ? "/blog/" : "/en/blog/"}</span>
                    <Input
                      id="slug"
                      value={current.slug}
                      onChange={(event) => {
                        setSlugTouched((state) => ({ ...state, [lang]: true }));
                        updateLang("slug", event.target.value.toLowerCase());
                      }}
                      className={inputClass}
                    />
                  </div>
                  <p className="text-xs text-zinc-500">
                    Letras minúsculas, números e hífens. Depois de publicado, evite mudar: o Google já indexou esse endereço.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <Label htmlFor="excerpt">Resumo ({langLabel[lang]})</Label>
                    <Counter value={current.excerpt.length} max={BLOG_LIMITS.excerpt} label="caracteres" />
                  </div>
                  <Textarea
                    id="excerpt"
                    value={current.excerpt}
                    onChange={(event) => updateLang("excerpt", event.target.value)}
                    placeholder="Uma ou duas frases dizendo o que a empresa leitora ganha com o artigo."
                    className={cn(inputClass, "min-h-20")}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Label htmlFor="body">Texto ({langLabel[lang]})</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500">
                        {readingMinutes(current.body)} min · {current.body.trim().split(/\s+/).filter(Boolean).length} palavras
                      </span>
                      <input id="bodyImage" type="file" accept="image/*" onChange={handleBodyImageInput} disabled={uploading} className="sr-only" />
                      <Label
                        htmlFor="bodyImage"
                        className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-white/15 px-3 text-xs hover:bg-white/10"
                      >
                        <ImageUp className="size-3.5" aria-hidden />
                        Inserir imagem
                      </Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setPreview((value) => !value)}
                        className="border-white/20 bg-transparent text-white hover:bg-white/10"
                      >
                        {preview ? "Editar" : "Prévia"}
                      </Button>
                    </div>
                  </div>

                  {preview ? (
                    <div className="max-h-[32rem] overflow-y-auto rounded-xl border border-white/10 bg-night p-5">
                      {current.body.trim() ? (
                        <ArticleBody markdown={current.body} />
                      ) : (
                        <p className="text-sm text-zinc-500">Nada para mostrar ainda.</p>
                      )}
                    </div>
                  ) : (
                    <Textarea
                      id="body"
                      ref={bodyRef}
                      value={current.body}
                      onChange={(event) => updateLang("body", event.target.value)}
                      className={cn(inputClass, "min-h-96 font-mono text-sm leading-relaxed")}
                      spellCheck
                    />
                  )}
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="tags">Assuntos ({langLabel[lang]})</Label>
                    <Input
                      id="tags"
                      value={current.tags}
                      onChange={(event) => updateLang("tags", event.target.value)}
                      placeholder={lang === "pt" ? "automação, agentes de IA, n8n" : "automation, AI agents, n8n"}
                      className={inputClass}
                    />
                  </div>

                  {form.coverUrl ? (
                    <div className="space-y-2">
                      <Label htmlFor="coverAlt">Descrição da capa ({langLabel[lang]})</Label>
                      <Input
                        id="coverAlt"
                        value={current.coverAlt}
                        onChange={(event) => updateLang("coverAlt", event.target.value)}
                        placeholder={lang === "pt" ? "O que a imagem mostra" : "What the image shows"}
                        className={inputClass}
                      />
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-night px-4 py-3">
                <div>
                  <Label htmlFor="published" className="text-white">Publicado</Label>
                  <p className="text-xs text-zinc-500">Desligado, o artigo fica como rascunho e não aparece no blog nem no Google.</p>
                </div>
                <Switch
                  id="published"
                  checked={form.published}
                  onCheckedChange={(checked) => setForm((state) => ({ ...state, published: checked }))}
                />
              </div>

              <div aria-live="polite">
                {error ? <p className="text-sm text-red-400">{error}</p> : null}
                {success ? <p className="text-sm text-emerald-400">{success}</p> : null}
              </div>

              <div className="flex flex-col gap-3 md:flex-row">
                <Button type="submit" disabled={loading || uploading} className="w-full md:w-auto">
                  {loading ? "Salvando..." : isEditing ? "Salvar alterações" : "Salvar artigo"}
                </Button>
                {isEditing ? (
                  <Button type="button" variant="outline" onClick={resetForm} className="border-white/20 bg-transparent text-white hover:bg-white/10">
                    Cancelar edição
                  </Button>
                ) : null}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="h-fit bg-night-raised text-white ring-white/10">
          <CardHeader>
            <CardTitle>Artigos cadastrados</CardTitle>
            <CardDescription className="text-zinc-400">Edite, exclua ou abra o artigo publicado.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {articles.length ? (
              articles.map((article) => (
                <div key={article.id} className="rounded-2xl border border-white/10 bg-night/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-medium text-white">{article.title}</h3>
                    <Badge className={article.published ? "bg-emerald-500/20 text-emerald-300" : "bg-zinc-800 text-zinc-300"}>
                      {article.published ? "Publicado" : "Rascunho"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">
                    /blog/{article.slug} · /en/blog/{article.slugEn}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{article.excerpt}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button type="button" onClick={() => handleEdit(article)}>
                      {editingId === article.id ? "Editando" : "Editar"}
                    </Button>
                    {article.published ? (
                      <Link
                        href={`/blog/${article.slug}`}
                        target="_blank"
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/20 px-3 text-sm hover:bg-white/10"
                      >
                        Abrir <ExternalLink className="size-3.5" aria-hidden />
                      </Link>
                    ) : null}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleDelete(article)}
                      disabled={deleteId === article.id}
                      className="border-red-500/30 bg-transparent text-red-300 hover:bg-red-500/10 hover:text-red-200"
                    >
                      {deleteId === article.id ? "Excluindo..." : "Excluir"}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-400">Nenhum artigo ainda.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
