"use client";

import { SiFacebook, SiTelegram, SiWhatsapp, SiX } from "@icons-pack/react-simple-icons";
import { Check, Link2, Linkedin, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useLocale } from "@/i18n/useLocale";

interface ShareButtonProps {
  title: string;
  text: string;
  /** Endereço completo do artigo. */
  url: string;
}

const itemClass =
  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-paper/90 transition-colors hover:bg-paper/[0.06] focus-visible:bg-paper/[0.06] focus-visible:outline-none";

/**
 * Compartilhar o artigo. Onde há folha nativa (celulares) ela abre, com
 * WhatsApp, status, Instagram etc.; no desktop abre um menu com as redes
 * principais e "copiar link". A prévia do post vem das tags Open Graph.
 */
export default function ShareButton({ title, text, url }: ShareButtonProps) {
  const { t } = useLocale();
  const s = t.blog.share;
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function handleClick() {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (error) {
        // Fechar a folha nativa não é erro; qualquer outra falha cai no menu.
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    setOpen((value) => !value);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(s.copyLink, url);
    }
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const targets = [
    {
      label: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${url}`)}`,
      icon: <SiWhatsapp className="size-4" aria-hidden />,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <Linkedin className="size-4" aria-hidden />,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <SiX className="size-4" aria-hidden />,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <SiFacebook className="size-4" aria-hidden />,
    },
    {
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <SiTelegram className="size-4" aria-hidden />,
    },
  ];

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        type="button"
        onClick={handleClick}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border border-paper/15 px-4 py-2 text-sm text-paper transition-colors hover:border-paper/30 hover:bg-paper/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <Share2 className="size-4" aria-hidden />
        {s.label}
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={s.label}
          className="absolute left-0 z-20 mt-2 w-56 rounded-2xl border border-paper/10 bg-night-raised p-1.5 shadow-xl"
        >
          {targets.map((target) => (
            <a
              key={target.label}
              role="menuitem"
              href={target.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className={itemClass}
            >
              {target.icon}
              {target.label}
            </a>
          ))}
          <button type="button" role="menuitem" onClick={copyLink} className={itemClass}>
            {copied ? <Check className="size-4" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
            {copied ? s.copied : s.copyLink}
          </button>
          <span role="status" aria-live="polite" className="sr-only">
            {copied ? s.copied : ""}
          </span>
        </div>
      ) : null}
    </div>
  );
}
