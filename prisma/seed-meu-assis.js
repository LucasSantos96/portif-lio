/**
 * Seed idempotente do projeto MeuAssis + linha do tempo.
 *
 * Pré-requisito: a migration supabase/migrations/20261117120000_create_project_updates.sql
 * já aplicada. Rodar com: npm run prisma:seed:meu-assis
 *
 * Upsert por chaves estáveis: projeto por `project_url`, atualizações por
 * (project_id, slug). Rodar de novo apenas atualiza os textos; não duplica nada.
 * O `sort_order` do projeto só é definido na criação (para não desfazer a ordem
 * que o dono ajustar depois em /upload).
 */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const PROJECT_URL = "https://meuassis.com/";
const img = (name) => `/projects/meu-assis/${name}.webp`;

const project = {
  title: "MeuAssis",
  titleEn: "MeuAssis",
  description:
    "Plataforma completa para escritórios de advocacia: CRM, atendimento omnichannel em WhatsApp e Instagram, IA atendente, contratos com assinatura eletrônica, agenda e dashboard comercial. SaaS multi-tenant com planos Basic e Pro, hoje na V2 com design system novo.",
  descriptionEn:
    "A complete platform for law firms: CRM, omnichannel support on WhatsApp and Instagram, an AI attendant, contracts with e-signature, scheduling and a sales dashboard. A multi-tenant SaaS with Basic and Pro plans, now on V2 with a brand-new design system.",
  imageUrl: img("v2-dashboard"),
  galleryImages: [img("atendimento-ia-equipe"), img("integracoes"), img("crm-etapas")],
  videoUrls: [],
  category: "project",
  technologies: [
    "Next.js",
    "NestJS",
    "TypeScript",
    "PostgreSQL",
    "Prisma",
    "Redis",
    "BullMQ",
    "LangGraph",
    "Docker",
    "WhatsApp",
  ],
  githubRepo: null,
  source: "manual",
  published: true,
};

