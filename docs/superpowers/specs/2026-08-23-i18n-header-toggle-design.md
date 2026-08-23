# i18n com toggle de idioma no header (PT/EN)

Data: 2026-08-23

## Contexto

O portfólio é uma single-page app em Next.js App Router, hoje inteiramente em
português (PT-BR), sem nenhuma infraestrutura de internacionalização. O
objetivo é adicionar um toggle de idioma no `Header` que alterna entre
Português e Inglês, traduzindo todo o conteúdo estático do site e também o
conteúdo dinâmico de projetos (título/descrição), que vem do banco de dados
via `/upload`.

## Decisões

- **Sem roteamento por idioma.** O toggle é 100% client-side (Context React +
  `localStorage`), sem `/en` ou `/pt` na URL. As âncoras existentes
  (`#sobre`, `#habilidades`, `#projetos`, `#contato`) continuam como estão.
- **Idioma padrão é sempre PT-BR** na primeira visita, independente do
  navegador do visitante. O usuário troca manualmente.
- **Tradução dos projetos (banco de dados) é automática**, usando a API
  gratuita **MyMemory** (sem chave de API), disparada apenas ao criar ou
  editar um projeto em `/upload`. O resultado é persistido no banco
  (colunas `titleEn`/`descriptionEn`), não é recalculado a cada visita.

## Arquitetura

### 1. Provider de idioma

- `src/i18n/LocaleProvider.tsx` (client component): Context React expondo
  `{ locale: 'pt' | 'en', setLocale }`.
  - Estado inicial sempre `'pt'`.
  - Após montar, lê `localStorage.getItem('locale')` e aplica se houver valor
    salvo (`'pt'` ou `'en'`).
  - `setLocale` atualiza o estado e grava em `localStorage`.
- `src/i18n/useLocale.ts`: hook `useLocale()` que consome o Context.
- `LocaleProvider` envolve `{children}` em `src/app/layout.tsx` (dentro do
  `<body>`, ao redor de `Header`, `children` e `Footer`).

### 2. Dicionários de conteúdo estático

- `src/i18n/dictionaries/pt.ts` e `src/i18n/dictionaries/en.ts`: objetos TS
  aninhados por seção (`header`, `hero`, `about`, `skills`, `contact`,
  `footer`), cobrindo todo texto fixo hoje hardcoded nesses componentes
  (títulos, parágrafos, labels de botão, `aria-label`, textos de link).
- `src/i18n/dictionaries/index.ts`: exporta `dictionaries = { pt, en }` e o
  tipo `Dictionary` (derivado de `typeof pt`), garantindo que `en` não pode
  ficar com chave faltando.

### 3. Componentes de UI

- `Header`, `Hero`, `Skills`, `Contact`, `Footer`, `About`: passam a chamar
  `useLocale()` e ler `dictionaries[locale]`. `About` e `Footer` (hoje sem
  `"use client"`) ganham a diretiva, ficando consistentes com os demais.
- `Header`: novo botão de toggle PT/EN, presente no nav desktop e no menu
  mobile. Alterna `locale` via `setLocale`. Estado ativo indicado
  visualmente (ex.: texto do idioma atual em destaque).

### 4. Projetos (conteúdo dinâmico do banco)

- `Projects.tsx` continua Server Component assíncrono, responsável só por
  buscar os dados (`getPortfolioProjects`) e filtrar publicados.
- Novo `src/components/ProjectsClient.tsx` (client component) recebe a lista
  de projetos como prop, usa `useLocale()` para:
  - Traduzir os textos fixos da seção (título "Projetos", mensagem de lista
    vazia) via dicionário.
  - Escolher `project.titleEn ?? project.title` e
    `project.descriptionEn ?? project.description` quando `locale === 'en'`.
- `Projects.tsx` renderiza `<ProjectsClient projects={projects} />`.

### 5. Schema e tradução automática

- Migration Prisma: adicionar `titleEn String?` e `descriptionEn String?`
  (nullable) ao model `PortfolioProject`, mapeados para `title_en` e
  `description_en`.
- `src/lib/translate.ts`: `translateText(text: string): Promise<string | null>`
  - Chama `https://api.mymemory.translated.net/get?q=<texto>&langpair=pt|en`.
  - Em caso de erro de rede, resposta malformada, ou rate-limit: captura o
    erro, loga e retorna `null`. Nunca lança exceção para quem chamou —
    tradução é best-effort, não pode bloquear o salvamento do projeto.
- `createPortfolioProject` (`src/lib/projects.ts`): após montar o payload,
  chama `translateText` para `title` e `description` em paralelo
  (`Promise.all`) e inclui `titleEn`/`descriptionEn` no `create`.
- `updatePortfolioProject`: busca o registro atual antes de atualizar.
  Compara `title`/`description` novos com os salvos:
  - Se `title` mudou → re-traduz e atualiza `titleEn`.
  - Se `description` mudou → re-traduz e atualiza `descriptionEn`.
  - Se nenhum dos dois mudou → mantém `titleEn`/`descriptionEn` existentes,
    sem chamar a API.
- Script de backfill (`prisma/backfill-translations.js`, execução manual
  única): busca todos os `PortfolioProject` com `titleEn` ou
  `descriptionEn` nulos e preenche via `translateText`.
- Tipos (`src/types/index.ts`): `PortfolioProject` ganha `titleEn: string |
  null` e `descriptionEn: string | null`. `NewPortfolioProjectInput` não
  precisa desses campos (são calculados no backend, não vêm do formulário).

## Tratamento de erros

- Falha na tradução (MyMemory fora do ar, rate-limit, texto vazio) nunca
  impede criar/editar um projeto — apenas deixa `titleEn`/`descriptionEn`
  como `null`, e o front cai para o texto em PT ao renderizar em EN.
- `localStorage` indisponível (modo privado, SSR) — leitura/escrita
  envolvida em try/catch; sem `localStorage`, o idioma simplesmente não
  persiste entre sessões, mas a página funciona normalmente em PT.

## Testes / verificação

- Alternar o toggle PT/EN e confirmar que todo texto estático das seções
  (Header, Hero, About, Skills, Contact, Footer) muda corretamente.
- Criar um projeto novo via `/upload` e confirmar que `titleEn`/
  `descriptionEn` são preenchidos no banco.
- Editar apenas a URL/tecnologias de um projeto existente (sem tocar em
  título/descrição) e confirmar que `titleEn`/`descriptionEn` NÃO mudam
  (sem chamada desnecessária à API).
- Editar o título de um projeto existente e confirmar que só `titleEn` é
  re-traduzido.
- Rodar o script de backfill e confirmar que projetos antigos sem tradução
  passam a ter `titleEn`/`descriptionEn`.
- Carregar o site em uma aba anônima (sem `localStorage`) e confirmar que
  abre em PT-BR.
- `npm run lint` e `npm run build` passando.

## Fora de escopo

- Rotas por idioma (`/en`, `/pt`) e SEO multi-idioma (`hreflang`, sitemap
  por idioma).
- Detecção automática do idioma do navegador.
- Troca do provedor de tradução para DeepL ou outro serviço pago (pode ser
  revisitado depois se a qualidade do MyMemory for insuficiente).
