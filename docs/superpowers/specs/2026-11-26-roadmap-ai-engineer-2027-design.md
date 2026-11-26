# Design Spec — Meu Roadmap: Engenheiro de IA 2027 (`/roadmap` e `/en/roadmap`)

Data: 2026-11-26  
Status: Aprovado pelo usuário

## 1. Objetivo

Criar uma feature interativa no portfólio do Lucas Santos chamada **"Meu Roadmap: Engenheiro de IA 2027"** (`/roadmap` em PT-BR e `/en/roadmap` em EN), inspirada no artigo *"Como eu vou me tornar um AI Engineer em 2027"* e estruturada nos três pilares práticos (integrar modelos, levar para produção e ajustar/avaliar).

A trilha vai do nível iniciante ao avançado, prioriza **recursos gratuitos e open source** (sem Mastra), traz **ideias práticas cumulativas** em aulas-chave e registra participantes e progresso no banco de dados PostgreSQL para acompanhamento no painel `/upload`.

## 2. Arquitetura e Fluxo

1. **Currículo tipado em código (`src/data/roadmap-ai-2027.ts`):**
   - 6 níveis/fases (`00 · Início` até `05 · Projeto Final`), totalizando 13 nós em formato de árvore/grafo.
   - Conteúdo bilíngue (`pt` / `en`) para títulos, textos base, ideias práticas, vídeos do YouTube e referências gratuitas/open source.
   - Aviso dedicado na aula de LLMs/Ollama (e nas práticas) indicando **OpenRouter (`:free` / `openrouter/free`)** e **Google AI Studio (Gemini API Free Tier)** com links oficiais para quem não puder rodar modelos localmente.

2. **Interface Clean em Grafo (`src/components/roadmap/RoadmapClient.tsx`):**
   - Header integrado ao portfólio (`Header.tsx` com item `Roadmap` e suporte a `PT / EN` via `alternatePath`).
   - H1 display de alto destaque, barra de progresso única no topo e legenda discreta.
   - Árvore de nós em formato de **bolinhas + nomes**, conectadas por linhas SVG vivas que destacam o ramo ativo e os caminhos concluídos.
   - Clique na bolinha expande o card de estudo **inline dentro do próprio grafo**, com:
     - Texto base objetivo;
     - Bloco *"Ideia prática · Mão na massa"* nas aulas aplicadas (`1.3`, `2.2`, `3.2`, `3.3`, `4.1`, `4.2`, `★`);
     - Embed real do YouTube (`youtube-nocookie.com`) via `src/lib/youtube.ts` com click-to-play;
     - Lista de links gratuitos/open source;
     - Botão para marcar/desmarcar como concluído (progressão livre com guia visual no próximo nó sugerido).

3. **Identificação e Persistência em Banco de Dados:**
   - No primeiro clique em `00`, em *"Iniciar jornada"*, ou ao tentar marcar o primeiro tópico sem cadastro, abre um modal solicitando **Nome** e **E-mail**, com aviso claro de que o e-mail será usado para manter o progresso salvo e enviar novidades/atualizações futuras do roadmap.
   - `token` salvo em `localStorage` para restaurar a sessão automaticamente; se o usuário retornar com o mesmo e-mail em outro dispositivo, recupera o participante existente.
   - **Prisma + PostgreSQL (`prisma/schema.prisma` + migration em `supabase/migrations/`):**
     - `RoadmapParticipant` (`roadmap_participants`): `id`, `token`, `name`, `email` (unique lowercase), `locale`, `createdAt`, `lastActiveAt`.
     - `RoadmapCompletion` (`roadmap_completions`): `id`, `participantId`, `nodeId`, `completedAt` (unique `[participantId, nodeId]`).

4. **APIs (`src/app/api/roadmap/`):**
   - `GET /api/roadmap/session?token=...` — restaura participante e `completedNodeIds`.
   - `POST /api/roadmap/session` — cria ou recupera participante por e-mail e atualiza nome/locale.
   - `POST /api/roadmap/progress` — alterna conclusão de `nodeId` validado contra o catálogo.

5. **Painel Admin (`/upload?tab=roadmap`):**
   - Nova aba `Roadmap` em `UploadTabs.tsx`, protegida pela sessão de `/upload`.
   - Exibe métricas (participantes, progresso médio, conclusões 100%), busca por nome/e-mail, progresso detalhado por participante e ações de **Copiar e-mails** e **Exportar CSV**.
