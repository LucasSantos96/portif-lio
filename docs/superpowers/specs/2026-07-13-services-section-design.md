# Seção de Serviços + Formulário de Contato via Gmail

## Contexto

O portfólio hoje mostra Hero, Sobre, Habilidades, Projetos e Contato, mas não comunica explicitamente os serviços oferecidos. Além de sites e sistemas, o dono do portfólio atua com automações em n8n e como parceiro implementador / consultor de TI para sistemas de gestão (Bling, Olist) e cardápio digital (CardápioWeb). O formulário de contato atual é só um link `mailto:`, sem captura estruturada de lead.

Este spec cobre duas mudanças:
1. Nova seção **Serviços** (`Services.tsx`), inserida entre `About` e `Skills`.
2. Reformulação do formulário de contato (dentro de `Contact.tsx`) para capturar leads estruturados e notificar por e-mail via Gmail/Nodemailer.

## Seção Serviços

### Layout (aprovado via mockup visual)

Grid 2×2 (`grid-cols-1 md:grid-cols-2`), 4 cards do mesmo tamanho, dentro do container padrão do site (`mx-4 lg:mx-32`, título `text-[20px] lg:text-[40px]` centralizado, mesma paleta: fundo `#121417`, cards translúcidos `bg-[#ffffff1a]`, acento `#0980ec`).

**Cards 1–3 — foto de fundo com overlay + texto:**
- Estrutura: `div` com `background-image` cobrindo o card, `overlay` gradiente escuro de baixo pra cima (`linear-gradient(180deg, rgba(18,20,23,.15) 0%, rgba(18,20,23,.55) 55%, rgba(18,20,23,.92) 100%)`) para manter texto legível, badge de ícone circular no canto superior esquerdo (`bg-[#0980ec]`), título + parágrafo curto ancorados embaixo.
- Cards e imagens:
  1. **Sites** — foto de laptop/código (Unsplash, hotlink direto — ver "Imagens" abaixo)
  2. **Sistemas Web** — foto de dashboard/painel administrativo (Unsplash, hotlink direto)
  3. **Automações com n8n** — screenshot real de um fluxo n8n fornecido pelo usuário, salvo em `public/services/n8n-flow.png`

**Card 4 — Consultoria & Implementação de ERP:**
- Mesmo tamanho dos outros 3, **sem foto**: card sólido `bg-[#ffffff1a]`, ícone circular, título "Consultoria & Implementação de Sistemas de Gestão", texto curto explicando a atuação como parceiro implementador / consultor de TI.
- Abaixo do texto, uma linha de "pills" (`bg-[#ffffff1a] rounded-lg px-3 py-2`, texto + ponto colorido) para **Bling**, **Olist** e **CardápioWeb** — não são logos de imagem (ver limitação abaixo), são indicadores estilizados com o nome da marca.

### Imagens

- **Sites / Sistemas Web:** hotlink direto para URLs do Unsplash (`images.unsplash.com`), sem baixar/hospedar localmente. Requer adicionar `images.unsplash.com` a `images.remotePatterns` em `next.config.ts`.
- **Automações com n8n:** arquivo local `public/services/n8n-flow.png` (screenshot fornecido pelo usuário durante o brainstorming), sem necessidade de config extra de `next/image`.
- **Logos Bling/Olist/CardápioWeb:** **não foram baixadas** — o ambiente de execução usado neste brainstorming não tem acesso de rede para baixar arquivos binários de fontes externas. O design aprovado usa pills de texto com ponto colorido como substituto visual (ver mockup aprovado). Caso o usuário forneça os arquivos de logo depois (PNG/SVG em `public/services/`), a troca é simples: substituir o `<span>` colorido por `<Image>` dentro da pill.

## Formulário de Contato

### Campos (substituindo o CTA `mailto:` atual em `Contact.tsx`)

1. **Serviço de interesse** — `<select>` (novo componente `select.tsx`, estilo shadcn/Radix, a ser adicionado em `src/components/ui/`) com as opções: Sites, Sistemas Web, Automações com n8n, Consultoria & Implementação de ERP.
2. **Nome** — `<input>` texto, obrigatório.
3. **Email** — `<input type="email">`, obrigatório.
4. **Telefone/WhatsApp** — `<input type="tel">`, obrigatório.
5. **Mensagem** — `<textarea>`, **opcional**.

Botão de envio com estado de loading/disabled durante o submit; feedback de sucesso ("Mensagem enviada! Você vai receber uma confirmação por e-mail.") ou erro inline, sem recarregar a página (fetch client-side, `"use client"`, já que `Contact.tsx` já é client component).

### Fluxo de envio

`POST /api/contact` (nova rota, `src/app/api/contact/route.ts`), seguindo o padrão de `src/lib/project-validation.ts` (validação em módulo `lib` separado, ex. `src/lib/contact-validation.ts`):

1. Valida payload: `service`, `name`, `email`, `phone` obrigatórios; `message` opcional. Email validado por formato simples (regex), igual ao padrão de validação usado no projeto (mensagens de erro em pt-BR).
2. Envia **e-mail de notificação** para `GMAIL_USER` (o próprio dono do site) com todos os dados preenchidos (serviço, nome, email, telefone, mensagem).
3. Envia **e-mail de confirmação** para o e-mail do visitante, com uma mensagem simples confirmando o recebimento do contato.
4. Resposta ao cliente:
   - Se a notificação para o dono falhar → erro 500, o formulário mostra mensagem de erro (esse e-mail é o que importa para captura do lead).
   - Se só a confirmação ao visitante falhar → loga o erro no servidor (`console.error`), mas **ainda retorna sucesso** ao formulário (o lead já foi capturado, a confirmação é um "nice to have").

### Envio de e-mail — Gmail via Nodemailer

- Novo pacote: `nodemailer` (+ `@types/nodemailer` como devDependency).
- Variáveis de ambiente (já criadas em `.env` durante o brainstorming):
  - `GMAIL_USER` — endereço Gmail do remetente/destinatário das notificações.
  - `GMAIL_PASSWORD` — senha de app do Gmail (App Password, não a senha normal da conta).
- Novo módulo `src/lib/mailer.ts`: cria um transporter Nodemailer (`service: "gmail"`, auth com `GMAIL_USER`/`GMAIL_PASSWORD`) e expõe uma função `sendContactEmails(data)` que dispara os dois e-mails (notificação + confirmação).

## Posicionamento

`src/app/page.tsx` passa a renderizar: `Hero → About → Services → Skills → Projects → Contact`.

## Testes

- Validação manual no navegador (`npm run dev`): preencher o formulário, verificar mensagens de erro para campos obrigatórios vazios/e-mail inválido, e confirmar que os dois e-mails chegam (notificação em `GMAIL_USER`, confirmação no e-mail de teste usado).
- Sem testes automatizados novos — o projeto não tem suíte de testes configurada; segue o padrão existente.

## Fora de escopo

- Autenticação/anti-spam no formulário de contato (captcha, rate limiting) — pode ser adicionado depois se houver abuso.
- Download/hospedagem de logos oficiais reais dos parceiros (bloqueado pela limitação de rede do ambiente atual).
