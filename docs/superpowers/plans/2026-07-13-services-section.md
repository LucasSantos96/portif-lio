# Services Section + Gmail Contact Form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Serviços" section to the portfolio homepage (4 cards: Sites, Sistemas Web, Automações n8n, Consultoria/Implementação de ERP) and replace the `mailto:` contact CTA with a structured lead-capture form that emails the site owner (and the visitor) via Gmail/Nodemailer.

**Architecture:** One new presentational component (`Services.tsx`) inserted into the homepage between `About` and `Skills`. The contact form lives inside the existing `Contact.tsx` (client component) and posts JSON to a new Next.js route handler (`POST /api/contact`), which validates the payload with a dedicated `lib` module and sends two emails through a shared Nodemailer transporter module. A new `select.tsx` UI primitive is added to `src/components/ui/` following the existing Base UI + `cva`-free wrapper pattern used by `input.tsx`/`textarea.tsx`.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, `@base-ui/react` (headless primitives), `nodemailer` (new dependency), Bun (lockfile present as `bun.lock`).

## Global Constraints

- All user-facing text (labels, placeholders, errors, email copy) is in Brazilian Portuguese, matching every existing component.
- Reuse the site's existing dark palette exactly: background `#121417`, translucent card `bg-[#ffffff1a]` (hover `bg-[#ffffff2a]`), accent `#0980ec`, muted text `#b0afaf`. Do not introduce new colors.
- Section container spacing matches siblings: `mx-4 lg:mx-32`, title `text-[20px] mb-... lg:text-[40px]` centered.
- New components are function components in TypeScript (`.tsx`), matching existing file style (some files use `React.FC`, some don't — new files should use plain typed function components, matching `Contact.tsx`'s style since that's the file being extended).
- Env vars already present in `.env` (not committed): `GMAIL_USER`, `GMAIL_PASSWORD` (Gmail App Password, not the account password).
- No automated test suite exists in this repo; verification is manual (`npm run dev` + browser).
- Do not commit `.env`.

---

### Task 1: Add `images.unsplash.com` to Next.js image config

**Files:**
- Modify: `next.config.mjs`

**Interfaces:**
- Produces: `images.remotePatterns` includes `images.unsplash.com`, so `next/image` can render the Sites/Sistemas Web card photos in Task 4.

- [ ] **Step 1: Edit `next.config.ts`**

Current content:
```ts
/** @type {import('next').NextConfig} */
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "opengraph.githubassets.com",
      },
      ...(supabaseHostname
        ? [
            {
              protocol: "https",
              hostname: supabaseHostname,
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
```

Replace the `remotePatterns` array so it also includes Unsplash:

```ts
/** @type {import('next').NextConfig} */
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "opengraph.githubassets.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      ...(supabaseHostname
        ? [
            {
              protocol: "https",
              hostname: supabaseHostname,
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 2: Verify the dev server picks up the config**

Run: `npm run dev` (leave it running in the background for later manual checks), then in another terminal run `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/`
Expected: `200` (the config change alone doesn't break the build — this just confirms the server still boots)

Stop the dev server after confirming (Ctrl+C) — later tasks will restart it as needed.

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "feat: allow images.unsplash.com for next/image"
```

---

### Task 2: Add the `select.tsx` UI primitive

**Files:**
- Create: `src/components/ui/select.tsx`

**Interfaces:**
- Consumes: `@base-ui/react/select` (already installed — verified present at `node_modules/@base-ui/react/select`), `cn` from `@/lib/utils` (existing), `CheckIcon`/`ChevronDownIcon` from `lucide-react` (existing dependency).
- Produces: named exports `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem` — consumed by `Contact.tsx` in Task 5.

- [ ] **Step 1: Create `src/components/ui/select.tsx`**

```tsx
"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Select(props: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex h-8 w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base whitespace-nowrap transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted-foreground md:text-sm dark:bg-input/30",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectValue(props: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Popup>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner sideOffset={4} className="z-50">
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            "max-h-60 min-w-[var(--anchor-width)] overflow-y-auto rounded-lg border border-input bg-popover p-1 text-popover-foreground shadow-md",
            className
          )}
          {...props}
        >
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-pointer items-center gap-2 rounded-md py-1.5 pr-2 pl-8 text-sm outline-none select-none data-[highlighted]:bg-muted data-[highlighted]:text-foreground",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors referencing `src/components/ui/select.tsx` (pre-existing unrelated errors, if any, are out of scope)

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/select.tsx
git commit -m "feat: add select ui primitive (base-ui wrapper)"
```

---

### Task 3: Create the `Services.tsx` component with the 4-card grid

**Files:**
- Create: `src/components/Services.tsx`

**Interfaces:**
- Consumes: `next/image`, existing partner logo assets at `public/services/bling.webp`, `public/services/olist.webp`, `public/services/cardapioweb.webp`, n8n screenshot at `public/services/n8n-flow.png`, Unsplash photo URLs (public, no API key needed).
- Produces: default export `Services` (React component, no props) — consumed by `src/app/page.tsx` in Task 4.

- [ ] **Step 1: Create `src/components/Services.tsx`**

```tsx
import React from "react";
import Image from "next/image";

interface ServiceCardData {
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
}

const photoServices: ServiceCardData[] = [
  {
    title: "Sites",
    description:
      "Sites institucionais, landing pages e portfólios rápidos, responsivos e otimizados.",
    icon: "🌐",
    imageUrl:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Sistemas Web",
    description:
      "Sistemas sob medida para o seu negócio, com painel administrativo e integrações.",
    icon: "🖥️",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Automações com n8n",
    description:
      "Fluxos automatizados que conectam suas ferramentas e eliminam tarefas manuais.",
    icon: "🔗",
    imageUrl: "/services/n8n-flow.png",
  },
];

const partnerLogos = [
  { name: "Bling", src: "/services/bling.webp" },
  { name: "Olist", src: "/services/olist.webp" },
  { name: "CardápioWeb", src: "/services/cardapioweb.webp" },
];

const Services: React.FC = () => {
  return (
    <section
      className="mt-20 mx-4 text-white mb-14 lg:mx-32 lg:py-20"
      id="servicos"
    >
      <div className="text-center mb-12">
        <h2 className="text-[20px] mb-5 lg:text-[40px]">Serviços</h2>
        <p className="text-[#b0afaf] text-sm lg:text-base max-w-2xl mx-auto">
          Do site institucional à automação de processos e implementação de
          sistemas de gestão.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
        {photoServices.map((service) => (
          <div
            key={service.title}
            className="relative rounded-2xl overflow-hidden min-h-[220px] flex items-end"
          >
            <Image
              src={service.imageUrl}
              alt={service.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121417]/95 via-[#121417]/55 to-[#121417]/15" />
            <div className="absolute top-4 left-4 bg-[#0980ecdd] size-10 rounded-full flex items-center justify-center text-lg">
              {service.icon}
            </div>
            <div className="relative z-10 p-6">
              <h3 className="text-lg font-semibold mb-1.5">
                {service.title}
              </h3>
              <p className="text-sm text-[#e6e6e6] max-w-[90%]">
                {service.description}
              </p>
            </div>
          </div>
        ))}

        <div className="bg-[#ffffff1a] hover:bg-[#ffffff2a] transition-colors duration-300 rounded-2xl p-6 min-h-[220px] flex flex-col justify-center">
          <div className="bg-[#0980ec] size-[52px] rounded-full flex items-center justify-center text-xl mb-4">
            🤝
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Consultoria & Implementação de Sistemas de Gestão
          </h3>
          <p className="text-sm text-[#b0afaf] mb-4">
            Parceiro implementador e consultor de TI para sistemas de gestão e
            cardápio digital.
          </p>
          <div className="flex gap-3 flex-wrap">
            {partnerLogos.map((logo) => (
              <div
                key={logo.name}
                className="bg-[#ffffff1a] rounded-lg px-3 py-2 flex items-center"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={80}
                  height={24}
                  className="h-6 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors referencing `src/components/Services.tsx`

- [ ] **Step 3: Commit**

```bash
git add src/components/Services.tsx
git commit -m "feat: add Services section component"
```

---

### Task 4: Insert `Services` into the homepage between `About` and `Skills`

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `Services` default export from Task 3 (`@/components/Services`).

- [ ] **Step 1: Edit `src/app/page.tsx`**

Current content:
```tsx
import About from "@/components/About";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";

export const dynamic = "force-dynamic";

export default function Home() {
    return (
        <main>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Contact />
        </main>
    );
}
```

Replace with:
```tsx
import About from "@/components/About";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";

export const dynamic = "force-dynamic";

export default function Home() {
    return (
        <main>
            <Hero />
            <About />
            <Services />
            <Skills />
            <Projects />
            <Contact />
        </main>
    );
}
```

- [ ] **Step 2: Manually verify in the browser**

Run: `npm run dev`, open `http://localhost:3000`
Expected: "Serviços" section renders between "Sobre mim" and "Habilidades", showing 3 photo cards (Sites, Sistemas Web, Automações com n8n with the real n8n screenshot) and 1 solid card with the 3 partner logos (Bling, Olist, CardápioWeb) rendered as images, matching the approved mockup layout (2x2 grid, same card size).

Stop the dev server after confirming (Ctrl+C).

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: render Services section on the homepage"
```

---

### Task 5: Contact validation module (`lib/contact-validation.ts`)

**Files:**
- Create: `src/lib/contact-validation.ts`

**Interfaces:**
- Produces: `export interface ContactRequestBody { service?: string; name?: string; email?: string; phone?: string; message?: string; }`, `export const CONTACT_SERVICES: readonly string[]`, `export function validateContactBody(body: ContactRequestBody): string | null` — consumed by `src/app/api/contact/route.ts` in Task 7 and by `Contact.tsx` in Task 8 (for the `<select>` options list).

- [ ] **Step 1: Create `src/lib/contact-validation.ts`**

```ts
export interface ContactRequestBody {
  service?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export const CONTACT_SERVICES = [
  "Sites",
  "Sistemas Web",
  "Automações com n8n",
  "Consultoria & Implementação de ERP",
] as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactBody(body: ContactRequestBody): string | null {
  if (!body.service || !CONTACT_SERVICES.includes(body.service as (typeof CONTACT_SERVICES)[number])) {
    return "Selecione um serviço de interesse válido.";
  }

  if (!body.name || !body.name.trim()) {
    return "Preencha seu nome.";
  }

  if (!body.email || !EMAIL_REGEX.test(body.email)) {
    return "Informe um e-mail válido.";
  }

  if (!body.phone || !body.phone.trim()) {
    return "Informe um telefone/WhatsApp para contato.";
  }

  return null;
}
```

- [ ] **Step 2: Write a manual smoke check (no test runner configured in this repo)**

Run:
```bash
npx tsx -e "
import { validateContactBody } from './src/lib/contact-validation';
console.log(validateContactBody({}));
console.log(validateContactBody({ service: 'Sites', name: 'Ana', email: 'ana@example.com', phone: '11999999999' }));
"
```
Expected output:
```
Selecione um serviço de interesse válido.
null
```

(If `tsx` isn't available, run `npx --yes tsx -e "..."` — it installs on demand.)

- [ ] **Step 3: Commit**

```bash
git add src/lib/contact-validation.ts
git commit -m "feat: add contact form validation"
```

---

### Task 6: Mailer module (`lib/mailer.ts`) using Nodemailer + Gmail

**Files:**
- Create: `src/lib/mailer.ts`
- Modify: `package.json` (add `nodemailer` + `@types/nodemailer`)

**Interfaces:**
- Consumes: `GMAIL_USER`, `GMAIL_PASSWORD` from `process.env`.
- Produces: `export interface ContactEmailData { service: string; name: string; email: string; phone: string; message?: string; }`, `export async function sendContactNotification(data: ContactEmailData): Promise<void>` (throws on failure — the caller in Task 7 treats this as fatal), `export async function sendContactConfirmation(data: ContactEmailData): Promise<void>` (caller in Task 7 catches and logs failures without failing the request).

- [ ] **Step 1: Install `nodemailer`**

Run: `npm install nodemailer && npm install -D @types/nodemailer`
Expected: `package.json` `dependencies` gains `"nodemailer"` and `devDependencies` gains `"@types/nodemailer"`.

- [ ] **Step 2: Create `src/lib/mailer.ts`**

```ts
import nodemailer from "nodemailer";

export interface ContactEmailData {
  service: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
}

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "GMAIL_USER e GMAIL_PASSWORD precisam estar configurados no ambiente."
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export async function sendContactNotification(data: ContactEmailData) {
  const transporter = getTransporter();
  const ownerEmail = process.env.GMAIL_USER as string;

  await transporter.sendMail({
    from: ownerEmail,
    to: ownerEmail,
    replyTo: data.email,
    subject: `Novo contato pelo site — ${data.service}`,
    text: [
      `Serviço de interesse: ${data.service}`,
      `Nome: ${data.name}`,
      `Email: ${data.email}`,
      `Telefone: ${data.phone}`,
      `Mensagem: ${data.message?.trim() || "(não informada)"}`,
    ].join("\n"),
  });
}

export async function sendContactConfirmation(data: ContactEmailData) {
  const transporter = getTransporter();
  const ownerEmail = process.env.GMAIL_USER as string;

  await transporter.sendMail({
    from: ownerEmail,
    to: data.email,
    subject: "Recebemos seu contato!",
    text: [
      `Olá, ${data.name}!`,
      "",
      `Recebemos seu contato sobre "${data.service}" e retornaremos em breve.`,
      "",
      "Obrigado por entrar em contato!",
    ].join("\n"),
  });
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors referencing `src/lib/mailer.ts`

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/lib/mailer.ts
git commit -m "feat: add Gmail/Nodemailer mailer module"
```

(If the repo resolves dependencies with `bun` instead of `npm` — note `bun.lock` is present at the repo root — use `bun add nodemailer && bun add -d @types/nodemailer` instead of the `npm install` commands in Step 1, and stage `bun.lock` in place of `package-lock.json` in Step 4.)

---

### Task 7: `POST /api/contact` route handler

**Files:**
- Create: `src/app/api/contact/route.ts`

**Interfaces:**
- Consumes: `ContactRequestBody`, `validateContactBody` from `@/lib/contact-validation` (Task 5); `sendContactNotification`, `sendContactConfirmation` from `@/lib/mailer` (Task 6).
- Produces: `POST` handler returning `NextResponse.json({ ok: true }, { status: 200 })` on success, `NextResponse.json({ message: string }, { status: 400 })` on validation failure, `NextResponse.json({ message: string }, { status: 500 })` on notification-email failure — consumed by the form's `fetch` call in Task 8.

- [ ] **Step 1: Create `src/app/api/contact/route.ts`**

```ts
import { NextResponse } from "next/server";

import {
  validateContactBody,
  type ContactRequestBody,
} from "@/lib/contact-validation";
import { sendContactConfirmation, sendContactNotification } from "@/lib/mailer";

export async function POST(request: Request) {
  const body = (await request.json()) as ContactRequestBody;
  const validationError = validateContactBody(body);

  if (validationError) {
    return NextResponse.json({ message: validationError }, { status: 400 });
  }

  const data = {
    service: body.service as string,
    name: body.name as string,
    email: body.email as string,
    phone: body.phone as string,
    message: body.message,
  };

  try {
    await sendContactNotification(data);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível enviar sua mensagem. Tente novamente.",
      },
      { status: 500 }
    );
  }

  try {
    await sendContactConfirmation(data);
  } catch (error) {
    console.error("Falha ao enviar e-mail de confirmação:", error);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
```

- [ ] **Step 2: Manual verification with the dev server running**

Run: `npm run dev`, then in another terminal:
```bash
curl -s -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"service":"Sites","name":"Teste","email":"seuemail@gmail.com","phone":"11999999999","message":"Mensagem de teste"}'
```
Expected: `{"ok":true}` and, within a minute, two emails arrive — one at `GMAIL_USER`'s inbox (notification with the filled-in data) and one at the `email` used in the request (confirmation). Also test the validation path:
```bash
curl -s -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" -d '{}'
```
Expected: `{"message":"Selecione um serviço de interesse válido."}` with HTTP status 400.

Stop the dev server after confirming (Ctrl+C).

- [ ] **Step 3: Commit**

```bash
git add src/app/api/contact/route.ts
git commit -m "feat: add POST /api/contact route with Gmail notifications"
```

---

### Task 8: Replace the `mailto:` CTA in `Contact.tsx` with the lead-capture form

**Files:**
- Modify: `src/components/Contact.tsx:141-152` (the "CTA" block at the bottom of the section)

**Interfaces:**
- Consumes: `CONTACT_SERVICES` from `@/lib/contact-validation` (Task 5); `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem` from `@/components/ui/select` (Task 2); `Input` from `@/components/ui/input` (existing); `Textarea` from `@/components/ui/textarea` (existing); `Label` from `@/components/ui/label` (existing); `Button` from `@/components/ui/button` (existing). Posts to `POST /api/contact` (Task 7).

- [ ] **Step 1: Add the client-side form state and submit handler to `Contact.tsx`**

Add these imports at the top of `src/components/Contact.tsx` (alongside the existing `React`, `Image`, `Link` imports):

```tsx
import { useState } from "react";
import { CONTACT_SERVICES } from "@/lib/contact-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
```

Inside the `Contact` component, before the `return`, add:

```tsx
const [service, setService] = useState<string | null>(null);
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [message, setMessage] = useState("");
const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
  "idle"
);
const [errorMessage, setErrorMessage] = useState("");

async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setStatus("loading");
  setErrorMessage("");

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service, name, email, phone, message }),
    });

    const data = (await response.json()) as {
      ok?: boolean;
      message?: string;
    };

    if (!response.ok) {
      setStatus("error");
      setErrorMessage(data.message ?? "Não foi possível enviar sua mensagem.");
      return;
    }

    setStatus("success");
    setService(null);
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
  } catch {
    setStatus("error");
    setErrorMessage("Não foi possível enviar sua mensagem. Tente novamente.");
  }
}
```

- [ ] **Step 2: Replace the CTA block (lines 141-152) with the form**

Current content at the end of the section (right before the closing `</section>`):
```tsx
            {/* CTA */}
            <div className="text-center mt-12">
                <p className="text-[#b0afaf] mb-4">Tem um projeto em mente?</p>
                <a
                    href="https://mail.google.com/mail/?view=cm&to=homeoficelucas@gmail.com&su=Proposta%20de%20Projeto&body=Olá%20Lucas!%20Gostaria%20de%20conversar%20sobre%20um%20projeto."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#0980ec] hover:bg-[#0659a6] text-white font-medium py-3 px-8 rounded-full transition-colors duration-300 cursor-pointer"
                >
                    Vamos Conversar!
                </a>
            </div>
