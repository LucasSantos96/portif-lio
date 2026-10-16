import Link from "next/link";

import { cn } from "@/lib/utils";

export type UploadTab = "projetos" | "artigos";

const tabs: { id: UploadTab; label: string; href: string }[] = [
  { id: "projetos", label: "Projetos e ferramentas", href: "/upload" },
  { id: "artigos", label: "Artigos do blog", href: "/upload?tab=artigos" },
];

export default function UploadTabs({ active }: { active: UploadTab }) {
  return (
    <nav aria-label="Seções do painel" className="mx-auto mt-6 w-full max-w-6xl px-4">
      <ul className="inline-flex gap-1 rounded-full border border-white/10 bg-night-raised p-1">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <Link
              href={tab.href}
              aria-current={active === tab.id ? "page" : undefined}
              className={cn(
                "block rounded-full px-4 py-2 text-sm font-medium transition-colors",
                active === tab.id ? "bg-lamp text-night" : "text-zinc-300 hover:text-white",
              )}
            >
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
