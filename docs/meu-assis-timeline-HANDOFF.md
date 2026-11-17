# Handoff: MeuAssis no portfólio + linha do tempo por projeto

Branch: `LucasSantos96/meu-assis-timeline` (a partir de `feat/redesign`). Nada foi aplicado no banco de produção.

## O que mudou

| Arquivo | O quê |
| --- | --- |
| `prisma/schema.prisma` | Novo modelo `ProjectUpdate` (`project_updates`), ligado a `PortfolioProject` (cascade). Único por `(project_id, slug)`. |
| `supabase/migrations/20261117120000_create_project_updates.sql` | SQL da migration, à mão, idempotente (`if not exists`), RLS ligada como em `articles`. Conferido contra `prisma migrate diff` (sem conectar no banco). |
| `src/lib/project-updates.ts` | `getProjectUpdates(projectId)`. Qualquer erro (inclusive tabela ainda inexistente) devolve `[]`. |
| `src/components/project/ProjectTimeline.tsx` | Linha do tempo vertical, bilíngue, responsiva, tema claro/escuro, imagens abrem no lightbox. Sem atualizações não renderiza nada. |
| `src/components/project/ProjectGallery.tsx`, `src/app/projetos/[id]/page.tsx` | Integram a linha do tempo (vale para todos os projetos) e juntam as imagens dela ao lightbox. |
| `src/i18n/dictionaries/{pt,en}.ts`, `src/types/*` | Textos PT/EN e tipo `ProjectUpdate`. |
| `prisma/seed-meu-assis.js` + script `npm run prisma:seed:meu-assis` | Seed idempotente do projeto MeuAssis (upsert por `project_url` = `https://meuassis.com/`) e de 12 marcos (upsert por `project_id + slug`). |
| `public/projects/meu-assis/*.webp` | 4 prints (1600 px, WebP). |

## Decisões

- Linha do tempo é feature genérica: qualquer projeto com linhas em `project_updates` passa a mostrá-la.
- Os 12 marcos usam datas reais do `git log` do repositório do MeuAssis (primeira entrega de cada tema): lançamento (10/03/2026), WhatsApp + agenda (14/04), ZapSign (24/04), IA atendente (22/05), Instagram + áudio (24/06), terceiro canal/Kanban (28/08), Meta Ads (25/09), V2 redesign (07/10), IA em LangGraph (23/10), PWA + observabilidade (28/10), planos + Drive (04/11), onboarding/suporte/tutoriais (16/11).
- Textos falam de entregas e arquitetura em alto nível. Não citam clientes, escritórios, incidentes, URLs de infraestrutura nem segurança.
- O projeto entra com `sort_order` = menor existente - 1 (fica primeiro), só na criação; reordenar em `/upload` continua valendo.
- URL do projeto: `https://meuassis.com/` (site público; a conferir se é a que você quer exibir em "Abrir projeto").

## Prints usados (de `video_tutoriais/public/shots`)

Todos conferidos um a um; só dados de demonstração.

- `l1-1/dashboard.png` -> `v2-dashboard.webp` (capa; dashboard da V2).
- `l2-5/sem-conexao.png` -> `integracoes.webp` (WhatsApp, Google Calendar, Instagram, ZapSign, Meta Ads, Google Drive). Escolhido por estar sem conta conectada, logo sem e-mails.
- `l3-4/equipe.png` -> `atendimento-ia-equipe.webp` (omnichannel com IA pausada, etapa e atendente). Telefone de demonstração coberto com retângulo.
- `l3-5/clientes.png` -> `crm-etapas.webp` (conversa em etapa do CRM). Telefone de demonstração coberto.

## Prints descartados

- `l2-5/conectado.png`: mostra e-mails de contas conectadas (domínio de escritório) e números.
- `l3-1/conversas.png`, `l3-2/chat.png`, `l3-4/ia-ativa.png`, `l3-5/etapas-leads.png`, `out/cover-atendimento-conversas.png`: a mensagem da IA cita o nome de um escritório; não dá para afirmar que é fictício.
- `l1-1/treinamentos.png`: cards de teste com lixo de texto e capturas de ferramentas de terceiros.
- `l1-1/suporte.png`, `l1-5/sino.png`: fora do foco (suporte genérico, repetição do dashboard).
- Todos os passo a passo (menus, diálogos, formulários) e demais prints: fora do pedido.

## Aplicar em produção (você faz)

1. Merge e deploy do código. Antes da migration o site funciona normalmente (linha do tempo simplesmente não aparece).
2. Migration: colar `supabase/migrations/20261117120000_create_project_updates.sql` no SQL Editor do Supabase (ou `supabase db push`). Pode rodar mais de uma vez.
3. Seed (com `.env` de produção): `npm run prisma:seed:meu-assis`. Pode rodar mais de uma vez; só atualiza textos.
4. Conferir `/projetos/<id do MeuAssis>`. Não precisa de upload no Storage: as imagens vão no próprio deploy (`public/projects/meu-assis`).

## Validação feita

- `npm run lint` sem avisos; `next build` ok.
- Postgres descartável em Docker (porta 55871, `DATABASE_URL` só na linha de comando, container removido): migrations aplicadas, seed rodado duas vezes (12 linhas, sem duplicar), migration reaplicada sem erro, página renderizada em 390 px. Projeto sem atualizações não mostra a seção.
- O `.env` de produção não existe neste worktree e nunca foi usado.

## Pendente / próximos passos

- Cadastro de atualizações pela área `/upload` (formulário + rotas `api/projects/[id]/updates`): não feito por ser grande; hoje o conteúdo entra via seed/SQL.
- Verificar a versão EN no navegador (textos presentes, não inspecionados visualmente) e o tema claro da linha do tempo.
- Revisar a redação dos marcos e confirmar a URL pública do projeto.
- Considerar JSON-LD/sitemap com a linha do tempo.