```

Replace with:
```tsx
            {/* Formulário de Contato */}
            <div className="w-full max-w-2xl mt-12 bg-[#ffffff4b] rounded-2xl p-8">
                <h3 className="text-xl font-semibold mb-6 text-center">
                    Tem um projeto em mente?
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="contact-service">Serviço de interesse</Label>
                        <Select value={service} onValueChange={setService} required>
                            <SelectTrigger id="contact-service">
                                <SelectValue placeholder="Selecione um serviço" />
                            </SelectTrigger>
                            <SelectContent>
                                {CONTACT_SERVICES.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="contact-name">Nome</Label>
                        <Input
                            id="contact-name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="contact-email">Email</Label>
                        <Input
                            id="contact-email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="contact-phone">Telefone/WhatsApp</Label>
                        <Input
                            id="contact-phone"
                            type="tel"
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="contact-message">
                            Mensagem (opcional)
                        </Label>
                        <Textarea
                            id="contact-message"
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            placeholder="Conte mais sobre o projeto"
                        />
                    </div>

                    {status === "error" && (
                        <p className="text-sm text-red-400">{errorMessage}</p>
                    )}

                    {status === "success" && (
                        <p className="text-sm text-green-400">
                            Mensagem enviada! Você vai receber uma confirmação por
                            e-mail.
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full bg-[#0980ec] hover:bg-[#0659a6] text-white font-medium py-3 rounded-full"
                    >
                        {status === "loading" ? "Enviando..." : "Enviar mensagem"}
                    </Button>
                </form>
            </div>
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors referencing `src/components/Contact.tsx`

- [ ] **Step 4: Manual verification in the browser**

Run: `npm run dev`, open `http://localhost:3000#contato`.
Expected:
- Form renders with the select, 3 text inputs, optional textarea, and submit button, styled consistently with the rest of the page (translucent card, rounded corners).
- Submitting with empty required fields shows the browser's native "required" validation (HTML5) before the request is even sent.
- Submitting a valid form shows "Enviando..." then the green success message, and both emails arrive (as verified in Task 7 Step 2).
- Submitting with `GMAIL_PASSWORD` temporarily set to an invalid value (to simulate a Gmail auth failure) shows the red error message instead of a silent failure. Restore the correct value afterward.

Stop the dev server after confirming (Ctrl+C).

- [ ] **Step 5: Commit**

```bash
git add src/components/Contact.tsx
git commit -m "feat: replace mailto CTA with structured lead-capture form"
```

---

## Post-Implementation Checklist (spec coverage)

- Services section, 4-card grid, positioned between About and Skills — Tasks 3, 4.
- Photo cards with gradient overlay for Sites/Sistemas Web/n8n, n8n card uses the real screenshot — Task 3.
- ERP card same size as others, solid background, real partner logos (Bling/Olist/CardápioWeb) — Task 3 (logos already in `public/services/`).
- Contact form fields (select, name, email, phone, optional message) — Task 8.
- `POST /api/contact` validates and sends two emails via Gmail/Nodemailer — Tasks 5, 6, 7.
- Notification-email failure surfaces as an error to the user; confirmation-email failure is logged but doesn't block success — Task 7.
- `next.config.ts` allows the Unsplash image host — Task 1.
