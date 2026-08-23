# i18n com toggle de idioma no header (PT/EN) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar um toggle de idioma PT/EN no header, traduzir todo o conteúdo estático do site e traduzir automaticamente (via API MyMemory) título/descrição dos projetos cadastrados no banco.

**Architecture:** Context React client-side (`LocaleProvider` + `useLocale`) com estado persistido em `localStorage`, sem roteamento por idioma. Dicionários estáticos por seção em `src/i18n/dictionaries`. Conteúdo dinâmico de projetos ganha colunas `titleEn`/`descriptionEn` no banco, preenchidas automaticamente ao criar/editar um projeto via chamada à API gratuita MyMemory.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Prisma 6, Tailwind CSS. Sem dependências novas — tradução via `fetch` direto à API pública MyMemory (sem SDK).

**Spec:** `docs/superpowers/specs/2026-08-23-i18n-header-toggle-design.md`

## Global Constraints

- Sem roteamento por idioma (`/en`, `/pt`) — toggle 100% client-side, âncoras (`#sobre`, `#habilidades`, `#projetos`, `#contato`) inalteradas.
- Idioma padrão sempre `"pt"` na primeira visita (sem detecção de navegador).
- Tradução de projetos usa a API MyMemory (`https://api.mymemory.translated.net/get`), sem chave de API.
- Falha de tradução (rede, rate-limit) nunca bloqueia criar/editar projeto — resultado `null`, fallback pro texto em PT na renderização.
- `updatePortfolioProject` só re-traduz `title`/`description` que realmente mudaram em relação ao registro atual no banco.
- Não há framework de testes configurado neste repositório (sem Jest/Vitest) — verificação é via `npm run lint`, `npm run build` e checagem manual, não TDD automatizado.
- Este repositório usa `prisma db push` (não `prisma migrate`) para aplicar mudanças de schema — não existe pasta `prisma/migrations`.

---

### Task 1: Fundação de i18n — dicionários, LocaleProvider e useLocale

**Files:**
- Create: `src/i18n/dictionaries/pt.ts`
- Create: `src/i18n/dictionaries/en.ts`
- Create: `src/i18n/dictionaries/index.ts`
- Create: `src/i18n/LocaleProvider.tsx`
- Create: `src/i18n/useLocale.ts`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: `Locale = "pt" | "en"` (tipo, exportado de `src/i18n/dictionaries/index.ts`); `dictionaries: Record<Locale, Dictionary>`; `useLocale(): { locale: Locale; setLocale: (l: Locale) => void; t: Dictionary }` (de `src/i18n/useLocale.ts`); `LocaleProvider({ children }: { children: ReactNode })` (de `src/i18n/LocaleProvider.tsx`).

- [ ] **Step 1: Criar o dicionário em português**

Criar `src/i18n/dictionaries/pt.ts`:

```ts
const pt = {
  header: {
    nav: {
      about: "Sobre",
      skills: "Habilidades",
      projects: "Projetos",
      contact: "Contato",
    },
    openMenu: "Abrir menu de navegação",
    closeMenu: "Fechar menu de navegação",
    langToggleLabel: "Mudar idioma para inglês",
  },
  hero: {
    greeting: "Oi, Sou Lucas Santos",
    titleLine1: "Desenvolvedor",
    titleLine2: "Full-Stack",
    subtitle:
      "Apaixonado por criar aplicações web inovadoras e fáceis de usar.",
    ctaWhatsapp: "Fale comigo",
    ctaWhatsappAria: "Entrar em contato via WhatsApp",
    whatsappMessage: "Olá vim do seu portifólio",
    ctaResume: "Baixar curriculo",
    ctaResumeAria: "Baixar currículo em PDF",
  },
  about: {
    title: "Sobre mim",
    paragraph:
      "Sou desenvolvedor full stack com visão de negócio. Antes de pensar em código, penso em resultado: mais clientes, mais eficiência e mais faturamento. Cada projeto que entrego tem um objetivo claro — gerar valor real. Minha experiência com empreendedorismo me ensinou uma coisa: tecnologia só faz sentido quando resolve problemas de verdade. Por isso, meu foco está em criar sistemas inteligentes, automatizar processos e eliminar tarefas manuais que travam o crescimento. Trabalho com tecnologias modernas e integrações avançadas (como automações e fluxos inteligentes) para transformar operações comuns em máquinas eficientes e escaláveis.",
  },
  skills: {
    title: "Habilidades",
  },
  projects: {
    title: "Projetos",
    empty:
      "Nenhum projeto publicado ainda. Acesse /upload para adicionar ou publicar um projeto.",
    viewProject: "Ver projeto",
  },
  contact: {
    title: "Entre em Contato",
    subtitle:
      "Estou sempre aberto a novas oportunidades e colaborações. Vamos conversar sobre como posso ajudar no seu próximo projeto!",
    infoTitle: "Informações",
    emailLabel: "Email",
    whatsappLabel: "WhatsApp",
    githubLabel: "GitHub",
    socialTitle: "Redes Sociais",
    linkedinDesc: "Conecte-se profissionalmente",
    githubDesc: "Veja meus projetos",
    whatsappDesc: "Mensagem direta",
    ctaText: "Tem um projeto em mente?",
    ctaButton: "Vamos Conversar!",
    emailSubject: "Proposta de Projeto",
    emailBody: "Olá Lucas! Gostaria de conversar sobre um projeto.",
  },
  footer: {
    role: "Desenvolvedor Fullstack",
    socialTitle: "Redes sociais",
    linkedinAria: "Visitar perfil no LinkedIn",
    githubAria: "Visitar perfil no GitHub",
    whatsappAria: "Entrar em contato via WhatsApp",
    developedBy: "Desenvolvido por",
  },
} as const;

export type Dictionary = typeof pt;

export default pt;
```

