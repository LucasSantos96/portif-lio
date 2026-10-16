"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface TubelightNavItem {
  id: string;
  name: string;
  href: string;
  icon: LucideIcon;
}

interface TubelightNavbarProps {
  items: TubelightNavItem[];
  activeId: string | null;
  className?: string;
  /** Mostra só ícones (usado na barra inferior do celular). */
  compact?: boolean;
}

/**
 * Adaptado do "Tubelight Navbar" (21st.dev): pílula de navegação em que o
 * item ativo ganha uma luz que desliza entre os itens.
 */
export function TubelightNavbar({
  items,
  activeId,
  className,
  compact = false,
}: TubelightNavbarProps) {
  return (
    <ul
      className={cn(
        "flex items-center gap-1 rounded-full border border-white/10 bg-night/70 p-1 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] backdrop-blur-xl",
        className,
      )}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        const Icon = item.icon;

        return (
          <li key={item.id} className="relative">
            <Link
              href={item.href}
              aria-current={isActive ? "location" : undefined}
              aria-label={compact ? item.name : undefined}
              className={cn(
                "relative flex items-center justify-center rounded-full text-sm font-medium transition-colors duration-300",
                compact ? "size-11" : "px-4 py-2",
                isActive ? "text-paper" : "text-fog hover:text-paper",
              )}
            >
              {compact ? <Icon className="size-5" aria-hidden /> : item.name}

              {isActive ? (
                <motion.span
                  layoutId="tubelight"
                  className="absolute inset-0 -z-10 rounded-full bg-white/[0.06]"
                  transition={{ type: "spring", stiffness: 320, damping: 32 }}
                >
                  <span className="absolute -top-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-lamp">
                    <span className="absolute -top-2 -left-2 h-6 w-12 rounded-full bg-lamp/25 blur-md" />
                    <span className="absolute -top-1 h-6 w-8 rounded-full bg-lamp/20 blur-md" />
                    <span className="absolute top-0 left-2 h-4 w-4 rounded-full bg-lamp/20 blur-sm" />
                  </span>
                </motion.span>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
