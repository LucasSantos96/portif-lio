"use client";

import { SiWhatsapp } from "@icons-pack/react-simple-icons";

import ContactForm from "@/components/ContactForm";
import { useLocale } from "@/i18n/useLocale";
import { site } from "@/lib/site";

interface ArticleCtaProps {
  title: string;
  /** Endereço completo do artigo, citado na mensagem do WhatsApp. */
  url: string;
}

/** Fim do artigo: WhatsApp com a conversa já escrita ou formulário de contato. */
export default function ArticleCta({ title, url }: ArticleCtaProps) {
  const { t } = useLocale();
  const cta = t.blog.cta;
  const whatsappHref = `${site.links.whatsapp}?text=${encodeURIComponent(cta.whatsappMessage(title, url))}`;

  return (
    <section
      aria-labelledby="article-cta-title"
      className="mt-16 rounded-[1.75rem] border border-paper/[0.08] bg-night-raised p-6 md:p-10"
    >
      <h2 id="article-cta-title" className="type-heading text-3xl text-paper md:text-4xl">
        {cta.title}
      </h2>
      <p className="mt-3 max-w-[52ch] text-lg text-fog">{cta.text}</p>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex h-13 items-center justify-center gap-2.5 rounded-full bg-lamp px-7 text-base font-semibold text-night shadow-[0_0_40px_-8px_var(--lamp)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_56px_-6px_var(--lamp)]"
      >
        <SiWhatsapp className="size-5" aria-hidden />
        {cta.whatsapp}
      </a>

      <p className="mt-10 mb-4 text-fog">{cta.formTitle}</p>
      <ContactForm source={title} className="border-paper/10 bg-night p-5 md:p-8" />
    </section>
  );
}
