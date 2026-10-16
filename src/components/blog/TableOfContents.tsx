import type { TocItem } from "@/lib/blog";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  items: TocItem[];
  title: string;
}

export default function TableOfContents({ items, title }: TableOfContentsProps) {
  if (items.length < 3) {
    return null;
  }

  return (
    <nav aria-label={title} className="rounded-2xl border border-white/[0.08] bg-night-raised p-5">
      <p className="type-heading text-lg text-paper">{title}</p>
      <ol className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id} className={cn(item.level === 3 && "pl-4")}>
            <a href={`#${item.id}`} className="text-fog transition-colors hover:text-paper">
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
