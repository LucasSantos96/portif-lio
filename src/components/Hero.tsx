"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Download, Pause, Play } from "lucide-react";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";

import { usePrefersReducedMotion } from "@/components/motion/MotionProvider";
import { useLocale } from "@/i18n/useLocale";

const EASE = [0.22, 1, 0.36, 1] as const;

const Hero: React.FC = () => {
    const { t } = useLocale();
    const reduceMotion = usePrefersReducedMotion();
    const sectionRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(true);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });
    const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
    const contentY = useTransform(scrollYProgress, [0, 1], [0, -90]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

    useEffect(() => {
        if (reduceMotion) {
            videoRef.current?.pause();
            setPlaying(false);
        }
    }, [reduceMotion]);

    const toggleVideo = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            void video.play();
            setPlaying(true);
        } else {
            video.pause();
            setPlaying(false);
        }
    };

    const whatsappHref = `https://wa.me/5522981073895?text=${encodeURIComponent(t.hero.whatsappMessage)}`;
    const words = t.hero.title.split(" ");

    return (
        <section
            ref={sectionRef}
            className="relative h-[100svh] min-h-[620px] overflow-hidden bg-night"
            aria-labelledby="hero-title"
        >
            <motion.div
                className="absolute inset-0"
                style={{ scale: reduceMotion ? 1 : videoScale }}
            >
                <video
                    ref={videoRef}
                    className="h-full w-full object-cover object-[65%_center]"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster="/hero/hero-poster.jpg"
                    aria-label={t.hero.videoLabel}
                >
                    <source src="/hero/hero.webm" type="video/webm" />
                    <source src="/hero/hero.mp4" type="video/mp4" />
                </video>
            </motion.div>

            {/* Sombra para leitura do texto: mais densa à esquerda e no rodapé. */}
            <div className="absolute inset-0 bg-gradient-to-r from-night/90 via-night/45 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-night via-night/60 to-transparent" />

            <motion.div
                className="relative z-10 mx-auto flex h-full max-w-[1240px] flex-col justify-end px-4 pb-28 md:px-8 md:pb-20"
                style={reduceMotion ? { y: 0, opacity: 1 } : { y: contentY, opacity: contentOpacity }}
            >
                <motion.p
                    className="mb-5 hidden text-base text-monitor md:block md:text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                >
                    {t.hero.name}
                </motion.p>

                <h1
                    id="hero-title"
                    key={t.hero.title}
                    className="type-display max-w-[16ch] text-[2.75rem] text-paper sm:text-6xl lg:text-[5.5rem]"
                >
                    {words.map((word, index) => (
                        <span key={`${word}-${index}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                            <motion.span
                                className="inline-block"
                                initial={{ y: "105%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.9, delay: 0.25 + index * 0.06, ease: EASE }}
                            >
                                {word}
                                {index < words.length - 1 ? " " : ""}
                            </motion.span>
                        </span>
                    ))}
                </h1>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.25 + words.length * 0.06 + 0.1, ease: EASE }}
                >
                    <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-paper/80 md:text-xl">
                        {t.hero.subtitle}
                    </p>

                    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                        <a
                            href={whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-13 items-center justify-center gap-2.5 rounded-full bg-lamp px-7 text-base font-semibold text-night shadow-[0_0_40px_-8px_var(--lamp)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_56px_-6px_var(--lamp)]"
                        >
                            <SiWhatsapp className="size-5" aria-hidden />
                            {t.hero.ctaWhatsapp}
                        </a>

                        <a
                            href="/Lucas-Santos-Full-stack.pdf"
                            download
                            aria-label={t.hero.ctaResumeAria}
                            className="inline-flex h-13 items-center justify-center gap-2.5 rounded-full border border-paper/20 bg-paper/5 px-7 text-base font-medium text-paper backdrop-blur-md transition-colors duration-300 hover:border-paper/40 hover:bg-paper/10"
                        >
                            <Download className="size-5" aria-hidden />
                            {t.hero.ctaResume}
                        </a>
                    </div>
                </motion.div>
            </motion.div>

            <button
                type="button"
                onClick={toggleVideo}
                aria-label={playing ? t.hero.pauseVideo : t.hero.playVideo}
                className="absolute top-20 right-4 z-10 flex size-10 items-center justify-center rounded-full border border-paper/15 bg-night/50 text-paper/80 backdrop-blur-md transition-colors hover:text-paper md:top-auto md:right-8 md:bottom-20"
            >
                {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
            </button>
        </section>
    );
};

export default Hero;
