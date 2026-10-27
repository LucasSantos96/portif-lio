"use client";

import React from "react";
import { Bot, Cable, DatabaseZap, ListOrdered } from "lucide-react";
import {
    SiBootstrap,
    SiCss,
    SiDocker,
    SiGit,
    SiHtml5,
    SiJavascript,
    SiLangchain,
    SiLanggraph,
    SiMongodb,
    SiMysql,
    SiN8n,
    SiNestjs,
    SiNextdotjs,
    SiNodedotjs,
    SiPostgresql,
    SiPrisma,
    SiPython,
    SiReact,
    SiRedis,
    SiSupabase,
    SiTailwindcss,
    SiTypescript,
} from "@icons-pack/react-simple-icons";

import Reveal from "@/components/motion/Reveal";
import SectionHeading, { sectionContainer } from "@/components/SectionHeading";
import { Marquee } from "@/components/ui/marquee";
import { useLocale } from "@/i18n/useLocale";

interface Skill {
    name: string;
    icon: React.ReactNode;
}

const size = 28;

// Faixa de cima: interface e IA. Faixa de baixo: back-end, dados e infraestrutura.
const frontEndAndAi: Skill[] = [
    { name: "TypeScript", icon: <SiTypescript size={size} color="#3178C6" /> },
    { name: "React", icon: <SiReact size={size} color="#61DAFB" /> },
    { name: "Next.js", icon: <SiNextdotjs size={size} color="currentColor" /> },
    { name: "Tailwind CSS", icon: <SiTailwindcss size={size} color="#06B6D4" /> },
    { name: "JavaScript", icon: <SiJavascript size={size} color="#F7DF1E" /> },
    { name: "HTML5", icon: <SiHtml5 size={size} color="#E34F26" /> },
    { name: "CSS3", icon: <SiCss size={size} color="#1572B6" /> },
    { name: "Bootstrap", icon: <SiBootstrap size={size} color="#7952B3" /> },
    { name: "n8n", icon: <SiN8n size={size} color="#EA4B71" /> },
    { name: "LangChain", icon: <SiLangchain size={size} color="currentColor" /> },
    { name: "LangGraph", icon: <SiLanggraph size={size} color="currentColor" /> },
    { name: "Mastra", icon: <Bot size={size} /> },
    { name: "RAG e PGVector", icon: <DatabaseZap size={size} /> },
];

const backEndAndData: Skill[] = [
    { name: "Python", icon: <SiPython size={size} color="#3776AB" /> },
    { name: "Node.js", icon: <SiNodedotjs size={size} color="#339933" /> },
    { name: "NestJS", icon: <SiNestjs size={size} color="#E0234E" /> },
    { name: "PostgreSQL", icon: <SiPostgresql size={size} color="#4169E1" /> },
    { name: "Prisma", icon: <SiPrisma size={size} color="currentColor" /> },
    { name: "Redis", icon: <SiRedis size={size} color="#FF4438" /> },
    { name: "BullMQ", icon: <ListOrdered size={size} /> },
    { name: "WebSockets", icon: <Cable size={size} /> },
    { name: "Docker", icon: <SiDocker size={size} color="#2496ED" /> },
    { name: "Supabase", icon: <SiSupabase size={size} color="#3FCF8E" /> },
    { name: "MySQL", icon: <SiMysql size={size} color="#4479A1" /> },
    { name: "MongoDB", icon: <SiMongodb size={size} color="#47A248" /> },
    { name: "Git", icon: <SiGit size={size} color="#F05032" /> },
];

function SkillPill({ skill }: { skill: Skill }) {
    return (
        <div className="group/item flex items-center gap-3 rounded-2xl border border-paper/[0.08] bg-night-raised px-5 py-4 text-paper transition-colors duration-300 hover:border-paper/20">
            <span className="flex text-paper opacity-70 grayscale brightness-150 transition duration-300 group-hover/item:opacity-100 group-hover/item:grayscale-0 group-hover/item:brightness-100 in-data-[theme=light]:opacity-90 in-data-[theme=light]:brightness-50 in-data-[theme=light]:group-hover/item:brightness-100">
                {skill.icon}
            </span>
            <span className="text-base font-medium whitespace-nowrap">{skill.name}</span>
        </div>
    );
}

const Skills: React.FC = () => {
    const { t } = useLocale();

    return (
        <section id="habilidades" aria-labelledby="habilidades-title" className="scroll-mt-24 py-20 md:py-28">
            <div className={sectionContainer}>
                <SectionHeading id="habilidades-title" title={t.skills.title} intro={t.skills.intro} />
            </div>

            <Reveal className="mx-auto max-w-[1400px] space-y-4">
                <Marquee duration={45}>
                    {frontEndAndAi.map((skill) => (
                        <SkillPill key={skill.name} skill={skill} />
                    ))}
                </Marquee>
                <Marquee duration={55} reverse>
                    {backEndAndData.map((skill) => (
                        <SkillPill key={skill.name} skill={skill} />
                    ))}
                </Marquee>
            </Reveal>
        </section>
    );
};

export default Skills;
