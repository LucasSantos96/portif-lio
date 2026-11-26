"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Check,
  ExternalLink,
  Play,
  Sparkles,
  X,
} from "lucide-react";

import {
  ALL_ROADMAP_NODES,
  ROADMAP_TIERS,
  type RoadmapNode,
} from "@/data/roadmap-ai-2027";
import { useLocale } from "@/i18n/useLocale";
import {
  getYoutubeEmbedUrl,
  getYoutubeId,
  getYoutubeThumbnail,
} from "@/lib/youtube";
import { cn } from "@/lib/utils";
import type { ArticleLocale } from "@/types";

const STORAGE_TOKEN_KEY = "roadmap_ai_2027_token";

interface SessionState {
  token: string;
  name: string;
  email: string;
}

interface PendingAction {
  type: "open" | "complete";
  nodeId: string;
}

interface EdgePath {
  id: string;
  d: string;
  state: "default" | "active" | "lit";
}

const UI_COPY: Record<
  ArticleLocale,
  {
    eyebrow: string;
    titlePrefix: string;
    titleHighlight: string;
    subtitle: string;
    visitor: string;
    startBtn: string;
    savedBtn: string;
    legendNext: string;
    legendDone: string;
    legendPractice: string;
    markDone: string;
    markedDone: string;
    saving: string;
    baseTextLabel: string;
    practiceLabel: string;
    videoLabel: string;
    watchVideo: string;
    refsLabel: string;
    modalTitle: string;
    modalSub: string;
    modalNoticePrefix: string;
    modalNoticeBody: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    submitBtn: string;
    submittingBtn: string;
    skipBtn: string;
    closeAria: string;
    toastSaved: (name: string) => string;
    toastDone: (title: string) => string;
    toastUndone: string;
    toastLogged: (name: string, email: string) => string;
  }
> = {
  pt: {
    eyebrow: "/roadmap · Open Source First",
    titlePrefix: "Meu Roadmap: ",
    titleHighlight: "Engenheiro de IA 2027",
    subtitle:
      "Clique em qualquer ponto da árvore para abrir o texto base, o vídeo, as referências gratuitas e as ideias práticas.",
    visitor: "Visitante",
    startBtn: "Iniciar jornada",
    savedBtn: "Progresso salvo ✓",
    legendNext: "Próximo sugerido",
    legendDone: "Concluído",
    legendPractice: "Tem ideia prática",
    markDone: "Marcar concluído",
    markedDone: "✓ Concluído",
    saving: "Salvando...",
    baseTextLabel: "Texto base",
    practiceLabel: "Ideia prática · Mão na massa",
    videoLabel: "Vídeo recomendado (YouTube)",
    watchVideo: "Clique para carregar o vídeo",
    refsLabel: "Referências gratuitas",
    modalTitle: "Comece seu Roadmap 2027",
    modalSub:
      "Salve seu progresso no banco de dados para continuar de onde parou a qualquer momento.",
    modalNoticePrefix: "Aviso:",
    modalNoticeBody:
      "ao informar seu e-mail, você também será avisado(a) quando houver novidades e atualizações futuras neste roadmap.",
    nameLabel: "Seu nome",
    namePlaceholder: "Ex.: Lucas Santos",
    emailLabel: "Seu e-mail",
    emailPlaceholder: "voce@exemplo.com",
    submitBtn: "Salvar e começar →",
    submittingBtn: "Salvando...",
    skipBtn: "Só explorar por enquanto",
    closeAria: "Fechar",
    toastSaved: (name) => `Bem-vindo(a), ${name}! Seu progresso está salvo.`,
    toastDone: (title) => `✓ "${title}" concluído!`,
    toastUndone: "Tópico desmarcado.",
    toastLogged: (name, email) => `Conectado como ${name} (${email})`,
  },
  en: {
    eyebrow: "/roadmap · Open Source First",
    titlePrefix: "My Roadmap: ",
    titleHighlight: "AI Engineer 2027",
    subtitle:
      "Click any node in the tree to expand the core guide, YouTube video, free open-source resources, and hands-on ideas.",
    visitor: "Guest",
    startBtn: "Start journey",
    savedBtn: "Progress saved ✓",
    legendNext: "Suggested next",
    legendDone: "Completed",
    legendPractice: "Includes hands-on idea",
    markDone: "Mark completed",
    markedDone: "✓ Completed",
    saving: "Saving...",
    baseTextLabel: "Core guide",
    practiceLabel: "Hands-on idea",
    videoLabel: "Recommended video (YouTube)",
    watchVideo: "Click to load video",
    refsLabel: "Free & open-source resources",
    modalTitle: "Start your 2027 Roadmap",
    modalSub:
      "Save your progress in our database so you can pick up right where you left off anytime.",
    modalNoticePrefix: "Heads up:",
    modalNoticeBody:
      "by sharing your email, you'll also be notified when new modules or updates are added to this roadmap.",
    nameLabel: "Your name",
    namePlaceholder: "e.g. Alex Rivera",
    emailLabel: "Your email",
    emailPlaceholder: "you@example.com",
    submitBtn: "Save & start →",
    submittingBtn: "Saving...",
    skipBtn: "Just explore for now",
    closeAria: "Close",
    toastSaved: (name) => `Welcome, ${name}! Your progress is now synced.`,
    toastDone: (title) => `✓ "${title}" completed!`,
    toastUndone: "Topic unmarked.",
    toastLogged: (name, email) => `Signed in as ${name} (${email})`,
  },
};