- [ ] **Step 2: Criar o dicionário em inglês**

Criar `src/i18n/dictionaries/en.ts`:

```ts
import type { Dictionary } from "./pt";

const en: Dictionary = {
  header: {
    nav: {
      about: "About",
      skills: "Skills",
      projects: "Projects",
      contact: "Contact",
    },
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
    langToggleLabel: "Switch language to Portuguese",
  },
  hero: {
    greeting: "Hi, I'm Lucas Santos",
    titleLine1: "Full-Stack",
    titleLine2: "Developer",
    subtitle: "Passionate about building innovative, easy-to-use web apps.",
    ctaWhatsapp: "Talk to me",
    ctaWhatsappAria: "Contact via WhatsApp",
    whatsappMessage: "Hi, I found your portfolio",
    ctaResume: "Download resume",
    ctaResumeAria: "Download resume as PDF",
  },
  about: {
    title: "About me",
    paragraph:
      "I'm a full stack developer with a business mindset. Before writing code, I think about outcomes: more customers, more efficiency, more revenue. Every project I deliver has a clear goal — generating real value. My experience with entrepreneurship taught me one thing: technology only makes sense when it solves real problems. That's why I focus on building smart systems, automating processes, and removing the manual tasks that hold growth back. I work with modern technologies and advanced integrations (like automations and intelligent workflows) to turn everyday operations into efficient, scalable machines.",
  },
  skills: {
    title: "Skills",
  },
  projects: {
    title: "Projects",
    empty: "No projects published yet. Go to /upload to add or publish a project.",
    viewProject: "View project",
  },
  contact: {
    title: "Get in Touch",
    subtitle:
      "I'm always open to new opportunities and collaborations. Let's talk about how I can help with your next project!",
    infoTitle: "Information",
    emailLabel: "Email",
    whatsappLabel: "WhatsApp",
    githubLabel: "GitHub",
    socialTitle: "Social Media",
    linkedinDesc: "Connect professionally",
    githubDesc: "See my projects",
    whatsappDesc: "Direct message",
    ctaText: "Have a project in mind?",
    ctaButton: "Let's Talk!",
    emailSubject: "Project Proposal",
    emailBody: "Hi Lucas! I'd like to talk about a project.",
  },
  footer: {
    role: "Fullstack Developer",
    socialTitle: "Social media",
    linkedinAria: "Visit LinkedIn profile",
    githubAria: "Visit GitHub profile",
    whatsappAria: "Contact via WhatsApp",
    developedBy: "Developed by",
  },
};

export default en;
```

- [ ] **Step 3: Criar o índice de dicionários e o tipo `Locale`**

Criar `src/i18n/dictionaries/index.ts`:

```ts
import pt, { type Dictionary } from "./pt";
import en from "./en";

export type Locale = "pt" | "en";

export const dictionaries: Record<Locale, Dictionary> = { pt, en };

export type { Dictionary };
```

- [ ] **Step 4: Criar o `LocaleProvider`**

Criar `src/i18n/LocaleProvider.tsx`:

```tsx
"use client";

import React, { createContext, useEffect, useState, type ReactNode } from "react";
import { type Locale } from "./dictionaries";

const STORAGE_KEY = "locale";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "pt" || stored === "en") {
        setLocaleState(stored);
      }
    } catch {
      // localStorage indisponível (ex.: modo privado) — mantém o padrão "pt"
    }
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignora falha ao persistir
    }
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}
```

- [ ] **Step 5: Criar o hook `useLocale`**

Criar `src/i18n/useLocale.ts`:

```ts
"use client";

import { useContext } from "react";
import { LocaleContext } from "./LocaleProvider";
import { dictionaries } from "./dictionaries";

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale deve ser usado dentro de um LocaleProvider");
  }
  const t = dictionaries[ctx.locale];
  return { locale: ctx.locale, setLocale: ctx.setLocale, t };
}
```

- [ ] **Step 6: Envolver o app com `LocaleProvider` em `layout.tsx`**

Editar `src/app/layout.tsx`: importar `LocaleProvider` de `@/i18n/LocaleProvider` e envolver `<Header />{children}<Footer />` com ele, dentro do `<body>`:

```tsx
import { LocaleProvider } from "@/i18n/LocaleProvider";
```

```tsx
            <body
                className={`${spaceGrotesk.variable} antialiased`}
            >
                <noscript dangerouslySetInnerHTML={{
                    __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PBF5N76D" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
                }} />
                <LocaleProvider>
                    <Header />
                    {children}
                    <Footer />
                </LocaleProvider>
            </body>
```

- [ ] **Step 7: Verificar que o projeto ainda builda**

Run: `npm run build`
Expected: build concluído sem erros de tipo. A UI ainda está toda em português hardcoded (os componentes serão migrados nas próximas tasks) — isso é esperado, só estamos validando que a fundação de i18n compila e não quebra o layout.

- [ ] **Step 8: Commit**

```bash
git add src/i18n src/app/layout.tsx
git commit -m "feat: add i18n foundation (dictionaries, LocaleProvider, useLocale)"
```

---

### Task 2: Header — toggle de idioma + tradução da navegação

**Files:**
- Modify: `src/components/Header.tsx`

**Interfaces:**
- Consumes: `useLocale()` de `@/i18n/useLocale` → `{ locale, setLocale, t }` (Task 1).

