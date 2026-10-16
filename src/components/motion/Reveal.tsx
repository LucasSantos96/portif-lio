"use client";

import { motion, type HTMLMotionProps } from "motion/react";

/**
 * Props de animação da entrada ao rolar, para usar em qualquer `motion.*`.
 * Quem pede menos movimento vê só o fade (ver MotionProvider).
 */
export function revealProps(delay = 0) {
  return {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "0px 0px -12% 0px" },
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
  } as const;
}

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
}

/** Entrada discreta quando o bloco aparece na tela (uma vez só). */
export default function Reveal({ delay = 0, children, ...props }: RevealProps) {
  return (
    <motion.div {...revealProps(delay)} {...props}>
      {children}
    </motion.div>
  );
}
