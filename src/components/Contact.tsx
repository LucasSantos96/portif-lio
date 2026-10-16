"use client"

import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { SiWhatsapp } from '@icons-pack/react-simple-icons';

import Reveal from '@/components/motion/Reveal';
import SectionHeading, { sectionContainer } from '@/components/SectionHeading';
import { useLocale } from '@/i18n/useLocale';
import ContactForm from "@/components/ContactForm";

const Contact: React.FC = () => {
    const { t } = useLocale();
    const channels = [
        { label: t.contact.whatsappLabel, value: "+55 (22) 98107-3895", href: "https://wa.me/5522981073895", icon: <SiWhatsapp className="size-5" aria-hidden /> },
        { label: t.contact.emailLabel, value: "homeoficelucas@gmail.com", href: "mailto:homeoficelucas@gmail.com", icon: <Mail className="size-5" aria-hidden /> },
        { label: t.contact.linkedinLabel, value: "Lucas Santos de Oliveira", href: "https://www.linkedin.com/in/lucassantosdeoliveira-dev/", icon: <Linkedin className="size-5" aria-hidden /> },
        { label: t.contact.githubLabel, value: "LucasSantos96", href: "https://github.com/LucasSantos96", icon: <Github className="size-5" aria-hidden /> },
    ];

    return (
        <section id="contato" aria-labelledby="contato-title" className="scroll-mt-24 py-20 md:py-28">
            <div className={`${sectionContainer} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
                <div className="lg:col-span-5">
                    <SectionHeading id="contato-title" title={t.contact.title} intro={t.contact.subtitle} />

                    <Reveal delay={0.05}>
                        <p className="mb-4 text-fog">{t.contact.channelsTitle}</p>
                        <ul className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
                            {channels.map((channel) => (
                                <li key={channel.label}>
                                    <a
                                        href={channel.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-4 py-4"
                                    >
                                        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/10 text-monitor transition-colors group-hover:border-monitor/40 group-hover:bg-monitor/10">
                                            {channel.icon}
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block text-sm text-fog">{channel.label}</span>
                                            <span className="block truncate text-paper transition-colors group-hover:text-monitor">
                                                {channel.value}
                                            </span>
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </div>

                <Reveal delay={0.1} className="lg:col-span-7">
                    <ContactForm />
                </Reveal>
            </div>
        </section>
    );
};

export default Contact;