- [ ] **Step 1: Reescrever `Header.tsx` com tradução e botão de toggle**

Substituir o conteúdo de `src/components/Header.tsx`:

```tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { locale, setLocale, t } = useLocale();

    const toggleMenu = (): void => {
        setIsOpen(!isOpen);
    };

    const toggleLocale = (): void => {
        setLocale(locale === "pt" ? "en" : "pt");
    };

    const LangToggle = (
        <button
            onClick={toggleLocale}
            aria-label={t.header.langToggleLabel}
            className="flex items-center gap-1 text-sm font-medium tracking-wide"
        >
            <span className={locale === "pt" ? "text-[#F57D38]" : "text-white/60"}>PT</span>
            <span className="text-white/40">/</span>
            <span className={locale === "en" ? "text-[#F57D38]" : "text-white/60"}>EN</span>
        </button>
    );

    return (
        <header className="w-full text-white flex py-6 mb-4 lg:justify-center lg:py-7 border-b border-[#ffffff2c]">

            {/*menu mobile */}
            <nav className={`${isOpen ? "flex" : "hidden"} lg:hidden flex-col fixed inset-0 z-50 gap-10 bg-[#000000fa] items-center justify-center list-none text-2xl shadow-2xl transition-all duration-300`}>
                <li onClick={toggleMenu}>
                    <Link href={"#sobre"} className="hover:text-[#F57D38]">{t.header.nav.about}</Link>
                </li>
                <li onClick={toggleMenu}>
                    <Link href={"#habilidades"} className="hover:text-[#F57D38]">{t.header.nav.skills}</Link>
                </li>
                <li onClick={toggleMenu}>
                    <Link href={"#projetos"} className="hover:text-[#F57D38]">{t.header.nav.projects}</Link>
                </li>
                <li onClick={toggleMenu}>
                    <Link href={"#contato"} className="hover:text-[#F57D38]">{t.header.nav.contact}</Link>
                </li>
                <li>{LangToggle}</li>
            </nav>
            {/*Botão menu mobile */}
            <button
                onClick={toggleMenu}
                aria-label={isOpen ? t.header.closeMenu : t.header.openMenu}
                className="lg:hidden px-4 absolute right-4 top-2 z-[60]"
            >
                {isOpen ? (
                    <X size={32} />
                ) : (
                    <Menu size={32} />
                )}
            </button>

            {/*menu desktop */}
            <nav className="hidden list-none gap-10 lg:flex lg:items-center">
                <li className="hover:text-[#F57D38]">
                    <Link href={"#sobre"}>{t.header.nav.about}</Link>
                </li>
                <li className="hover:text-[#F57D38]">
                    <Link href={"#habilidades"}>{t.header.nav.skills}</Link>
                </li>
                <li className="hover:text-[#F57D38]">
                    <Link href={"#projetos"}>{t.header.nav.projects}</Link>
                </li>
                <li className="hover:text-[#F57D38]">
                    <Link href={"#contato"}>{t.header.nav.contact}</Link>
                </li>
                <li>{LangToggle}</li>
            </nav>
        </header>
    );
};

export default Header;
```

- [ ] **Step 2: Verificar manualmente**

Run: `npm run dev`
Abrir `http://localhost:3000`, clicar no toggle "PT / EN" no header (desktop e, redimensionando a janela, no menu mobile) e confirmar que os links de navegação alternam entre português e inglês. Parar o servidor depois (`Ctrl+C`).

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: sem erros.

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat: add language toggle and translate header nav"
```

---

### Task 3: Hero — tradução

**Files:**
- Modify: `src/components/Hero.tsx`

**Interfaces:**
- Consumes: `useLocale()` (Task 1).

- [ ] **Step 1: Reescrever `Hero.tsx` com tradução**

Substituir o conteúdo de `src/components/Hero.tsx`:

```tsx
"use client";

import React from "react";
import Image from "next/image";
import { MessageCircle, Download } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";

