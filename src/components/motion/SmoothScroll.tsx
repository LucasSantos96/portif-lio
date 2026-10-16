"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

let instance: Lenis | null = null;

/** Pausa a rolagem suave (ex.: enquanto um modal está aberto). */
export function stopSmoothScroll() {
  instance?.stop();
}

export function startSmoothScroll() {
  instance?.start();
}

/**
 * Rolagem com inércia leve via Lenis. Não liga quando o visitante pede
 * menos movimento no sistema operacional.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    instance = new Lenis({
      lerp: 0.12,
      autoRaf: true,
      anchors: { offset: -24 },
    });

    return () => {
      instance?.destroy();
      instance = null;
    };
  }, []);

  useEffect(() => {
    if (!window.location.hash) {
      instance?.scrollTo(0, { immediate: true });
    }
    instance?.resize();
  }, [pathname]);

  return null;
}
