import * as React from "react";

import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  reverse?: boolean;
  /** Segundos para uma volta completa. */
  duration?: number;
  gap?: string;
  className?: string;
}

/**
 * Adaptado do "Marquee" (21st.dev): faixa infinita só com CSS, pausa no
 * hover e some nas bordas com máscara.
 */
export function Marquee({
  children,
  reverse = false,
  duration = 40,
  gap = "1rem",
  className,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
      style={
        {
          "--marquee-duration": `${duration}s`,
          "--marquee-gap": gap,
        } as React.CSSProperties
      }
    >
      <div
        className="flex w-max shrink-0 animate-marquee gap-[var(--marquee-gap)] group-hover:[animation-play-state:paused]"
        style={{ animationDirection: reverse ? "reverse" : "normal" }}
      >
        {children}
        <div aria-hidden className="contents">
          {children}
        </div>
      </div>
    </div>
  );
}
