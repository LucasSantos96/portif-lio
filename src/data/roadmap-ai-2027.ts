import type { ArticleLocale } from "@/types";

export interface RoadmapResource {
  title: string;
  url: string;
  tag: string;
  free: boolean;
}

export interface RoadmapCallout {
  title: string;
  body: string;
  links: { label: string; url: string; hint: string }[];
}

export interface RoadmapPractice {
  text: string;
  uses: string;
}

export interface RoadmapVideo {
  title: string;
  channel: string;
  duration: string;
  url: string;
}

export interface RoadmapHighlight {
  title: string;
  text: string;
}

export interface RoadmapLocalizedContent {
  name: string;
  level: string;
  summary: string;
  highlights?: RoadmapHighlight[];
  callout?: RoadmapCallout;
  practice?: RoadmapPractice;
  video: RoadmapVideo;
  resources: RoadmapResource[];
}

export interface RoadmapNode {
  id: string;
  code: string;
  time: string;
  capstone?: boolean;
  parents: string[];
  pt: RoadmapLocalizedContent;
  en: RoadmapLocalizedContent;
}

export interface RoadmapTier {
  id: string;
  label: Record<ArticleLocale, string>;
  nodes: RoadmapNode[];
}

export const ROADMAP_TIERS: RoadmapTier[] = [
  {
    id: "t0",
    label: { pt: "00 · Início", en: "00 · Start" },
    nodes: [
      {
        id: "n0",
        code: "00",
        time: "25 min",
        parents: [],
        pt: {
          name: "O que faz um AI Engineer",
          level: "Iniciante",
          summary:
            "Um Engenheiro de IA (AI Engineer) é o profissional de software responsável por colocar inteligência artificial dentro de sistemas reais de forma confiável, barata e escalável.\n\nDiferente de um Cientista de Dados ou pesquisador de Machine Learning, você não passa o dia treinando modelos fundacionais do zero. Seu trabalho é engenheirar produtos em cima de modelos prontos (via API ou modelos open-weight), resolvendo o que acontece quando a IA sai do protótipo e enfrenta usuários reais: respostas imprevisíveis, lentidão, custo alto de tokens e integrações complexas.\n\nNa prática, a rotina de um AI Engineer gira em torno de três pilares — e a diferença entre um agente que vive quebrando e um sistema em produção está na arquitetura, nos testes e no monitoramento, não em simplesmente escolher o modelo mais caro.",
          highlights: [
            {
              title: "1. Integra modelos ao mundo real",
              text: "Conecta LLMs a APIs, bancos de dados e documentos privados da empresa usando RAG, Structured Outputs, Tool Calling, agentes e servidores MCP.",
            },
            {
              title: "2. Leva para produção com controle",
              text: "Cuida da arquitetura de backend, latência, streaming, limites de segurança (guardrails), redução de custos por token e observabilidade de ponta a ponta (como Langfuse).",
            },
            {
              title: "3. Ajusta e avalia continuamente",
              text: "Cria conjuntos de teste (Evals) e métricas automatizadas para medir fidelidade e precisão — evitando o ciclo de consertar um prompt de um lado e quebrar outro sem perceber.",
            },
          ],
          video: {
            title: "Meu roadmap para me tornar engenheiro de IA em 2027",
            channel: "Lucas Santos Dev",
            duration: "Vídeo completo",
            url: "https://youtu.be/fRMwo65BtY4",
          },
          resources: [
            {
              title: "Artigo no Blog: Como eu vou me tornar um AI Engineer em 2027",
              url: "/blog/como-vou-me-tornar-ai-engineer-2027",
              tag: "Artigo",
              free: true,
            },
            {
              title: "OpenAI Academy — Trilha Builders",
              url: "https://academy.openai.com/",
              tag: "Curso Grátis",
              free: true,
            },
            {
              title: "Hugging Face Learn — Trilhas Gratuitas",
              url: "https://huggingface.co/learn",
              tag: "Open Source",
              free: true,
            },
          ],
        },
        en: {
          name: "What an AI Engineer does",
          level: "Beginner",
          summary:
            "An AI Engineer is the software engineer responsible for embedding AI into real products in a reliable, cost-effective, and scalable way.\n\nUnlike a Data Scientist or ML researcher, you don't spend your days training foundation models from scratch. Instead, you engineer applications on top of existing models (via APIs or open-weight models), solving everything that breaks once a demo hits real users: unpredictable outputs, high latency, runaway token costs, and messy external integrations.\n\nDay to day, the role revolves around three core pillars — and the gap between a fragile prototype and a production AI system comes down to architecture, observability, and evaluations rather than just picking the most expensive model.",
          highlights: [
            {
              title: "1. Integrates models with real data",
              text: "Connects LLMs to APIs, databases, and private company docs using RAG, Structured Outputs, Tool Calling, agents, and MCP servers.",
            },
            {
              title: "2. Ships and operates in production",
              text: "Owns backend reliability, latency, streaming, security guardrails, token cost optimization, and end-to-end tracing/observability (such as Langfuse).",
            },
            {
              title: "3. Evaluates and iterates systematically",
              text: "Builds automated Evals and test datasets to measure faithfulness and accuracy — stopping the cycle of tweaking one prompt and silently breaking another.",
            },
          ],
          video: {
            title: "My roadmap to become an AI Engineer in 2027 (PT-BR)",
            channel: "Lucas Santos Dev",
            duration: "Full video",
            url: "https://youtu.be/fRMwo65BtY4",
          },
          resources: [
            {
              title: "Blog Article: How I am becoming an AI Engineer in 2027",
              url: "/en/blog",
              tag: "Article",
              free: true,
            },
            {
              title: "OpenAI Academy — Builders Track",
              url: "https://academy.openai.com/",
              tag: "Free Course",
              free: true,
            },
            {
              title: "Hugging Face Learn",
              url: "https://huggingface.co/learn",
              tag: "Open Source",
              free: true,
            },
          ],
        },
      },
    ],
  },
  {
    id: "t1",
    label: { pt: "01 · Fundamentos", en: "01 · Foundations" },
    nodes: [
      {
        id: "n1",
        code: "1.1",
        time: "3h",
        parents: ["n0"],
        pt: {
          name: "Python Async & APIs",
          level: "Iniciante",
          summary:
            "Domine async/await, FastAPI e validação com Pydantic v2 para construir backends rápidos, streaming (SSE) e contratos JSON confiáveis antes de conectar qualquer LLM.",
          video: {
            title: "Python API Development — Comprehensive Course for Beginners",
            channel: "freeCodeCamp.org",
            duration: "Curso completo",
            url: "https://www.youtube.com/watch?v=0sOvCWFmrtA",
          },
          resources: [
            {
              title: "FastAPI User Guide (Oficial)",
              url: "https://fastapi.tiangolo.com/tutorial/",
              tag: "Docs Open Source",
              free: true,
            },
            {
              title: "Pydantic v2 Documentation",
              url: "https://docs.pydantic.dev/latest/",
              tag: "Open Source",
              free: true,
            },
          ],
        },
        en: {
          name: "Async Python & APIs",
          level: "Beginner",
          summary:
            "Master async/await, FastAPI, and Pydantic v2 validation to build fast backends, streaming (SSE), and strict JSON contracts before plugging in any LLM.",
          video: {
            title: "Python API Development — Comprehensive Course for Beginners",
            channel: "freeCodeCamp.org",
            duration: "Full course",
            url: "https://www.youtube.com/watch?v=0sOvCWFmrtA",
          },
          resources: [
            {
              title: "FastAPI User Guide (Official)",
              url: "https://fastapi.tiangolo.com/tutorial/",
              tag: "Open Source Docs",
              free: true,
            },
            {
              title: "Pydantic v2 Documentation",
              url: "https://docs.pydantic.dev/latest/",
              tag: "Open Source",
              free: true,
            },
          ],
        },
      },
      {
        id: "n2",
        code: "1.2",
        time: "2h",
        parents: ["n0"],
        pt: {
          name: "LLMs, Tokens & Modelos",
          level: "Iniciante",
          summary:
            "Entenda como tokens, janela de contexto e temperatura afetam qualidade e custo — e experimente modelos open-weight localmente com Ollama ou via APIs gratuitas na nuvem.",
          callout: {
            title: "Seu computador não aguenta rodar IA local?",
            body: "Sem problema! Se sua máquina não tiver RAM/GPU suficiente para rodar o Ollama localmente, você pode criar uma chave de API gratuita e estudar normalmente na nuvem usando dois caminhos sem cartão de crédito:",
            links: [
              {
                label: "OpenRouter (Modelos :free)",
                url: "https://openrouter.ai/models?ft=free",
                hint: "Crie uma chave grátis e use modelos :free ou o roteador openrouter/free",
              },
              {
                label: "Google AI Studio (Gemini Free Tier)",
                url: "https://aistudio.google.com/",
                hint: "Gere uma API key gratuita para modelos Gemini Flash / Flash-Lite",
              },
            ],
          },
          video: {
            title: "[1hr Talk] Intro to Large Language Models",
            channel: "Andrej Karpathy",
            duration: "1h 00min",
            url: "https://www.youtube.com/watch?v=zjkBMFhNj_g",
          },
          resources: [
            {
              title: "Hugging Face LLM Course (Gratuito)",
              url: "https://huggingface.co/learn/llm-course",
              tag: "Curso Grátis",
              free: true,
            },
            {
              title: "Ollama — Modelos Open Source Locais",
              url: "https://ollama.com/",
              tag: "Open Source",
              free: true,
            },
            {
              title: "OpenRouter — Lista de Modelos Gratuitos",
              url: "https://openrouter.ai/models?ft=free",
              tag: "Free Tier",
              free: true,
            },
            {
              title: "Google AI Studio — Gemini API Grátis",
              url: "https://aistudio.google.com/",
              tag: "Free Tier",
              free: true,
            },
          ],
        },
        en: {
          name: "LLMs, Tokens & Models",
          level: "Beginner",
          summary:
            "Learn how tokens, context windows, and temperature affect quality and cost — and run open-weight models locally with Ollama or through free cloud API tiers.",
          callout: {
            title: "Can't run local models on your machine?",
            body: "No worries! If your computer doesn't have enough RAM/GPU for Ollama, generate a free API key and study in the cloud without a credit card:",
            links: [
              {
                label: "OpenRouter (:free models)",
                url: "https://openrouter.ai/models?ft=free",
                hint: "Create a free API key and use :free models or openrouter/free",
              },
              {
                label: "Google AI Studio (Gemini Free Tier)",
                url: "https://aistudio.google.com/",
                hint: "Generate a free API key for Gemini Flash / Flash-Lite models",
              },
            ],
          },
          video: {
            title: "[1hr Talk] Intro to Large Language Models",
            channel: "Andrej Karpathy",
            duration: "1h 00min",
            url: "https://www.youtube.com/watch?v=zjkBMFhNj_g",
          },
          resources: [
            {
              title: "Hugging Face LLM Course",
              url: "https://huggingface.co/learn/llm-course",
              tag: "Free Course",
              free: true,
            },
            {
              title: "Ollama — Local Open Source Models",
              url: "https://ollama.com/",
              tag: "Open Source",
              free: true,
            },
            {
              title: "OpenRouter Free Models",
              url: "https://openrouter.ai/models?ft=free",
              tag: "Free Tier",
              free: true,
            },
            {
              title: "Google AI Studio",
              url: "https://aistudio.google.com/",
              tag: "Free Tier",
              free: true,
            },
          ],
        },
      },
      {
        id: "n3",
        code: "1.3",
        time: "2h",
        parents: ["n0"],
        pt: {
          name: "Prompts & Structured Output",
          level: "Iniciante",
          summary:
            "Trate prompts como código: system prompts claros, few-shot e saídas estruturadas em JSON Schema para eliminar respostas quebradas na integração com o sistema.",
          practice: {
            text: "Crie uma API FastAPI que recebe um texto de e-mail ou nota fiscal bagunçada, chama um modelo (Ollama local, OpenRouter :free ou Google AI Studio) e devolve um JSON validado em Pydantic com categoria, prioridade e resumo.",
            uses: "Combina: 1.1 Python/FastAPI + 1.2 LLM (Ollama/OpenRouter/Gemini) + 1.3 Structured Output",
          },
          video: {
            title: "Prompt Engineering Tutorial — Master ChatGPT & LLM Responses",
            channel: "freeCodeCamp.org",
            duration: "42 min",
            url: "https://www.youtube.com/watch?v=_ZvnD73m40o",
          },
          resources: [
            {
              title: "OpenAI Academy — Builders Resources",
              url: "https://academy.openai.com/",
              tag: "Curso Grátis",
              free: true,
            },
            {
              title: "Prompt Engineering Guide (Open Source)",
              url: "https://www.promptingguide.ai/",
              tag: "Open Source",
              free: true,
            },
          ],
        },
        en: {
          name: "Prompts & Structured Output",
          level: "Beginner",
          summary:
            "Treat prompts like code: clear system instructions, few-shot examples, and strict JSON Schema outputs so your backend never breaks on malformed text.",
          practice: {
            text: "Build a FastAPI endpoint that receives a messy email or invoice text, calls an LLM (local Ollama, OpenRouter :free, or Google AI Studio), and returns a Pydantic-validated JSON with category, priority, and summary.",
            uses: "Combines: 1.1 Python/FastAPI + 1.2 LLM + 1.3 Structured Output",
          },
          video: {
            title: "Prompt Engineering Tutorial — Master ChatGPT & LLM Responses",
            channel: "freeCodeCamp.org",
            duration: "42 min",
            url: "https://www.youtube.com/watch?v=_ZvnD73m40o",
          },
          resources: [
            {
              title: "OpenAI Academy",
              url: "https://academy.openai.com/",
              tag: "Free Course",
              free: true,
            },
            {
              title: "Prompt Engineering Guide",
              url: "https://www.promptingguide.ai/",
              tag: "Open Source",
              free: true,
            },
          ],
        },
      },
    ],
  },
  {
    id: "t2",
    label: { pt: "02 · RAG & Dados", en: "02 · RAG & Data" },
    nodes: [
      {
        id: "n4",
        code: "2.1",
        time: "3h",
        parents: ["n1", "n2"],
        pt: {
          name: "Embeddings & Vector DBs",
          level: "Intermediário",
          summary:
            "Aprenda a fatiar documentos (chunking), gerar embeddings open source e indexar em bancos vetoriais como pgvector (PostgreSQL), Qdrant ou Chroma.",
          video: {
            title: "RAG From Scratch: Part 1 (Overview)",
            channel: "LangChain",
            duration: "20 min",
            url: "https://www.youtube.com/watch?v=wd7TZ4w1mSw",
          },
          resources: [
            {
              title: "Qdrant Documentation & Vector Search",
              url: "https://qdrant.tech/documentation/",
              tag: "Open Source",
              free: true,
            },
            {
              title: "pgvector — Busca vetorial no PostgreSQL",
              url: "https://github.com/pgvector/pgvector",
              tag: "Open Source",
              free: true,
            },
          ],
        },
        en: {
          name: "Embeddings & Vector DBs",
          level: "Intermediate",
          summary:
            "Learn how to chunk documents, generate open-source embeddings, and index them in vector databases like pgvector (PostgreSQL), Qdrant, or Chroma.",
          video: {
            title: "RAG From Scratch: Part 1 (Overview)",
            channel: "LangChain",
            duration: "20 min",
            url: "https://www.youtube.com/watch?v=wd7TZ4w1mSw",
          },
          resources: [
            {
              title: "Qdrant Documentation",
              url: "https://qdrant.tech/documentation/",
              tag: "Open Source",
              free: true,
            },
            {
              title: "pgvector for PostgreSQL",
              url: "https://github.com/pgvector/pgvector",
              tag: "Open Source",
              free: true,
            },
          ],
        },
      },
      {
        id: "n5",
        code: "2.2",
        time: "3h",
        parents: ["n2", "n3"],
        pt: {
          name: "RAG Híbrido & Re-ranking",
          level: "Intermediário",
          summary:
            "Saia do RAG básico combinando busca lexical (BM25) + busca vetorial + re-rankers open source (como BGE-Reranker) para colocar o trecho exato no topo do contexto.",
          practice: {
            text: "Suba um assistente de documentação técnica (PDFs ou docs do seu trabalho) usando pgvector ou Qdrant com busca híbrida e citações da página de origem em cada resposta.",
            uses: "Combina: 1.1 FastAPI + 1.3 Structured Output + 2.1 Vector DB + 2.2 Hybrid Search",
          },
          video: {
            title: "AI Engineering: The Complete RAG Course 2026 From Scratch",
            channel: "HeroDev",
            duration: "Curso completo",
            url: "https://www.youtube.com/watch?v=ZvY0JAaTuJ0",
          },
          resources: [
            {
              title: "Hugging Face Cookbook — Advanced RAG",
              url: "https://huggingface.co/learn/cookbook/index",
              tag: "Open Source",
              free: true,
            },
            {
              title: "OpenAI Academy — Builders",
              url: "https://academy.openai.com/",
              tag: "Curso Grátis",
              free: true,
            },
          ],
        },
        en: {
          name: "Hybrid RAG & Re-ranking",
          level: "Intermediate",
          summary:
            "Go beyond naive RAG by combining lexical search (BM25) + dense vectors + open-source re-rankers (such as BGE-Reranker) to surface the exact right chunks.",
          practice: {
            text: "Build a technical docs assistant (PDFs or work docs) using pgvector or Qdrant with hybrid search and source-page citations in every answer.",
            uses: "Combines: 1.1 FastAPI + 1.3 Structured Output + 2.1 Vector DB + 2.2 Hybrid Search",
          },
          video: {
            title: "AI Engineering: The Complete RAG Course 2026 From Scratch",
            channel: "HeroDev",
            duration: "Full course",
            url: "https://www.youtube.com/watch?v=ZvY0JAaTuJ0",
          },
          resources: [
            {
              title: "Hugging Face Cookbook — Advanced RAG",
              url: "https://huggingface.co/learn/cookbook/index",
              tag: "Open Source",
              free: true,
            },
            {
              title: "OpenAI Academy",
              url: "https://academy.openai.com/",
              tag: "Free Course",
              free: true,
            },
          ],
        },
      },
      {
        id: "n6",
        code: "2.3",
        time: "2h 30m",
        parents: ["n3"],
        pt: {
          name: "LangChain na Prática",
          level: "Intermediário",
          summary:
            "Use LangChain de forma pragmática: loaders, retrievers, tool binding e abstrações padronizadas para trocar provedores de LLM (OpenRouter, Gemini, Ollama) sem reescrever sua base.",
          video: {
            title: "Learn RAG From Scratch — Python AI Tutorial from a LangChain Engineer",
            channel: "freeCodeCamp.org",
            duration: "2h 30min",
            url: "https://www.youtube.com/watch?v=sVcwVQRHIc8",
          },
          resources: [
            {
              title: "LangChain Academy (Gratuito)",
              url: "https://academy.langchain.com/",
              tag: "Curso Grátis",
              free: true,
            },
            {
              title: "LangChain Docs — Open Source",
              url: "https://python.langchain.com/docs/introduction/",
              tag: "Open Source",
              free: true,
            },
          ],
        },
        en: {
          name: "LangChain in Practice",
          level: "Intermediate",
          summary:
            "Use LangChain pragmatically: document loaders, retrievers, tool binding, and unified model interfaces so you can swap providers (OpenRouter, Gemini, Ollama) cleanly.",
          video: {
            title: "Learn RAG From Scratch — Python AI Tutorial from a LangChain Engineer",
            channel: "freeCodeCamp.org",
            duration: "2h 30min",
            url: "https://www.youtube.com/watch?v=sVcwVQRHIc8",
          },
          resources: [
            {
              title: "LangChain Academy",
              url: "https://academy.langchain.com/",
              tag: "Free Course",
              free: true,
            },
            {
              title: "LangChain Docs",
              url: "https://python.langchain.com/docs/introduction/",
              tag: "Open Source",
              free: true,
            },
          ],
        },
      },
    ],
  },
  {
    id: "t3",
    label: { pt: "03 · Agentes & MCP", en: "03 · Agents & MCP" },
    nodes: [
      {
        id: "n7",
        code: "3.1",
        time: "2h 30m",
        parents: ["n4", "n6"],
        pt: {
          name: "Tools & Memória",
          level: "Intermediário",
          summary:
            "Dê mãos ao LLM com Tool Calling e memória de curto/longo prazo — e saiba decidir quando um workflow simples vence um agente autônomo em custo e previsibilidade.",
          video: {
            title: "Agentic AI — Complete Course for Beginners",
            channel: "freeCodeCamp.org",
            duration: "Curso completo",
            url: "https://www.youtube.com/watch?v=Zy7EXDONlTY",
          },
          resources: [
            {
              title: "Hugging Face AI Agents Course (Gratuito)",
              url: "https://huggingface.co/learn/agents-course",
              tag: "Curso Grátis",
              free: true,
            },
            {
              title: "Building Effective Agents (Anthropic)",
              url: "https://www.anthropic.com/engineering/building-effective-agents",
              tag: "Leitura Base",
              free: true,
            },
          ],
        },
        en: {
          name: "Tools & Memory",
          level: "Intermediate",
          summary:
            "Give LLMs hands with Tool Calling and short/long-term memory — and learn when a deterministic workflow beats an autonomous agent on cost and reliability.",
          video: {
            title: "Agentic AI — Complete Course for Beginners",
            channel: "freeCodeCamp.org",
            duration: "Full course",
            url: "https://www.youtube.com/watch?v=Zy7EXDONlTY",
          },
          resources: [
            {
              title: "Hugging Face AI Agents Course",
              url: "https://huggingface.co/learn/agents-course",
              tag: "Free Course",
              free: true,
            },
            {
              title: "Building Effective Agents (Anthropic)",
              url: "https://www.anthropic.com/engineering/building-effective-agents",
              tag: "Core Reading",
              free: true,
            },
          ],
        },
      },
      {
        id: "n8",
        code: "3.2",
        time: "4h",
        parents: ["n5", "n6"],
        pt: {
          name: "LangGraph & Multiagentes",
          level: "Avançado",
          summary:
            "Modele agentes como grafos com estado tipado, loops de autocorreção, persistência de conversa em banco e Human-in-the-Loop para aprovar ações críticas.",
          practice: {
            text: "Monte um fluxo multiagente no LangGraph com 2 especialistas: um agente consulta sua base RAG da Fase 2 e outro redige/valida a resposta, pausando para aprovação humana antes de executar uma ação externa.",
            uses: "Combina: 2.2 RAG Híbrido + 2.3 LangChain + 3.1 Tools + 3.2 LangGraph HITL",
          },
          video: {
            title: "LangGraph Complete Course for Beginners — Complex AI Agents",
            channel: "freeCodeCamp.org",
            duration: "~3h",
            url: "https://www.youtube.com/watch?v=jGg_1h0qzaM",
          },
          resources: [
            {
              title: "DataCamp — Sistemas Multiagentes com LangGraph (Grátis)",
              url: "https://www.datacamp.com/",
              tag: "Curso Grátis",
              free: true,
            },
            {
              title: "LangChain Academy — Introduction to LangGraph",
              url: "https://academy.langchain.com/",
              tag: "Curso Grátis",
              free: true,
            },
            {
              title: "LangGraph Open Source Docs",
              url: "https://langchain-ai.github.io/langgraph/",
              tag: "Open Source",
              free: true,
            },
          ],
        },
        en: {
          name: "LangGraph & Multi-Agents",
          level: "Advanced",
          summary:
            "Model agents as typed state graphs with self-correction loops, database checkpointers, and Human-in-the-Loop interrupts for sensitive actions.",
          practice: {
            text: "Build a multi-agent LangGraph workflow with 2 specialists: one queries your Phase 2 hybrid RAG index and the other drafts/validates the output, pausing for human approval before executing an external action.",
            uses: "Combines: 2.2 Hybrid RAG + 2.3 LangChain + 3.1 Tools + 3.2 LangGraph HITL",
          },
          video: {
            title: "LangGraph Complete Course for Beginners — Complex AI Agents",
            channel: "freeCodeCamp.org",
            duration: "~3h",
            url: "https://www.youtube.com/watch?v=jGg_1h0qzaM",
          },
          resources: [
            {
              title: "DataCamp — Multi-Agent Systems with LangGraph (Free)",
              url: "https://www.datacamp.com/",
              tag: "Free Course",
              free: true,
            },
            {
              title: "LangChain Academy — Introduction to LangGraph",
              url: "https://academy.langchain.com/",
              tag: "Free Course",
              free: true,
            },
            {
              title: "LangGraph Open Source Docs",
              url: "https://langchain-ai.github.io/langgraph/",
              tag: "Open Source",
              free: true,
            },
          ],
        },
      },
      {
        id: "n9",
        code: "3.3",
        time: "2h",
        parents: ["n6"],
        pt: {
          name: "Model Context Protocol (MCP)",
          level: "Avançado",
          summary:
            "Adote o padrão aberto MCP para expor bancos de dados, arquivos e APIs internas como ferramentas padronizadas que qualquer agente pode consumir com segurança.",
          practice: {
            text: "Construa um MCP Server próprio (somente leitura) conectado a um banco SQLite ou PostgreSQL local e conecte seu agente LangGraph a ele via langchain-mcp-adapters.",
            uses: "Combina: 1.1 APIs + 3.2 LangGraph + 3.3 MCP Server",
          },
          video: {
            title: "Intro to MCP Servers — Model Context Protocol with Python Course",
            channel: "freeCodeCamp.org",
            duration: "Curso completo",
            url: "https://www.youtube.com/watch?v=DosHnyq78xY",
          },
          resources: [
            {
              title: "MCP Official Specification & Quickstart",
              url: "https://modelcontextprotocol.io/",
              tag: "Open Source",
              free: true,
            },
            {
              title: "LangChain MCP Adapters (GitHub)",
              url: "https://github.com/langchain-ai/langchain-mcp-adapters",
              tag: "Open Source",
              free: true,
            },
          ],
        },
        en: {
          name: "Model Context Protocol (MCP)",
          level: "Advanced",
          summary:
            "Adopt the open MCP standard to expose databases, files, and internal APIs as standardized tools that any agent can safely consume.",
          practice: {
            text: "Build your own read-only MCP Server backed by a local SQLite or PostgreSQL database and connect it to your LangGraph agent using langchain-mcp-adapters.",
            uses: "Combines: 1.1 APIs + 3.2 LangGraph + 3.3 MCP Server",
          },
          video: {
            title: "Intro to MCP Servers — Model Context Protocol with Python Course",
            channel: "freeCodeCamp.org",
            duration: "Full course",
            url: "https://www.youtube.com/watch?v=DosHnyq78xY",
          },
          resources: [
            {
              title: "MCP Official Specification & Quickstart",
              url: "https://modelcontextprotocol.io/",
              tag: "Open Source",
              free: true,
            },
            {
              title: "LangChain MCP Adapters (GitHub)",
              url: "https://github.com/langchain-ai/langchain-mcp-adapters",
              tag: "Open Source",
              free: true,
            },
          ],
        },
      },
    ],
  },
  {
    id: "t4",
    label: { pt: "04 · Produção & Evals", en: "04 · Production & Evals" },
    nodes: [
      {
        id: "n10",
        code: "4.1",
        time: "2h 30m",
        parents: ["n7", "n8"],
        pt: {
          name: "Observabilidade (Langfuse)",
          level: "Avançado",
          summary:
            "Rastreie cada passo do LangGraph com Langfuse open source: visualize latência por nó, consumo de tokens, custo por sessão e versione prompts sem precisar fazer deploy.",
          practice: {
            text: "Suba o Langfuse via Docker (ou free tier), plugue o CallbackHandler no seu grafo LangGraph da Fase 3 e identifique qual nó está consumindo mais tokens e latência.",
            uses: "Combina: 3.2 LangGraph + 4.1 Langfuse Tracing",
          },
          video: {
            title: "AULA completa de OBSERVABILIDADE em SISTEMAS com LLMs usando LANGFUSE",
            channel: "Anwar Hermuche | Engenheiro de IA",
            duration: "Aula completa",
            url: "https://www.youtube.com/watch?v=UErl-MrETKg",
          },
          resources: [
            {
              title: "Langfuse Open Source & Self-Hosting Docs",
              url: "https://langfuse.com/docs",
              tag: "Open Source",
              free: true,
            },
            {
              title: "Langfuse + LangGraph Integration Guide",
              url: "https://langfuse.com/docs/integrations/langchain/example-python-langgraph",
              tag: "Guia Prático",
              free: true,
            },
          ],
        },
        en: {
          name: "Observability (Langfuse)",
          level: "Advanced",
          summary:
            "Trace every LangGraph step with open-source Langfuse: inspect per-node latency, token usage, cost per session, and version prompts without redeploying.",
          practice: {
            text: "Spin up Langfuse via Docker (or free cloud tier), attach CallbackHandler to your Phase 3 LangGraph workflow, and pinpoint which node spends the most tokens and time.",
            uses: "Combines: 3.2 LangGraph + 4.1 Langfuse Tracing",
          },
          video: {
            title: "Observing and Improving AI Agents with Langfuse",
            channel: "ClickHouse / Langfuse",
            duration: "Walkthrough",
            url: "https://www.youtube.com/watch?v=6A8_aahQ0nE",
          },
          resources: [
            {
              title: "Langfuse Open Source & Self-Hosting Docs",
              url: "https://langfuse.com/docs",
              tag: "Open Source",
              free: true,
            },
            {
              title: "Langfuse + LangGraph Integration Guide",
              url: "https://langfuse.com/docs/integrations/langchain/example-python-langgraph",
              tag: "Guide",
              free: true,
            },
          ],
        },
      },
      {
        id: "n11",
        code: "4.2",
        time: "3h",
        parents: ["n8", "n9"],
        pt: {
          name: "Evals & Segurança / Custo",
          level: "Avançado",
          summary:
            "Crie datasets de teste com Ragas / DeepEval e LLM-as-a-Judge para detectar regressões, proteja contra prompt injection e corte custos com roteamento de modelos e cache.",
          practice: {
            text: "Monte um dataset com 20 perguntas reais do seu RAG + Agente, rode uma avaliação automatizada de fidelidade (Ragas) enviando os scores para o Langfuse e teste rotear tarefas simples para um modelo menor comparando custo vs nota.",
            uses: "Combina: 2.2 RAG + 4.1 Langfuse + 4.2 Evals & Model Routing",
          },
          video: {
            title: "Observing and Improving AI Agents with Langfuse (Traces & Evals)",
            channel: "ClickHouse / Langfuse",
            duration: "Walkthrough",
            url: "https://www.youtube.com/watch?v=6A8_aahQ0nE",
          },
          resources: [
            {
              title: "Ragas — Open Source RAG & Agent Evaluation",
              url: "https://docs.ragas.io/",
              tag: "Open Source",
              free: true,
            },
            {
              title: "DeepEval — Pytest for LLMs",
              url: "https://docs.confident-ai.com/",
              tag: "Open Source",
              free: true,
            },
            {
              title: "Artigo do Lucas: Reduzir custo de IA em quase 90%",
              url: "/blog/reduzir-custo-de-ia-arquitetura-antes-do-modelo",
              tag: "Case Real",
              free: true,
            },
            {
              title: "OWASP Top 10 for LLM Applications",
              url: "https://genai.owasp.org/",
              tag: "Open Source",
              free: true,
            },
          ],
        },
        en: {
          name: "Evals, Security & Cost",
          level: "Advanced",
          summary:
            "Build test datasets with Ragas / DeepEval and LLM-as-a-Judge to catch regressions, defend against prompt injection, and cut costs via model routing and caching.",
          practice: {
            text: "Create a 20-question golden dataset for your RAG + Agent, run automated faithfulness evals (Ragas) logging scores to Langfuse, and benchmark routing triage steps to a smaller model.",
            uses: "Combines: 2.2 RAG + 4.1 Langfuse + 4.2 Evals & Model Routing",
          },
          video: {
            title: "Observing and Improving AI Agents with Langfuse (Traces & Evals)",
            channel: "ClickHouse / Langfuse",
            duration: "Walkthrough",
            url: "https://www.youtube.com/watch?v=6A8_aahQ0nE",
          },
          resources: [
            {
              title: "Ragas — Open Source Evaluation",
              url: "https://docs.ragas.io/",
              tag: "Open Source",
              free: true,
            },
            {
              title: "DeepEval — Pytest for LLMs",
              url: "https://docs.confident-ai.com/",
              tag: "Open Source",
              free: true,
            },
            {
              title: "OWASP Top 10 for LLM Applications",
              url: "https://genai.owasp.org/",
              tag: "Open Source",
              free: true,
            },
          ],
        },
      },
    ],
  },
  {
    id: "t5",
    label: { pt: "05 · Projeto Final", en: "05 · Capstone" },
    nodes: [
      {
        id: "n12",
        code: "★",
        capstone: true,
        time: "1–2 sem",
        parents: ["n10", "n11"],
        pt: {
          name: "Sistema Multiagente em Produção",
          level: "Capstone",
          summary:
            "Consolide toda a árvore em um projeto real de portfólio publicado no ar, com arquitetura documentada, custos medidos e avaliação automatizada.",
          practice: {
            text: "Publique um Assistente Multiagente em Docker reunindo toda a trilha: ingestão RAG híbrida (pgvector ou Qdrant) + 1 MCP Server próprio + orquestração LangGraph com aprovação humana + tracing no Langfuse + suíte de 20 evals rodando antes do deploy.",
            uses: "Integra toda a árvore: Fases 01 → 04 completas em produção",
          },
          video: {
            title: "AI Engineer Roadmap — How to Learn AI & Ship Real Systems",
            channel: "freeCodeCamp.org",
            duration: "Guia completo",
            url: "https://www.youtube.com/watch?v=nYXVvK-Wmn0",
          },
          resources: [
            {
              title: "Livro recomendado: Engenharia de IA (Chip Huyen)",
              url: "https://link.amazon/B01AZ5Ydc",
              tag: "Livro",
              free: false,
            },
            {
              title: "LangGraph + Langfuse Production Guide",
              url: "https://langfuse.com/guides",
              tag: "Open Source",
              free: true,
            },
          ],
        },
        en: {
          name: "Production Multi-Agent System",
          level: "Capstone",
          summary:
            "Bring the whole tree together in a real deployed portfolio project with documented architecture, measured token costs, and automated evals.",
          practice: {
            text: "Deploy a Dockerized Multi-Agent Assistant combining the full track: hybrid RAG (pgvector or Qdrant) + your own MCP Server + LangGraph orchestration with human approval + Langfuse tracing + a 20-case eval suite.",
            uses: "Integrates the full tree: Phases 01 → 04 in production",
          },
          video: {
            title: "AI Engineer Roadmap — How to Learn AI & Ship Real Systems",
            channel: "freeCodeCamp.org",
            duration: "Full guide",
            url: "https://www.youtube.com/watch?v=nYXVvK-Wmn0",
          },
          resources: [
            {
              title: "Recommended Book: AI Engineering (Chip Huyen)",
              url: "https://link.amazon/B01AZ5Ydc",
              tag: "Book",
              free: false,
            },
            {
              title: "LangGraph + Langfuse Production Guide",
              url: "https://langfuse.com/guides",
              tag: "Open Source",
              free: true,
            },
          ],
        },
      },
    ],
  },
];

export const ALL_ROADMAP_NODES = ROADMAP_TIERS.flatMap((tier) =>
  tier.nodes.map((node) => ({ ...node, tierId: tier.id })),
);

export const VALID_ROADMAP_NODE_IDS = new Set(ALL_ROADMAP_NODES.map((n) => n.id));
