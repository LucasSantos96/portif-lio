"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { startSmoothScroll, stopSmoothScroll } from "@/components/motion/SmoothScroll";

export interface LightboxImage {
  src: string;
  alt: string;
}

interface LightboxProps {
  images: LightboxImage[];
  index: number | null;
  onIndexChange: (index: number | null) => void;
  labels: {
    close: string;
    previous: string;
    next: string;
    counter: (current: number, total: number) => string;
  };
}

const SWIPE_THRESHOLD = 80;

export function Lightbox({ images, index, onIndexChange, labels }: LightboxProps) {
  const reduceMotion = useReducedMotion();
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const returnFocusRef = React.useRef<HTMLElement | null>(null);
  const [direction, setDirection] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);
  const isOpen = index !== null;

  React.useEffect(() => setMounted(true), []);
  const total = images.length;

  const go = React.useCallback(
    (step: number) => {
      if (index === null) return;
      setDirection(step);
      onIndexChange((index + step + total) % total);
    },
    [index, onIndexChange, total],
  );

  const close = React.useCallback(() => onIndexChange(null), [onIndexChange]);

  React.useEffect(() => {
    if (!isOpen) return;

    returnFocusRef.current = document.activeElement as HTMLElement | null;
    stopSmoothScroll();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      startSmoothScroll();
      returnFocusRef.current?.focus();
    };
  }, [isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      close();
    } else if (event.key === "ArrowRight") {
      go(1);
    } else if (event.key === "ArrowLeft") {
      go(-1);
    } else if (event.key === "Tab" && dialogRef.current) {
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled])");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  if (!mounted) return null;

  const current = index !== null ? images[index] : null;
  const offset = reduceMotion ? 0 : 60;

  return createPortal(
    <AnimatePresence>
      {current ? (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          onKeyDown={handleKeyDown}
          className="fixed inset-0 z-[60] flex flex-col bg-night/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex items-center justify-between px-4 py-4 md:px-8">
            <p className="text-sm text-fog" aria-live="polite">
              {labels.counter((index ?? 0) + 1, total)}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label={labels.close}
              className="flex size-11 items-center justify-center rounded-full border border-paper/15 text-paper transition-colors hover:bg-paper/10"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-8 md:px-24">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={index}
                className="relative h-full w-full"
                custom={direction}
                initial={{ opacity: 0, x: direction * offset }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -offset }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                drag={total > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -SWIPE_THRESHOLD) go(1);
                  else if (info.offset.x > SWIPE_THRESHOLD) go(-1);
                }}
              >
                <Image
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="100vw"
                  className="pointer-events-none object-contain select-none"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {total > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={labels.previous}
                  className="absolute left-3 flex size-12 items-center justify-center rounded-full border border-paper/15 bg-night/60 text-paper backdrop-blur-md transition-colors hover:bg-paper/10 md:left-8"
                >
                  <ChevronLeft className="size-6" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={labels.next}
                  className="absolute right-3 flex size-12 items-center justify-center rounded-full border border-paper/15 bg-night/60 text-paper backdrop-blur-md transition-colors hover:bg-paper/10 md:right-8"
                >
                  <ChevronRight className="size-6" aria-hidden />
                </button>
              </>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