const Hero: React.FC = () => {
    const { t } = useLocale();

    const handleSubmit = (): void => {
        window.open(
            `https://wa.me/5522981073895?text=${encodeURIComponent(t.hero.whatsappMessage)}`,
            "_blank"
        );
    };

    return (
        <section className="mx-[20px]  lg:mx-32 lg:flex lg:flex-row-reverse lg:justify-between lg:pt-24 lg:pb-24 lg:items-center">

            <div className="flex justify-center">
                <Image
                    src={"/eu.png"}
                    alt="Foto"
                    width={284}
                    height={224}
                    className="animate-float lg:hidden"
                />

                <Image
                    src={"/eu.png"}
                    alt="Foto"
                    width={510}
                    height={224}
                    className="hidden lg:flex animate-float"
                />
            </div>

            <div className="flex flex-col items-center lg:items-start">
                <div className="mt-4 flex justify-center flex-col lg:text-left">
                    <h2 className="text-sm text-white lg:text-3xl">
                        {t.hero.greeting}
                    </h2>
                    <h1 className="text-2xl font-bold text-[#0A80ED] lg:text-5xl capitalize">
                        {t.hero.titleLine1} <br />{t.hero.titleLine2}
                    </h1>
                    <p className="text-sm font-light  text-[#979696] lg:text-2xl">
                        {t.hero.subtitle}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 mt-5  lg:mt-16">
                    <button
                        className=" text-sm flex items-center gap-2 px-10 py-4 rounded-full text-white bg-[#F57D38] cursor-pointer hover:scale-105 duration-300 hover:opacity-70 shadow-lg shadow-[#f57d383d]"
                        onClick={handleSubmit}
                        aria-label={t.hero.ctaWhatsappAria}
                    >
                        {t.hero.ctaWhatsapp}
                        <MessageCircle size={20} />
                    </button>

                    <a
                        href="/Lucas-Santos-Full-stack.pdf"
                        download
                        className="text-sm flex items-center gap-2 px-10 py-4 rounded-full text-white bg-[#0A80ED] cursor-pointer hover:scale-105 duration-300 hover:opacity-70 shadow-lg shadow-[#0a7fed46]"
                        aria-label={t.hero.ctaResumeAria}
                    >
                        {t.hero.ctaResume}
                        <Download size={20} />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
```

- [ ] **Step 2: Verificar manualmente**

Run: `npm run dev`
Confirmar que a seção Hero alterna corretamente entre PT e EN pelo toggle do header, incluindo o texto que seria enviado ao WhatsApp (inspecionar o `href`/comportamento do botão "Fale comigo"/"Talk to me" — não é necessário completar o envio). Parar o servidor depois.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: sem erros.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat: translate Hero section"
```

---

### Task 4: About — tradução (vira client component)

**Files:**
- Modify: `src/components/About.tsx`

**Interfaces:**
- Consumes: `useLocale()` (Task 1).

- [ ] **Step 1: Reescrever `About.tsx` com tradução**

Substituir o conteúdo de `src/components/About.tsx`:

```tsx
"use client";

import React from "react";
import Image from "next/image";
import { useLocale } from "@/i18n/useLocale";

const About: React.FC = () => {
  const { t } = useLocale();

  return (
    <section
      className="mt-20 text-white mx-5 lg:mx-32 lg:flex lg:justify-between lg:py-20 lg:items-center"
      id="sobre"
    >
      <div className="lg:w-[660px] ">
        <h2 className="text-[20px] mb-2 lg:text-[40px]">{t.about.title}</h2>
        <p className="font-light text-sm text-[#b0afaf] lg:text-[18px]">
          {t.about.paragraph}
        </p>
      </div>
      <div className="flex justify-center mt-5">
        <Image
          src={"/sobre.png"}
          alt="sobre"
          width={328}
          height={100}
          className="flex lg:hidden"
        />

        <Image
          src={"/sobre.png"}
          alt="sobre"
          width={402}
          height={100}
          className="hidden lg:flex"
        />
      </div>
    </section>
  );
};

export default About;
```

- [ ] **Step 2: Verificar manualmente**

Run: `npm run dev`
Confirmar que a seção "Sobre mim"/"About me" alterna corretamente pelo toggle. Parar o servidor depois.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: sem erros.

- [ ] **Step 4: Commit**

```bash
git add src/components/About.tsx
git commit -m "feat: translate About section"
```

---

### Task 5: Skills — tradução do título da seção

**Files:**
- Modify: `src/components/Skills.tsx`

**Interfaces:**
- Consumes: `useLocale()` (Task 1).

- [ ] **Step 1: Adicionar tradução ao título da seção**

Em `src/components/Skills.tsx`, adicionar o import e usar `t.skills.title` no lugar do texto fixo "Habilidades". Os nomes das tecnologias (`HTML5`, `React`, etc.) NÃO são traduzidos — são nomes próprios.

Editar o import:

```tsx
import React from 'react';
import CardSkills from './CardSkills';
import { useLocale } from '@/i18n/useLocale';
```

Dentro do componente, logo após `const iconSize = 64;`, adicionar:

```tsx
    const { t } = useLocale();
```

E trocar:

```tsx
                <h2 className='text-[20px] mb-[30px] lg:text-[40px] text-center'>Habilidades</h2>
```

por:

```tsx
                <h2 className='text-[20px] mb-[30px] lg:text-[40px] text-center'>{t.skills.title}</h2>
```

- [ ] **Step 2: Verificar manualmente**

Run: `npm run dev`
Confirmar que o título da seção Skills alterna entre "Habilidades" e "Skills" pelo toggle, e que o carrossel de tecnologias continua funcionando normalmente. Parar o servidor depois.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: sem erros.

- [ ] **Step 4: Commit**

```bash
git add src/components/Skills.tsx
git commit -m "feat: translate Skills section title"
```

---

### Task 6: Contact — tradução

**Files:**
- Modify: `src/components/Contact.tsx`

**Interfaces:**
- Consumes: `useLocale()` (Task 1).

- [ ] **Step 1: Reescrever `Contact.tsx` com tradução**

Substituir o conteúdo de `src/components/Contact.tsx`:

```tsx
"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from '@/i18n/useLocale';

const Contact: React.FC = () => {
    const { t } = useLocale();

    const mailtoHref = `https://mail.google.com/mail/?view=cm&to=homeoficelucas@gmail.com&su=${encodeURIComponent(t.contact.emailSubject)}&body=${encodeURIComponent(t.contact.emailBody)}`;

    return (
        <section className="my-20 mx-4 text-white mb-14 flex flex-col items-center lg:mx-32 lg:py-28" id="contato">

            <div className="text-center mb-12">
                <h2 className="text-[20px] mb-5 lg:text-[40px]">{t.contact.title}</h2>
                <p className="text-[#b0afaf] text-sm lg:text-base max-w-2xl">
                    {t.contact.subtitle}
                </p>
            </div>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Informações de Contato */}
                <div className="bg-[#ffffff4b] rounded-2xl p-8">
                    <h3 className="text-xl font-semibold mb-6 text-center">{t.contact.infoTitle}</h3>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-[#0980ec] p-3 rounded-full">
                                <Image
                                    src="/mail.png"
                                    alt="Email"
                                    width={24}
                                    height={24}
                                    className=""
                                />
                            </div>
                            <div>
                                <p className="text-sm text-[#b0afaf]">{t.contact.emailLabel}</p>
                                <p className="font-medium">homeoficelucas@gmail.com</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="bg-[#0980ec] p-3 rounded-full">
                                <Image
                                    src="/whatsapp.png"
                                    alt="WhatsApp"
                                    width={24}
                                    height={24}
                                    className=""
                                />
                            </div>
                            <div>
                                <p className="text-sm text-[#b0afaf]">{t.contact.whatsappLabel}</p>
                                <p className="font-medium">+55 (22) 98107-3895</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="bg-[#0980ec] p-3 rounded-full">
                                <Image
                                    src="/github.png"
                                    alt="GitHub"
                                    width={24}
                                    height={24}
                                    className=""
                                />
                            </div>
                            <div>
                                <p className="text-sm text-[#b0afaf]">{t.contact.githubLabel}</p>
                                <p className="font-medium">github.com/LucasSantos96</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Redes Sociais */}
                <div className="bg-[#ffffff4b] rounded-2xl p-8">
                    <h3 className="text-xl font-semibold mb-6 text-center">{t.contact.socialTitle}</h3>

                    <div className="space-y-4">
                        <a
                            href="https://www.linkedin.com/in/lucas-santos-de-oliveira-874497325/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 bg-[#ffffff1a] rounded-xl hover:bg-[#ffffff2a] transition-colors duration-300"
                        >
                            <Image
                                src="/linkedin.png"
                                alt="LinkedIn"
                                width={32}
                                height={32}
                                className=""
                            />
                            <div>
                                <p className="font-medium">LinkedIn</p>
                                <p className="text-sm text-[#b0afaf]">{t.contact.linkedinDesc}</p>
                            </div>
                        </a>

                        <a
                            href="https://github.com/LucasSantos96"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 bg-[#ffffff1a] rounded-xl hover:bg-[#ffffff2a] transition-colors duration-300"
                        >
                            <Image
                                src="/github.png"
                                alt="GitHub"
                                width={32}
                                height={32}
                                className=""
                            />
                            <div>
                                <p className="font-medium">GitHub</p>
                                <p className="text-sm text-[#b0afaf]">{t.contact.githubDesc}</p>
                            </div>
                        </a>

                        <a
                            href="https://wa.me/5522981073895"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 bg-[#ffffff1a] rounded-xl hover:bg-[#ffffff2a] transition-colors duration-300"
                        >
                            <Image
                                src="/whatsapp.png"
                                alt="WhatsApp"
                                width={32}
                                height={32}
                                className=""
                            />
                            <div>
                                <p className="font-medium">WhatsApp</p>
                                <p className="text-sm text-[#b0afaf]">{t.contact.whatsappDesc}</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-12">
                <p className="text-[#b0afaf] mb-4">{t.contact.ctaText}</p>
                <a
                    href={mailtoHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#0980ec] hover:bg-[#0659a6] text-white font-medium py-3 px-8 rounded-full transition-colors duration-300 cursor-pointer"
                >
                    {t.contact.ctaButton}
                </a>
            </div>

        </section>
    );
};

export default Contact;
```

- [ ] **Step 2: Verificar manualmente**

Run: `npm run dev`
Confirmar que a seção Contato/Contact alterna corretamente pelo toggle, incluindo o link final "Vamos Conversar!"/"Let's Talk!" (não é necessário completar o envio do e-mail). Parar o servidor depois.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: sem erros.

- [ ] **Step 4: Commit**

```bash
git add src/components/Contact.tsx
git commit -m "feat: translate Contact section"
```

---

### Task 7: Footer — tradução

**Files:**
- Modify: `src/components/Footer.tsx`

**Interfaces:**
- Consumes: `useLocale()` (Task 1).

- [ ] **Step 1: Reescrever `Footer.tsx` com tradução**

Substituir o conteúdo de `src/components/Footer.tsx`:

```tsx
"use client";

import React from 'react'

import Link from 'next/link'
import { Mail, Linkedin, Github } from 'lucide-react';
import { SiWhatsapp } from '@icons-pack/react-simple-icons';
import { useLocale } from '@/i18n/useLocale';

const Footer: React.FC = () => {
    const { t } = useLocale();

    return (
        <footer className='bg-[#00000080]'>
            <div className='flex flex-col lg:flex-row items-center lg:items-start lg:mx-[120px] mx-5 py-10 lg:py-14 justify-between gap-10 lg:gap-0'>
                <div className='flex flex-col items-center lg:items-start text-center lg:text-left'>
                    <h2 className='text-2xl text-[#fff] font-medium uppercase tracking-wider'>Lucas Santos</h2>
                    <p className='text-[#0980ec] font-light'>{t.footer.role}</p>

                    <div className='flex items-center gap-2 mt-4'>
                        <Mail
                            size={20}
                            className="text-white bg-[#ffffff20] p-1 rounded-full"
                        />
                        <p className='text-white text-sm font-light'>homeoficelucas@gmail.com</p>
                    </div>
                </div>
                <div className='flex flex-col items-center lg:items-start'>
                    <h2 className='text-2xl text-[#fff] font-light mb-4'>{t.footer.socialTitle}</h2>
                    <div className='flex gap-6'>
                        <a
                            href="https://www.linkedin.com/in/lucas-santos-de-oliveira-874497325/"
                            target='_blank'
                            aria-label={t.footer.linkedinAria}
                            className="hover:scale-110 transition-transform duration-300"
                        >
                            <Linkedin size={32} className="text-white hover:text-[#0A80ED]" />
                        </a>

                        <a
                            href="https://github.com/LucasSantos96"
                            target='_blank'
                            aria-label={t.footer.githubAria}
                            className="hover:scale-110 transition-transform duration-300"
                        >
                            <Github size={32} className="text-white hover:text-[#0A80ED]" />
                        </a>

                        <a
                            href="https://wa.me/5522981073895"
                            target='_blank'
                            aria-label={t.footer.whatsappAria}
                            className="hover:scale-110 transition-transform duration-300"
                        >
                            <SiWhatsapp size={32} color="#25D366" />
                        </a>
                    </div>

                </div>
            </div>


            <hr className='border-[#565555]' />
            <div className='bg-[#111111] w-full text-center'>
                <p className='text-white py-2 text-[14px]'>{t.footer.developedBy} <span className='text-[#0A80ED]'><Link href={"https://github.com/LucasSantos96"} target='_blank'>Lucas Santos</Link></span></p>
            </div>
        </footer>
    )
}

export default Footer
```

- [ ] **Step 2: Verificar manualmente**

Run: `npm run dev`
Confirmar que o rodapé alterna corretamente pelo toggle. Parar o servidor depois.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: sem erros.

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: translate Footer section"
```

---

### Task 8: Função de tradução via MyMemory

**Files:**
- Create: `src/lib/translate.ts`

**Interfaces:**
- Produces: `translateText(text: string): Promise<string | null>` — traduz PT→EN via MyMemory; retorna `null` em qualquer falha (nunca lança exceção).

- [ ] **Step 1: Criar `src/lib/translate.ts`**

```ts
import "server-only";

const MYMEMORY_ENDPOINT = "https://api.mymemory.translated.net/get";

interface MyMemoryResponse {
  responseData?: {
    translatedText?: string;
  };
}

export async function translateText(text: string): Promise<string | null> {
  const trimmed = text.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const url = new URL(MYMEMORY_ENDPOINT);
    url.searchParams.set("q", trimmed);
    url.searchParams.set("langpair", "pt|en");

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error("Erro ao traduzir texto (MyMemory):", response.status);
      return null;
    }

    const data = (await response.json()) as MyMemoryResponse;
    const translated = data.responseData?.translatedText;

    if (typeof translated !== "string" || !translated.trim()) {
      return null;
    }

    return translated;
  } catch (error) {
    console.error("Erro ao traduzir texto (MyMemory):", error);
    return null;
  }
}
```

- [ ] **Step 2: Verificar manualmente que a função funciona**

Criar um script temporário `scratch-check-translate.mjs` na raiz do projeto (não versionado — deletar no fim deste step) usando `fetch` direto (sem depender do import `server-only`, que só bloqueia bundling client-side, não execução standalone):

```js
const response = await fetch(
  "https://api.mymemory.translated.net/get?q=" +
    encodeURIComponent("Sobre mim") +
    "&langpair=pt|en"
);
const data = await response.json();
console.log(data.responseData.translatedText);
```

Run: `node scratch-check-translate.mjs`
Expected: imprime algo como `About me` (a tradução exata pode variar levemente, mas deve ser um texto em inglês coerente).

Depois de confirmar, apagar o arquivo:

```bash
rm scratch-check-translate.mjs
```

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: sem erros.

- [ ] **Step 4: Commit**

```bash
git add src/lib/translate.ts
git commit -m "feat: add MyMemory translation helper"
```

---

### Task 9: Schema do banco — colunas `titleEn`/`descriptionEn` e tipos

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `src/types/components.ts`

**Interfaces:**
- Produces: `PortfolioProject.titleEn: string | null`, `PortfolioProject.descriptionEn: string | null` (tipo TS, usado pelas Tasks 10 e 11).

- [ ] **Step 1: Adicionar as colunas no schema Prisma**

Em `prisma/schema.prisma`, dentro do model `PortfolioProject`, adicionar as duas novas colunas logo após `description`:

```prisma
model PortfolioProject {
  id           BigInt   @id @default(autoincrement())
  title        String
  description  String
  titleEn       String?  @map("title_en")
  descriptionEn String?  @map("description_en")
  projectUrl   String   @unique @map("project_url")
  imageUrl     String   @map("image_url")
  technologies String[] @default([])
  githubRepo   String?  @map("github_repo")
  source       String   @default("manual")
  published    Boolean  @default(true)
  sortOrder    Int      @default(0) @map("sort_order")
  createdAt    DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt    DateTime @updatedAt @map("updated_at") @db.Timestamptz(6)

  @@map("portfolio_projects")
}
```

- [ ] **Step 2: Atualizar o tipo `PortfolioProject`**

Em `src/types/components.ts`, adicionar os dois campos à interface `PortfolioProject`:

```ts
export interface PortfolioProject {
    id: number;
    title: string;
    description: string;
    titleEn: string | null;
    descriptionEn: string | null;
    projectUrl: string;
    imageUrl: string;
    technologies: string[];
    githubRepo: string | null;
    source: "manual" | "github";
    published: boolean;
    sortOrder: number;
    createdAt: string;
}
```

- [ ] **Step 3: Gerar o Prisma Client atualizado**

Run: `npm run prisma:generate`
Expected: `Generated Prisma Client` sem erros — este comando só lê o `schema.prisma`, não precisa de conexão com o banco.

- [ ] **Step 4: Verificar build**

Run: `npm run build`
Expected: falha esperada em `src/lib/projects.ts` (Task 10 ainda não mapeou os novos campos) — se falhar por causa disso, é esperado neste ponto; qualquer outro erro deve ser investigado antes de prosseguir. Se `src/lib/projects.ts` ainda não referenciar `titleEn`/`descriptionEn`, o build deve passar normalmente.

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma src/types/components.ts
git commit -m "feat: add titleEn/descriptionEn columns to PortfolioProject"
```

- [ ] **Step 6: Aplicar a mudança no banco real (ação manual do usuário)**

Este comando precisa de `DATABASE_URL`/`POSTGRES_PRISMA_URL` configurado (não disponível neste ambiente de desenvolvimento). Registrar como pendência para o usuário rodar em um ambiente com acesso ao banco:

```bash
npm run prisma:push
```

---

### Task 10: Tradução automática ao criar/editar projeto

**Files:**
- Modify: `src/lib/projects.ts`

**Interfaces:**
- Consumes: `translateText(text: string): Promise<string | null>` de `@/lib/translate` (Task 8); `PortfolioProject.titleEn`/`descriptionEn` (Task 9).
- Produces: `createPortfolioProject`/`updatePortfolioProject` agora preenchem `titleEn`/`descriptionEn` no retorno (`PortfolioProject`), consumido pela Task 11.

- [ ] **Step 1: Importar `translateText` e atualizar `DbPortfolioProject`/`mapDbProject`**

Em `src/lib/projects.ts`, adicionar o import:

```ts
import { translateText } from "@/lib/translate";
```

Atualizar a interface `DbPortfolioProject`:

```ts
interface DbPortfolioProject {
  id: bigint;
  title: string;
  description: string;
  titleEn: string | null;
  descriptionEn: string | null;
  projectUrl: string;
  imageUrl: string;
  technologies: string[];
  githubRepo: string | null;
  source: string;
  published: boolean;
  sortOrder: number;
  createdAt: Date;
}
```

Atualizar `mapDbProject`:

```ts
function mapDbProject(project: DbPortfolioProject): PortfolioProject {
  return {
    id: Number(project.id),
    title: project.title,
    description: project.description,
    titleEn: project.titleEn,
    descriptionEn: project.descriptionEn,
    projectUrl: project.projectUrl,
    imageUrl: project.imageUrl,
    technologies: project.technologies,
    githubRepo: project.githubRepo,
    source: project.source as "manual" | "github",
    published: project.published,
    sortOrder: project.sortOrder,
    createdAt: project.createdAt.toISOString(),
  };
}
```

- [ ] **Step 2: Traduzir ao criar um projeto**

Substituir `createPortfolioProject`:

```ts
export async function createPortfolioProject(input: NewPortfolioProjectInput) {
  assertDatabaseConfigured();

  const minSortOrder = await prisma.portfolioProject.aggregate({
    _min: { sortOrder: true },
  });

  const payload = buildProjectPayload(input);
  payload.sortOrder = input.sortOrder ?? (minSortOrder._min.sortOrder ?? 0) - 1;

  const [titleEn, descriptionEn] = await Promise.all([
    translateText(payload.title),
    translateText(payload.description),
  ]);

  const data = await prisma.portfolioProject.create({
    data: { ...payload, titleEn, descriptionEn },
  });

  return mapDbProject(data as DbPortfolioProject);
}
```

- [ ] **Step 3: Re-traduzir só o que mudou ao editar um projeto**

Substituir `updatePortfolioProject`:

```ts
export async function updatePortfolioProject(
  id: number,
  input: NewPortfolioProjectInput,
) {
  assertDatabaseConfigured();

  const current = await prisma.portfolioProject.findUniqueOrThrow({
    where: { id },
  });

  const payload = buildProjectPayload(input);

  const titleChanged = payload.title !== current.title;
  const descriptionChanged = payload.description !== current.description;

  const [titleEn, descriptionEn] = await Promise.all([
    titleChanged ? translateText(payload.title) : Promise.resolve(current.titleEn),
    descriptionChanged
      ? translateText(payload.description)
      : Promise.resolve(current.descriptionEn),
  ]);

  const data = await prisma.portfolioProject.update({
    where: { id },
    data: { ...payload, titleEn, descriptionEn },
  });

  return mapDbProject(data as DbPortfolioProject);
}
```

- [ ] **Step 4: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sem erros de tipo (o Prisma Client já foi regenerado na Task 9 com os novos campos).

- [ ] **Step 5: Lint**

Run: `npm run lint`
Expected: sem erros.

- [ ] **Step 6: Commit**

```bash
git add src/lib/projects.ts
git commit -m "feat: auto-translate project title/description on create/update"
```

---

### Task 11: ProjectsClient — renderização traduzida dos projetos

**Files:**
- Create: `src/components/ProjectsClient.tsx`
- Modify: `src/components/Projects.tsx`

**Interfaces:**
- Consumes: `useLocale()` (Task 1); `PortfolioProject` com `titleEn`/`descriptionEn` (Task 9); `ProjectCard` de `@/components/ui/project-card` (props existentes: `imgSrc`, `title`, `description`, `link`, `linkText`, `technologies`, `className`).
- Produces: `ProjectsClient({ projects }: { projects: PortfolioProject[] })`, usado por `Projects.tsx`.

- [ ] **Step 1: Criar `src/components/ProjectsClient.tsx`**

```tsx
"use client";

import { ProjectCard } from "@/components/ui/project-card";
import { useLocale } from "@/i18n/useLocale";
import type { PortfolioProject } from "@/types";

interface ProjectsClientProps {
  projects: PortfolioProject[];
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const { locale, t } = useLocale();

  return (
    <section
      className="my-20 mx-4 mb-14 flex flex-col items-center text-white lg:mx-32 lg:py-28"
      id="projetos"
    >
      <div>
        <h2 className="mb-5 text-[20px] lg:text-center lg:text-[40px]">{t.projects.title}</h2>
      </div>

      {projects.length ? (
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              imgSrc={project.imageUrl}
              title={locale === "en" ? project.titleEn ?? project.title : project.title}
              description={
                locale === "en"
                  ? project.descriptionEn ?? project.description
                  : project.description
              }
              link={project.projectUrl}
              technologies={project.technologies}
              linkText={t.projects.viewProject}
              className="bg-[#ffffff0d] text-white ring-white/10"
            />
          ))}
        </div>
      ) : (
        <p className="text-zinc-300">{t.projects.empty}</p>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Simplificar `Projects.tsx` para só buscar dados e delegar a renderização**

Substituir o conteúdo de `src/components/Projects.tsx`:

```tsx
import ProjectsClient from "@/components/ProjectsClient";
import { getPortfolioProjects } from "@/lib/projects";

const Projects = async () => {
  const projects = (await getPortfolioProjects()).filter((project) => project.published);

  return <ProjectsClient projects={projects} />;
};

export default Projects;
```

- [ ] **Step 3: Verificar manualmente**

Run: `npm run dev` (requer `DATABASE_URL` configurado para listar projetos reais; se não houver banco disponível neste ambiente, confirmar ao menos que a seção renderiza o estado vazio traduzido corretamente ao alternar PT/EN).
Expected: título da seção e mensagem de lista vazia (ou os cards, se houver projetos) alternam com o toggle; texto do botão do card ("Ver projeto"/"View project") também alterna. Parar o servidor depois.

- [ ] **Step 4: Lint e tipos**

Run: `npm run lint && npx tsc --noEmit`
Expected: sem erros.

- [ ] **Step 5: Commit**

```bash
git add src/components/ProjectsClient.tsx src/components/Projects.tsx
git commit -m "feat: translate Projects section and dynamic project content"
```

---

### Task 12: Script de backfill para projetos existentes

**Files:**
- Create: `prisma/backfill-translations.js`

**Interfaces:**
- Nenhuma — script standalone, executado manualmente (`node prisma/backfill-translations.js`).

- [ ] **Step 1: Criar `prisma/backfill-translations.js`**

```js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function translateText(text) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  try {
    const url = new URL("https://api.mymemory.translated.net/get");
    url.searchParams.set("q", trimmed);
    url.searchParams.set("langpair", "pt|en");

    const response = await fetch(url.toString());
    if (!response.ok) {
      console.error("Erro ao traduzir texto (MyMemory):", response.status);
      return null;
    }

    const data = await response.json();
    const translated = data?.responseData?.translatedText;

    if (typeof translated !== "string" || !translated.trim()) {
      return null;
    }

    return translated;
  } catch (error) {
    console.error("Erro ao traduzir texto (MyMemory):", error);
    return null;
  }
}

async function main() {
  const pending = await prisma.portfolioProject.findMany({
    where: {
      OR: [{ titleEn: null }, { descriptionEn: null }],
    },
  });

  console.log(`Projetos pendentes de tradução: ${pending.length}`);

  for (const project of pending) {
    const [titleEn, descriptionEn] = await Promise.all([
      project.titleEn ? Promise.resolve(project.titleEn) : translateText(project.title),
      project.descriptionEn
        ? Promise.resolve(project.descriptionEn)
        : translateText(project.description),
    ]);

    await prisma.portfolioProject.update({
      where: { id: project.id },
      data: { titleEn, descriptionEn },
    });

    console.log(`Traduzido: "${project.title}" -> "${titleEn ?? "(falhou)"}"`);
  }

  console.log("Backfill concluído.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

- [ ] **Step 2: Registrar a execução como pendência manual**

Este script precisa de `DATABASE_URL` configurado e de rede liberada para `api.mymemory.translated.net` — não pode ser executado neste ambiente de desenvolvimento sem essas credenciais. Documentar para o usuário rodar manualmente após o deploy (ou apontando `DATABASE_URL` para o banco de produção/staging):

```bash
node prisma/backfill-translations.js
```

- [ ] **Step 3: Commit**

```bash
git add prisma/backfill-translations.js
git commit -m "feat: add one-off backfill script for project translations"
```

---

### Task 13: Verificação final

**Files:**
- Nenhum arquivo novo — apenas validação de todo o trabalho das Tasks 1–12.

- [ ] **Step 1: Lint completo**

Run: `npm run lint`
Expected: sem erros.

- [ ] **Step 2: Checagem de tipos completa**

Run: `npx tsc --noEmit`
Expected: sem erros.

- [ ] **Step 3: Build de produção**

Run: `npm run build`
Expected: build concluído com sucesso.

- [ ] **Step 4: Checklist manual de smoke test**

Run: `npm run dev` e, no navegador:
- Confirmar que o site abre em português por padrão.
- Clicar no toggle PT/EN no header e confirmar que Header, Hero, About, Skills, Projects e Footer mudam de idioma juntos.
- Recarregar a página com EN selecionado e confirmar que o idioma persiste (via `localStorage`).
- Abrir uma aba anônima/privada e confirmar que o site abre em PT-BR (sem herdar o `localStorage` da aba normal).

Parar o servidor depois.

- [ ] **Step 5: Commit final (se houver ajustes)**

Se algum ajuste for necessário durante a verificação, commitar separadamente com uma mensagem descrevendo a correção. Se nada precisar mudar, este task não gera commit.
