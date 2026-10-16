import type { ComponentPropsWithoutRef } from "react";
import type { Element } from "hast";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { extractToc } from "@/lib/blog";
import { cn } from "@/lib/utils";

interface ArticleBodyProps {
  markdown: string;
  className?: string;
}

function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

/**
 * Texto do artigo em Markdown (GFM). HTML cru não é interpretado, então o
 * conteúdo não consegue injetar scripts. Os títulos recebem id para o sumário.
 */
export default function ArticleBody({ markdown, className }: ArticleBodyProps) {
  const idByLine = new Map(extractToc(markdown).map((item) => [item.line, item.id]));

  const heading = (Tag: "h2" | "h3", classes: string): Components["h2"] => {
    function Heading({ node, children, ...props }: ComponentPropsWithoutRef<"h2"> & { node?: Element }) {
      const id = node?.position ? idByLine.get(node.position.start.line) : undefined;
      return (
        <Tag id={id} className={cn("scroll-mt-28 type-heading text-paper", classes)} {...props}>
          {children}
        </Tag>
      );
    }

    return Heading;
  };

  const components: Components = {
    h1: ({ node: _node, ...props }) => (
      <h2 className="type-heading mt-12 mb-4 scroll-mt-28 text-3xl text-paper md:text-4xl" {...props} />
    ),
    h2: heading("h2", "mt-14 mb-4 text-3xl md:text-4xl"),
    h3: heading("h3", "mt-10 mb-3 text-2xl md:text-[1.75rem]"),
    h4: ({ node: _node, ...props }) => <h4 className="type-heading mt-8 mb-2 text-xl text-paper" {...props} />,
    p: ({ node: _node, ...props }) => <p className="my-5 text-lg leading-[1.75] text-paper/85" {...props} />,
    a: ({ node: _node, href = "", ...props }) => (
      <a
        href={href}
        className="text-monitor underline decoration-monitor/40 underline-offset-4 transition-colors hover:decoration-monitor"
        {...(isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...props}
      />
    ),
    ul: ({ node: _node, ...props }) => (
      <ul className="my-5 list-disc space-y-2 pl-6 text-lg leading-[1.75] text-paper/85 marker:text-lamp" {...props} />
    ),
    ol: ({ node: _node, ...props }) => (
      <ol className="my-5 list-decimal space-y-2 pl-6 text-lg leading-[1.75] text-paper/85 marker:text-lamp" {...props} />
    ),
    li: ({ node: _node, ...props }) => <li className="pl-1" {...props} />,
    blockquote: ({ node: _node, ...props }) => (
      <blockquote className="my-8 border-l-2 border-lamp pl-5 text-xl leading-relaxed text-paper italic" {...props} />
    ),
    hr: () => <hr className="my-12 border-white/10" />,
    strong: ({ node: _node, ...props }) => <strong className="font-semibold text-paper" {...props} />,
    code: ({ node: _node, className: codeClass, ...props }) =>
      codeClass ? (
        <code className={cn(codeClass, "font-mono text-[0.9rem]")} {...props} />
      ) : (
        <code className="rounded bg-night-high px-1.5 py-0.5 font-mono text-[0.9em] text-lamp" {...props} />
      ),
    pre: ({ node: _node, ...props }) => (
      <pre
        className="my-6 overflow-x-auto rounded-2xl border border-white/10 bg-night-raised p-5 text-sm leading-relaxed text-paper/90"
        tabIndex={0}
        {...props}
      />
    ),
    table: ({ node: _node, ...props }) => (
      <div className="my-8 overflow-x-auto rounded-2xl border border-white/10" tabIndex={0}>
        <table className="w-full min-w-[32rem] border-collapse text-left text-base" {...props} />
      </div>
    ),
    th: ({ node: _node, ...props }) => (
      <th className="border-b border-white/10 bg-night-raised px-4 py-3 font-semibold text-paper" {...props} />
    ),
    td: ({ node: _node, ...props }) => (
      <td className="border-b border-white/[0.06] px-4 py-3 text-paper/85" {...props} />
    ),
    img: ({ node: _node, src, alt = "", ...props }) => (
      // Imagens do corpo podem vir de qualquer origem permitida no Markdown; <img> evita quebrar a página por host não configurado.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={typeof src === "string" ? src : undefined}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="my-8 h-auto w-full rounded-2xl border border-white/10"
        {...props}
      />
    ),
  };

  return (
    <div className={cn("max-w-[68ch]", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
