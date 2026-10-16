"use client";

import { MotionConfig } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Com reducedMotion="user" o Motion pula animações de posição/escala para
 * quem pede menos movimento, sem mudar o primeiro render (evita erro de
 * hidratação).
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/**
 * Preferência de "menos movimento" lida só depois de montar, para o HTML do
 * servidor e o primeiro render do cliente serem iguais.
 */
export function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduce;
}