// Datas reais extraídas do histórico do repositório (primeira entrega de cada marco).
const updates = [
  {
    slug: "lancamento",
    occurredAt: "2026-03-10",
    title: "Nasce a plataforma: ERP, CRM e IA em um só lugar",
    titleEn: "The platform is born: ERP, CRM and AI in one place",
    description:
      "Primeira versão com navegação, login, dashboard, CRM em funil, atendimento, contratos, relacionamento e suporte. Em seguida a arquitetura foi consolidada em um monólito modular (NestJS + PostgreSQL + Prisma) com front em Next.js e isolamento por escritório (multi-tenant).",
    descriptionEn:
      "First version with navigation, login, dashboard, funnel CRM, support, contracts, relationship tracking and help desk. The architecture was then consolidated into a modular monolith (NestJS + PostgreSQL + Prisma) with a Next.js front end and per-firm isolation (multi-tenant).",
    images: [],
  },
  {
    slug: "whatsapp-agenda",
    occurredAt: "2026-04-14",
    title: "Atendimento omnichannel no WhatsApp e agenda integrada",
    titleEn: "Omnichannel support on WhatsApp and an integrated calendar",
    description:
      "Conexão do WhatsApp por QR Code, caixa de conversas em tempo real com atribuição a atendentes, e sincronização bidirecional com o Google Calendar. Cada conversa vira um lead acompanhado no funil, sem trocar de ferramenta.",
    descriptionEn:
      "WhatsApp connection through a QR code, a real-time inbox with assignment to attendants, and two-way sync with Google Calendar. Every conversation becomes a lead tracked in the funnel, with no tool switching.",
    images: [img("integracoes")],
  },
  {
    slug: "contratos-zapsign",
    occurredAt: "2026-04-24",
    title: "Contratos com assinatura eletrônica (ZapSign)",
    titleEn: "Contracts with e-signature (ZapSign)",
    description:
      "Geração de contratos a partir de modelos e acompanhamento do status de assinatura dentro da plataforma, sincronizado com a ZapSign. O fechamento do cliente deixa de depender de e-mail e planilha.",
    descriptionEn:
      "Contract generation from templates and signature status tracking inside the platform, synced with ZapSign. Closing a client no longer depends on email and spreadsheets.",
    images: [],
  },
  {
    slug: "ia-atendente",
    occurredAt: "2026-05-22",
    title: "IA atendente e follow-up automático",
    titleEn: "AI attendant and automatic follow-up",
    description:
      "Um atendente virtual faz a triagem, qualifica o lead por área do direito e agenda a reunião; a equipe assume quando necessário. Follow-ups programados retomam conversas paradas, com proteção (circuit breaker) que pausa a IA se houver falhas seguidas.",
    descriptionEn:
      "A virtual attendant triages, qualifies the lead by legal area and books the meeting; the team takes over when needed. Scheduled follow-ups revive stalled conversations, with a circuit breaker that pauses the AI after consecutive failures.",
    images: [img("atendimento-ia-equipe")],
  },
  {
    slug: "instagram-audio",
    occurredAt: "2026-06-24",
    title: "Instagram no mesmo atendimento e transcrição de áudios",
    titleEn: "Instagram in the same inbox and audio transcription",
    description:
      "Mensagens do Instagram passam a cair na mesma caixa do WhatsApp, atendidas pela IA e pela equipe. Áudios recebidos são transcritos automaticamente antes de a IA responder, em filas assíncronas (BullMQ) para não travar o atendimento.",
    descriptionEn:
      "Instagram messages land in the same inbox as WhatsApp, handled by the AI and the team. Incoming audio is transcribed automatically before the AI replies, using async queues (BullMQ) so support never stalls.",
    images: [],
  },
  {
    slug: "canais-kanban",
    occurredAt: "2026-08-28",
    title: "Terceiro canal, histórico sincronizado e quadro de tarefas",
    titleEn: "Third channel, synced history and a task board",
    description:
      "Suporte a um terceiro número de WhatsApp com permissões próprias (parcerias e correspondentes), sincronização do histórico de conversas e um quadro Kanban de tarefas por colaborador, com contato vinculado.",
    descriptionEn:
      "Support for a third WhatsApp number with its own permissions (partners and correspondents), conversation history sync and a per-collaborator Kanban task board linked to contacts.",
    images: [img("crm-etapas")],
  },
  {
    slug: "meta-ads",
    occurredAt: "2026-09-25",
    title: "Origem do anúncio e conversões no Meta Ads",
    titleEn: "Ad attribution and Meta Ads conversions",
    description:
      "O CRM passa a registrar de qual anúncio veio cada conversa e devolve as conversões (lead qualificado) ao Pixel pela Conversions API. O escritório enxerga o retorno real do tráfego pago, não só cliques.",
    descriptionEn:
      "The CRM now records which ad each conversation came from and sends conversions (qualified leads) back to the Pixel through the Conversions API. The firm sees the real return on paid traffic, not just clicks.",
    images: [img("integracoes")],
  },
  {
    slug: "v2-redesign",
    occurredAt: "2026-10-07",
    title: "V2: redesign completo e design system novo",
    titleEn: "V2: full redesign and a new design system",
    description:
      "Nove fases de trabalho: tokens de design, componentes primitivos, nova navegação, tour de novidades, dashboard, login, contratos e automações. A V2 chega com tema claro e escuro, contraste WCAG AA, foco visível, respeito a movimento reduzido e testes de responsividade e acessibilidade.",
    descriptionEn:
      "Nine phases of work: design tokens, primitive components, new navigation, a what's-new tour, dashboard, login, contracts and automations. V2 ships with light and dark themes, WCAG AA contrast, visible focus, reduced-motion support and responsiveness and accessibility tests.",
    images: [img("v2-dashboard"), img("atendimento-ia-equipe")],
  },
  {
    slug: "ia-langgraph",
    occurredAt: "2026-10-23",
    title: "IA reescrita em LangGraph, com agentes por área",
    titleEn: "AI rebuilt on LangGraph, with per-area agents",
    description:
      "A IA atendente passa a ser um grafo de agentes dedicados por área do direito, com transferência (handoff) entre eles, cadeia de modelos com fallback e saída estruturada por schema. Mais previsível, mais fácil de testar e de evoluir.",
    descriptionEn:
      "The AI attendant became a graph of dedicated agents per legal area, with handoff between them, a model chain with fallback and schema-based structured output. More predictable, easier to test and to evolve.",
    images: [],
  },
  {
    slug: "pwa-observabilidade",
    occurredAt: "2026-10-28",
    title: "App instalável com notificações e observabilidade",
    titleEn: "Installable app with notifications and observability",
    description:
      "A plataforma vira PWA, com notificações push de contratos e reuniões no celular. Do lado da operação, entram auditoria das ações da gerência e métricas de saúde do sistema para diagnosticar problemas antes que o cliente perceba.",
    descriptionEn:
      "The platform became a PWA, with push notifications for contracts and meetings on the phone. On the operations side, it gained an audit trail for management actions and system health metrics to diagnose issues before customers notice.",
    images: [],
  },
  {
    slug: "planos-drive",
    occurredAt: "2026-11-04",
    title: "Planos Basic e Pro e contratos assinados no Google Drive",
    titleEn: "Basic and Pro plans and signed contracts in Google Drive",
    description:
      "Modelo de planos por escritório: o Basic entrega CRM e atendimento sem IA, o Pro libera automações e leitura de mídia. Integração com o Google Drive para arquivar automaticamente os contratos assinados na pasta escolhida.",
    descriptionEn:
      "Per-firm plans: Basic delivers CRM and support without AI, Pro unlocks automations and media understanding. A Google Drive integration automatically files signed contracts in the chosen folder.",
    images: [img("integracoes")],
  },
  {
    slug: "v2-onboarding-tutoriais",
    occurredAt: "2026-11-16",
    title: "Onboarding guiado, suporte com feedback e tutoriais em vídeo",
    titleEn: "Guided onboarding, support with feedback and video tutorials",
    description:
      "Assistente de primeiro acesso passo a passo com checklist, convites de equipe por e-mail, suporte com áudio, anexos e avaliação da resposta, e uma biblioteca de aulas em vídeo da V2 produzidas de forma programática (roteiro, narração e capturas de tela geradas por script).",
    descriptionEn:
      "A step-by-step first-access wizard with a checklist, team invitations by email, support with audio, attachments and rating of the answer, and a library of V2 video lessons produced programmatically (script, narration and screenshots generated by code).",
    images: [img("crm-etapas")],
  },
];