export default function RoadmapClient({ locale }: { locale: ArticleLocale }) {
  const { setAlternatePath } = useLocale();
  const copy = UI_COPY[locale];

  const [session, setSession] = useState<SessionState | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [playingVideoNodeId, setPlayingVideoNodeId] = useState<string | null>(null);
  const [skippedOnce, setSkippedOnce] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submittingSession, setSubmittingSession] = useState(false);
  const [savingNodeId, setSavingNodeId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const graphStageRef = useRef<HTMLDivElement | null>(null);
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });
  const [edges, setEdges] = useState<EdgePath[]>([]);

  useEffect(() => {
    setAlternatePath(locale === "en" ? "/roadmap" : "/en/roadmap");
    return () => setAlternatePath(null);
  }, [locale, setAlternatePath]);

  const showToast = useCallback((message: string) => {
    setToast(message);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // Restore saved session from localStorage token on mount
  useEffect(() => {
    let active = true;
    try {
      const savedToken = localStorage.getItem(STORAGE_TOKEN_KEY);
      if (!savedToken) return;

      fetch(`/api/roadmap/session?token=${encodeURIComponent(savedToken)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!active || !data?.session) return;
          setSession({
            token: data.session.token,
            name: data.session.name,
            email: data.session.email,
          });
          setCompletedIds(data.session.completedNodeIds ?? []);
        })
        .catch(() => {});
    } catch {
      // localStorage unavailable
    }
    return () => {
      active = false;
    };
  }, []);

  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);
  const recommendedId = useMemo(
    () => ALL_ROADMAP_NODES.find((node) => !completedSet.has(node.id))?.id ?? null,
    [completedSet],
  );

  const computeEdges = useCallback(() => {
    const stage = graphStageRef.current;
    if (!stage) return;

    const stageRect = stage.getBoundingClientRect();
    const nextEdges: EdgePath[] = [];

    for (const node of ALL_ROADMAP_NODES) {
      if (!node.parents.length) continue;
      const childOrb = stage.querySelector<HTMLElement>(`[data-node-id="${node.id}"] .roadmap-orb`);
      if (!childOrb) continue;

      const cRect = childOrb.getBoundingClientRect();
      const cx = cRect.left - stageRect.left + cRect.width / 2;
      const cy = cRect.top - stageRect.top;

      for (const parentId of node.parents) {
        const parentBtn = stage.querySelector<HTMLElement>(`[data-node-id="${parentId}"]`);
        const parentOrb = parentBtn?.querySelector<HTMLElement>(".roadmap-orb");
        if (!parentBtn || !parentOrb) continue;

        const pOrbRect = parentOrb.getBoundingClientRect();
        const pBtnRect = parentBtn.getBoundingClientRect();
        const px = pOrbRect.left - stageRect.left + pOrbRect.width / 2;
        const py = pBtnRect.bottom - stageRect.top + 2;
        const midY = py + (cy - py) * 0.5;

        const bothDone = completedSet.has(parentId) && completedSet.has(node.id);
        const isActive = selectedId === node.id || selectedId === parentId;

        nextEdges.push({
          id: `${parentId}-${node.id}`,
          d: `M ${px} ${py} C ${px} ${midY}, ${cx} ${midY}, ${cx} ${cy - 4}`,
          state: bothDone ? "lit" : isActive ? "active" : "default",
        });
      }
    }

    if (selectedId) {
      const selBtn = stage.querySelector<HTMLElement>(`[data-node-id="${selectedId}"]`);
      const selOrb = selBtn?.querySelector<HTMLElement>(".roadmap-orb");
      const panelSlot = stage.querySelector<HTMLElement>(`[data-panel-for="${selectedId}"]`);
      if (selBtn && selOrb && panelSlot) {
        const oRect = selOrb.getBoundingClientRect();
        const bRect = selBtn.getBoundingClientRect();
        const sRect = panelSlot.getBoundingClientRect();
        const ox = oRect.left - stageRect.left + oRect.width / 2;
        const oy = bRect.bottom - stageRect.top + 2;
        const py = sRect.top - stageRect.top;

        nextEdges.push({
          id: `stem-${selectedId}`,
          d: `M ${ox} ${oy} L ${ox} ${py}`,
          state: "active",
        });
      }
    }

    setSvgSize({ width: stageRect.width, height: stageRect.height });
    setEdges(nextEdges);
  }, [completedSet, selectedId]);

  useEffect(() => {
    const raf = requestAnimationFrame(computeEdges);
    const onResize = () => requestAnimationFrame(computeEdges);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [computeEdges, locale]);

  const toggleNodeProgress = useCallback(
    async (node: RoadmapNode, activeSession: SessionState) => {
      const currentlyDone = completedSet.has(node.id);
      const nextCompleted = !currentlyDone;
      setSavingNodeId(node.id);

      try {
        const res = await fetch("/api/roadmap/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: activeSession.token,
            nodeId: node.id,
            completed: nextCompleted,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to save");
        }

        const data = (await res.json()) as { completedNodeIds: string[] };
        setCompletedIds(data.completedNodeIds);
        const localized = node[locale];
        showToast(nextCompleted ? copy.toastDone(localized.name) : copy.toastUndone);
      } catch {
        showToast(locale === "en" ? "Error saving progress." : "Erro ao salvar progresso.");
      } finally {
        setSavingNodeId(null);
      }
    },
    [completedSet, copy, locale, showToast],
  );

  const handleNodeClick = (nodeId: string) => {
    if (!session && !skippedOnce && nodeId === "n0") {
      setPendingAction({ type: "open", nodeId });
      setModalOpen(true);
      return;
    }
    setPlayingVideoNodeId(null);
    setSelectedId((prev) => (prev === nodeId ? null : nodeId));
  };

  const handleToggleCompleteClick = (node: RoadmapNode) => {
    if (!session) {
      setPendingAction({ type: "complete", nodeId: node.id });
      setModalOpen(true);
      return;
    }
    void toggleNodeProgress(node, session);
  };

  const handleSessionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmittingSession(true);

    try {
      const res = await fetch("/api/roadmap/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameInput.trim(),
          email: emailInput.trim(),
          locale,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.session) {
        setFormError(data.message ?? "Erro ao salvar.");
        return;
      }

      const nextSession: SessionState = {
        token: data.session.token,
        name: data.session.name,
        email: data.session.email,
      };
      setSession(nextSession);
      setCompletedIds(data.session.completedNodeIds ?? []);

      try {
        localStorage.setItem(STORAGE_TOKEN_KEY, nextSession.token);
      } catch {
        // ignore storage errors
      }

      setModalOpen(false);
      showToast(copy.toastSaved(nextSession.name));

      const action = pendingAction;
      setPendingAction(null);

      if (action) {
        setSelectedId(action.nodeId);
        if (action.type === "complete") {
          const targetNode = ALL_ROADMAP_NODES.find((n) => n.id === action.nodeId);
          if (targetNode) {
            // Persist completion directly with the newly created session
            const progressRes = await fetch("/api/roadmap/progress", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                token: nextSession.token,
                nodeId: targetNode.id,
                completed: true,
              }),
            });
            if (progressRes.ok) {
              const pData = (await progressRes.json()) as { completedNodeIds: string[] };
              setCompletedIds(pData.completedNodeIds);
            }
          }
        }
      }
    } catch {
      setFormError(locale === "en" ? "Connection error. Try again." : "Erro de conexão. Tente novamente.");
    } finally {
      setSubmittingSession(false);
    }
  };

  const totalCount = ALL_ROADMAP_NODES.length;
  const doneCount = completedIds.length;
  const progressPct = Math.round((doneCount / totalCount) * 100);

  return (
    <main className="relative min-h-screen overflow-hidden pt-28 pb-24">
      {/* Subtle ambient light matching the portfolio */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(540px circle at 15% 4%, color-mix(in oklab, var(--monitor) 10%, transparent), transparent 60%), radial-gradient(480px circle at 85% 6%, color-mix(in oklab, var(--lamp) 10%, transparent), transparent 58%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[920px] px-4 md:px-8">
        {/* Centered Header */}
        <header className="mx-auto mb-8 max-w-[780px] text-center">
          <p className="mb-3 font-mono text-xs tracking-widest text-monitor uppercase">
            {copy.eyebrow}
          </p>
          <h1 className="type-display mb-4 text-4xl text-paper sm:text-5xl md:text-6xl">
            {copy.titlePrefix}
            <span className="text-lamp">{copy.titleHighlight}</span>
          </h1>
          <p className="mx-auto max-w-[560px] text-sm text-fog sm:text-base">
            {copy.subtitle}
          </p>
        </header>

        {/* Single Clean Progress Strip */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-night-raised px-4 py-3">
          <div className="flex min-w-[220px] flex-1 items-center gap-3">
            <span className="truncate text-sm font-semibold text-paper">
              {session ? session.name : copy.visitor}
            </span>
            <div className="flex flex-1 items-center gap-2.5">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-night-high">
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{
                    width: `${progressPct}%`,
                    background: "linear-gradient(90deg, var(--monitor), var(--lamp))",
                  }}
                />
              </div>
              <span className="font-mono text-xs text-fog">
                {doneCount} / {totalCount}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (session) {
                showToast(copy.toastLogged(session.name, session.email));
                return;
              }
              setModalOpen(true);
            }}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-bold transition-transform hover:-translate-y-0.5",
              session
                ? "border border-emerald-500/35 bg-emerald-500/10 text-emerald-400"
                : "bg-lamp text-night",
            )}
          >
            {session ? copy.savedBtn : copy.startBtn}
          </button>
        </div>

        {/* Subtle Legend */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-5 font-mono text-xs text-fog">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full border-2 border-lamp shadow-[0_0_8px_var(--lamp)]" />
            {copy.legendNext}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            {copy.legendDone}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-lamp" />
            {copy.legendPractice}
          </span>
        </div>

        {/* Interactive Circle-Node Graph */}
        <section
          ref={graphStageRef}
          aria-label={copy.titleHighlight}
          className="relative py-2"
        >
          {svgSize.width > 0 && (
            <svg
              aria-hidden="true"
              viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            >
              {edges.map((edge) => (
                <path
                  key={edge.id}
                  d={edge.d}
                  fill="none"
                  strokeLinecap="round"
                  className="transition-colors duration-300"
                  stroke={
                    edge.state === "lit"
                      ? "#34d399"
                      : edge.state === "active"
                        ? "var(--monitor)"
                        : "var(--line)"
                  }
                  strokeWidth={edge.state === "default" ? 1.8 : 2.3}
                />
              ))}
            </svg>
          )}

          <div className="relative z-10 flex flex-col gap-10">
            {ROADMAP_TIERS.map((tier) => {
              const selectedNodeInTier = tier.nodes.find((n) => n.id === selectedId) ?? null;

              return (
                <div key={tier.id} className="flex flex-col items-center gap-4">
                  <span className="rounded-full border border-line bg-night px-3 py-0.5 font-mono text-[11px] font-semibold tracking-wider text-fog uppercase">
                    {tier.label[locale]}
                  </span>

                  <div className="flex w-full flex-wrap items-start justify-center gap-6 sm:gap-8">
                    {tier.nodes.map((node) => {
                      const content = node[locale];
                      const isDone = completedSet.has(node.id);
                      const isSelected = selectedId === node.id;
                      const isRecommended = recommendedId === node.id && !isDone;

                      return (
                        <button
                          key={node.id}
                          type="button"
                          data-node-id={node.id}
                          onClick={() => handleNodeClick(node.id)}
                          className="group flex w-[164px] flex-col items-center gap-2.5 p-1 text-center transition-transform hover:-translate-y-0.5"
                        >
                          <div
                            className={cn(
                              "roadmap-orb relative grid place-items-center rounded-full border-2 font-mono text-xs font-semibold transition-all duration-200",
                              node.capstone ? "h-15 w-15 text-base" : "h-13 w-13",
                              isDone
                                ? "border-emerald-400 bg-emerald-400 text-night shadow-[0_0_18px_rgba(52,211,153,0.35)]"
                                : isSelected
                                  ? "scale-105 border-monitor bg-night-high text-paper shadow-[0_0_0_6px_color-mix(in_oklab,var(--monitor)_16%,transparent)]"
                                  : isRecommended
                                    ? "border-lamp bg-night-raised text-lamp shadow-[0_0_0_6px_color-mix(in_oklab,var(--lamp)_15%,transparent)]"
                                    : "border-line bg-night-raised text-fog group-hover:border-monitor group-hover:text-monitor",
                            )}
                          >
                            {isDone ? <Check className="h-5 w-5 stroke-[2.8]" /> : node.code}
                            {content.practice && (
                              <span
                                title={copy.legendPractice}
                                className="absolute top-0 right-0 h-3 w-3 rounded-full border-2 border-night bg-lamp"
                              />
                            )}
                          </div>

                          <span
                            className={cn(
                              "text-sm leading-snug font-semibold transition-colors",
                              isSelected
                                ? "text-monitor"
                                : isDone
                                  ? "text-fog"
                                  : "text-paper",
                            )}
                          >
                            {content.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Inline Study Card right inside the graph */}
                  {selectedNodeInTier && (
                    <div
                      data-panel-for={selectedNodeInTier.id}
                      className="mt-1 w-full max-w-[780px] rounded-2xl border border-monitor/40 bg-night-raised p-5 shadow-2xl sm:p-6"
                    >
                      {(() => {
                        const content = selectedNodeInTier[locale];
                        const isDone = completedSet.has(selectedNodeInTier.id);
                        const ytId = getYoutubeId(content.video.url);
                        const isPlaying = playingVideoNodeId === selectedNodeInTier.id;

                        return (
                          <>
                            <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
                              <div>
                                <div className="mb-1 font-mono text-xs text-monitor">
                                  {selectedNodeInTier.code} · {content.level} · ~{selectedNodeInTier.time}
                                </div>
                                <h2 className="type-heading text-xl text-paper">
                                  {content.name}
                                </h2>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  disabled={savingNodeId === selectedNodeInTier.id}
                                  onClick={() => handleToggleCompleteClick(selectedNodeInTier)}
                                  className={cn(
                                    "rounded-full px-4 py-1.5 text-xs font-bold transition-all disabled:opacity-60",
                                    isDone
                                      ? "border border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                                      : "bg-lamp text-night hover:brightness-110",
                                  )}
                                >
                                  {savingNodeId === selectedNodeInTier.id
                                    ? copy.saving
                                    : isDone
                                      ? copy.markedDone
                                      : copy.markDone}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedId(null)}
                                  aria-label={copy.closeAria}
                                  className="grid h-8 w-8 place-items-center rounded-full border border-line bg-night text-fog transition-colors hover:border-monitor hover:text-paper"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            <div className="grid gap-5 md:grid-cols-[1.15fr_1fr]">
                              {/* Left: Core Text + Cloud Free Callout + Practice */}
                              <div className="flex flex-col gap-4">
                                <div>
                                  <p className="mb-1.5 font-mono text-[11px] font-semibold tracking-wider text-fog uppercase">
                                    {copy.baseTextLabel}
                                  </p>
                                  <div className="space-y-2.5 text-sm leading-relaxed text-paper/95">
                                    {content.summary.split("\n\n").map((paragraph, index) => (
                                      <p key={index}>{paragraph}</p>
                                    ))}
                                  </div>

                                  {content.highlights && content.highlights.length > 0 && (
                                    <ul className="mt-3.5 space-y-2">
                                      {content.highlights.map((item) => (
                                        <li
                                          key={item.title}
                                          className="rounded-xl border border-line bg-night/70 px-3.5 py-2.5 text-xs leading-relaxed text-paper/90"
                                        >
                                          <span className="block font-semibold text-monitor">
                                            {item.title}
                                          </span>
                                          <span className="mt-0.5 block text-fog">
                                            {item.text}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>

                                {content.callout && (
                                  <div className="rounded-xl border border-monitor/35 bg-monitor/10 p-3.5">
                                    <div className="mb-1.5 flex items-center gap-2 text-xs font-bold text-monitor">
                                      <AlertCircle className="h-4 w-4 shrink-0" />
                                      <span>{content.callout.title}</span>
                                    </div>
                                    <p className="mb-2.5 text-xs leading-relaxed text-paper/90">
                                      {content.callout.body}
                                    </p>
                                    <div className="flex flex-col gap-1.5">
                                      {content.callout.links.map((link) => (
                                        <a
                                          key={link.url}
                                          href={link.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center justify-between gap-2 rounded-lg border border-line bg-night px-3 py-2 text-xs transition-colors hover:border-monitor"
                                        >
                                          <div>
                                            <span className="font-semibold text-paper">
                                              {link.label}
                                            </span>
                                            <span className="block text-[11px] text-fog">
                                              {link.hint}
                                            </span>
                                          </div>
                                          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-monitor" />
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {content.practice && (
                                  <div className="rounded-xl border border-lamp/40 bg-lamp/10 p-3.5">
                                    <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[11px] font-bold tracking-wider text-lamp uppercase">
                                      <Sparkles className="h-3.5 w-3.5" />
                                      <span>{copy.practiceLabel}</span>
                                    </div>
                                    <p className="text-xs leading-relaxed text-paper sm:text-[13px]">
                                      {content.practice.text}
                                    </p>
                                    <p className="mt-2 font-mono text-[11px] text-fog">
                                      {content.practice.uses}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Right: YouTube Embed + Free References */}
                              <div className="flex flex-col gap-4">
                                <div>
                                  <p className="mb-1.5 font-mono text-[11px] font-semibold tracking-wider text-fog uppercase">
                                    {copy.videoLabel}
                                  </p>
                                  <div className="overflow-hidden rounded-xl border border-line bg-night">
                                    <div className="relative aspect-video w-full bg-black">
                                      {ytId && isPlaying ? (
                                        <iframe
                                          src={getYoutubeEmbedUrl(ytId)}
                                          title={content.video.title}
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                          allowFullScreen
                                          className="h-full w-full border-0"
                                        />
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (ytId) {
                                              setPlayingVideoNodeId(selectedNodeInTier.id);
                                            }
                                          }}
                                          className="group relative flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center"
                                        >
                                          {ytId && (
                                            <img
                                              src={getYoutubeThumbnail(ytId)}
                                              alt={content.video.title}
                                              className="absolute inset-0 h-full w-full object-cover opacity-45 transition-opacity group-hover:opacity-60"
                                            />
                                          )}
                                          <span className="relative z-10 grid h-12 w-12 place-items-center rounded-full bg-lamp text-night shadow-lg transition-transform group-hover:scale-110">
                                            <Play className="ml-0.5 h-5 w-5 fill-current" />
                                          </span>
                                          <span className="relative z-10 line-clamp-2 max-w-[30ch] text-xs font-semibold text-white drop-shadow">
                                            {content.video.title}
                                          </span>
                                          <span className="relative z-10 font-mono text-[10px] text-zinc-200">
                                            {copy.watchVideo}
                                          </span>
                                        </button>
                                      )}
                                    </div>
                                    <div className="flex items-center justify-between gap-2 bg-night-high px-3 py-2 font-mono text-[11px] text-fog">
                                      <span className="truncate">{content.video.channel}</span>
                                      <span className="shrink-0">{content.video.duration}</span>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <p className="mb-1.5 font-mono text-[11px] font-semibold tracking-wider text-fog uppercase">
                                    {copy.refsLabel}
                                  </p>
                                  <div className="flex flex-col gap-1.5">
                                    {content.resources.map((res) => {
                                      const isInternal = res.url.startsWith("/");
                                      if (isInternal) {
                                        return (
                                          <Link
                                            key={res.title}
                                            href={res.url}
                                            className="flex items-center justify-between gap-2 rounded-lg border border-line bg-night px-3 py-2 text-xs text-paper transition-colors hover:border-monitor"
                                          >
                                            <span className="line-clamp-1">{res.title}</span>
                                            <span className="shrink-0 font-mono text-[10px] text-emerald-400">
                                              {res.tag}
                                            </span>
                                          </Link>
                                        );
                                      }
                                      return (
                                        <a
                                          key={res.title}
                                          href={res.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center justify-between gap-2 rounded-lg border border-line bg-night px-3 py-2 text-xs text-paper transition-colors hover:border-monitor"
                                        >
                                          <span className="line-clamp-1">{res.title}</span>
                                          <span
                                            className={cn(
                                              "shrink-0 font-mono text-[10px]",
                                              res.free ? "text-emerald-400" : "text-fog",
                                            )}
                                          >
                                            {res.tag}
                                          </span>
                                        </a>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Onboarding Modal (Name + Email + Future Updates Notice) */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="roadmap-modal-title"
        >
          <div className="w-full max-w-[420px] rounded-2xl border border-line bg-night-raised p-6 shadow-2xl">
            <h2 id="roadmap-modal-title" className="type-heading mb-1.5 text-xl text-paper">
              {copy.modalTitle}
            </h2>
            <p className="mb-4 text-xs text-fog sm:text-sm">{copy.modalSub}</p>

            <div className="mb-4 rounded-xl border border-monitor/30 bg-monitor/10 p-3 text-xs leading-relaxed text-paper">
              <strong className="text-monitor">{copy.modalNoticePrefix}</strong>{" "}
              {copy.modalNoticeBody}
            </div>

            <form onSubmit={handleSessionSubmit} className="flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-xs font-semibold text-paper">
                {copy.nameLabel}
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={80}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder={copy.namePlaceholder}
                  className="h-10 rounded-lg border border-line bg-night px-3 text-sm font-normal text-paper outline-none focus:border-monitor"
                />
              </label>

              <label className="flex flex-col gap-1 text-xs font-semibold text-paper">
                {copy.emailLabel}
                <input
                  type="email"
                  required
                  maxLength={160}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder={copy.emailPlaceholder}
                  className="h-10 rounded-lg border border-line bg-night px-3 text-sm font-normal text-paper outline-none focus:border-monitor"
                />
              </label>

              {formError && (
                <p className="text-xs text-destructive">{formError}</p>
              )}

              <button
                type="submit"
                disabled={submittingSession}
                className="mt-1 h-10 rounded-xl bg-lamp text-sm font-bold text-night transition-opacity hover:opacity-95 disabled:opacity-60"
              >
                {submittingSession ? copy.submittingBtn : copy.submitBtn}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSkippedOnce(true);
                  setModalOpen(false);
                  if (pendingAction?.type === "open") {
                    setSelectedId(pendingAction.nodeId);
                  }
                  setPendingAction(null);
                }}
                className="py-1 text-xs text-fog hover:text-paper"
              >
                {copy.skipBtn}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full border border-lamp bg-night-high px-4 py-2 font-mono text-xs text-paper shadow-xl md:bottom-6">
          {toast}
        </div>
      )}
    </main>
  );
}
