"use client";

import React, { useMemo, useState } from "react";
import { Check, Copy, Download, Search, Users } from "lucide-react";

import { ALL_ROADMAP_NODES } from "@/data/roadmap-ai-2027";
import type { RoadmapParticipantSummary } from "@/lib/roadmap";

const NODE_CODE_BY_ID = new Map(ALL_ROADMAP_NODES.map((n) => [n.id, `${n.code} ${n.pt.name}`]));

export default function RoadmapParticipantsPanel({
  initialParticipants,
}: {
  initialParticipants: RoadmapParticipantSummary[];
}) {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialParticipants;
    return initialParticipants.filter(
      (p) => p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q),
    );
  }, [initialParticipants, query]);

  const avgProgress = useMemo(() => {
    if (!initialParticipants.length) return 0;
    const total = initialParticipants.reduce((acc, p) => acc + p.progressPercent, 0);
    return Math.round(total / initialParticipants.length);
  }, [initialParticipants]);

  const finishedCount = useMemo(
    () => initialParticipants.filter((p) => p.progressPercent === 100).length,
    [initialParticipants],
  );

  const handleCopyEmails = async () => {
    const emails = filtered.map((p) => p.email).join(", ");
    if (!emails) return;
    await navigator.clipboard.writeText(emails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCsv = () => {
    const header = "Nome,Email,Idioma,Concluidos,Total,Progresso%,UltimaAtividade\n";
    const rows = filtered
      .map((p) =>
        [
          `"${p.name.replaceAll('"', '""')}"`,
          `"${p.email}"`,
          p.locale,
          p.completedCount,
          p.totalNodes,
          p.progressPercent,
          p.lastActiveAt,
        ].join(","),
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "roadmap-ai-engineer-2027-participantes.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="mx-auto mt-6 w-full max-w-6xl px-4 pb-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="type-heading text-2xl text-paper">
            Participantes do Roadmap 2027
          </h1>
          <p className="mt-1 text-sm text-fog">
            Acompanhe quem se cadastrou no roadmap, o progresso em cada tópico e exporte os e-mails para avisos futuros.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCopyEmails}
            disabled={!filtered.length}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-night-raised px-4 py-2 text-xs font-semibold text-paper transition-colors hover:border-monitor disabled:opacity-50"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "E-mails copiados" : "Copiar e-mails"}
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={!filtered.length}
            className="inline-flex items-center gap-2 rounded-full bg-lamp px-4 py-2 text-xs font-bold text-night transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-night-raised p-4">
          <span className="font-mono text-xs text-fog uppercase">Participantes</span>
          <div className="mt-1 flex items-center gap-2 text-2xl font-bold text-paper">
            <Users className="h-5 w-5 text-monitor" />
            {initialParticipants.length}
          </div>
        </div>
        <div className="rounded-xl border border-line bg-night-raised p-4">
          <span className="font-mono text-xs text-fog uppercase">Progresso médio</span>
          <div className="mt-1 text-2xl font-bold text-lamp">{avgProgress}%</div>
        </div>
        <div className="rounded-xl border border-line bg-night-raised p-4">
          <span className="font-mono text-xs text-fog uppercase">Concluíram 100%</span>
          <div className="mt-1 text-2xl font-bold text-emerald-400">{finishedCount}</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-fog" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome ou e-mail..."
          className="h-10 w-full rounded-xl border border-line bg-night-raised pr-4 pl-10 text-sm text-paper outline-none focus:border-monitor"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-line bg-night-raised">
        {!filtered.length ? (
          <p className="p-8 text-center text-sm text-fog">
            Nenhum participante encontrado ainda.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line font-mono text-xs text-fog uppercase">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">Progresso</th>
                <th className="px-4 py-3">Tópicos marcados</th>
                <th className="px-4 py-3">Última atividade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {filtered.map((p) => (
                <tr key={p.id} className="align-top hover:bg-night-high/40">
                  <td className="px-4 py-3 font-medium text-paper">
                    {p.name}
                    <span className="ml-2 rounded bg-night-high px-1.5 py-0.5 font-mono text-[10px] text-fog uppercase">
                      {p.locale}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-monitor">{p.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-night-high">
                        <div
                          className="h-full rounded-full bg-lamp"
                          style={{ width: `${p.progressPercent}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-paper">
                        {p.completedCount}/{p.totalNodes} ({p.progressPercent}%)
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-fog">
                    {p.completedNodeIds.length === 0 ? (
                      <span>—</span>
                    ) : (
                      <div className="flex max-w-xs flex-wrap gap-1">
                        {p.completedNodeIds.map((nodeId) => (
                          <span
                            key={nodeId}
                            className="rounded border border-line bg-night px-1.5 py-0.5 font-mono text-[10px] text-paper"
                          >
                            {NODE_CODE_BY_ID.get(nodeId) ?? nodeId}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-fog">
                    {new Date(p.lastActiveAt).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
