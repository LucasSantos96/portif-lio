"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Adaptado do "Glowing Effect" (21st.dev): a borda e o fundo acendem
 * seguindo o ponteiro, como a luz da luminária batendo na mesa.
 */
export function GlowCard({
  className,
  children,
  onPointerMove,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--glow-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--glow-y", `${event.clientY - rect.top}px`);
    onPointerMove?.(event);
  };

  return (
    <div
      className={cn(
        "group/glow relative isolate overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-night-raised",
        className,
      )}
      onPointerMove={handlePointerMove}
      {...props}
    >
      <span
        aria-hidden
        className="glow-border pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/glow:opacity-100"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/glow:opacity-100"
        style={{
          background:
            "radial-gradient(480px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgb(242 179 107 / 0.07), transparent 60%)",
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