async function main() {
  let projectRow = await prisma.portfolioProject.findUnique({
    where: { projectUrl: PROJECT_URL },
  });

  const fields = {
    title: project.title,
    titleEn: project.titleEn,
    description: project.description,
    descriptionEn: project.descriptionEn,
    imageUrl: project.imageUrl,
    galleryImages: project.galleryImages,
    videoUrls: project.videoUrls,
    category: project.category,
    technologies: project.technologies,
    githubRepo: project.githubRepo,
    source: project.source,
    published: project.published,
  };

  if (projectRow) {
    projectRow = await prisma.portfolioProject.update({
      where: { id: projectRow.id },
      data: fields,
    });
  } else {
    const min = await prisma.portfolioProject.aggregate({ _min: { sortOrder: true } });
    projectRow = await prisma.portfolioProject.create({
      data: {
        ...fields,
        projectUrl: PROJECT_URL,
        sortOrder: (min._min.sortOrder ?? 0) - 1,
      },
    });
  }

  for (const [index, update] of updates.entries()) {
    const data = {
      occurredAt: new Date(`${update.occurredAt}T00:00:00.000Z`),
      title: update.title,
      titleEn: update.titleEn,
      description: update.description,
      descriptionEn: update.descriptionEn,
      images: update.images,
      sortOrder: index,
    };

    await prisma.projectUpdate.upsert({
      where: { projectId_slug: { projectId: projectRow.id, slug: update.slug } },
      update: data,
      create: { ...data, projectId: projectRow.id, slug: update.slug },
    });
  }

  console.log(`MeuAssis (id ${projectRow.id}) com ${updates.length} atualizações na linha do tempo.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
