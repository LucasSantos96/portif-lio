"use client";

import React from 'react'
import { usePathname } from 'next/navigation';
import { Github, Linkedin, Mail } from 'lucide-react';
import { SiWhatsapp } from '@icons-pack/react-simple-icons';

import { sectionContainer } from '@/components/SectionHeading';
import { useLocale } from '@/i18n/useLocale';

const Footer: React.FC = () => {
    const { t } = useLocale();
    const pathname = usePathname();

    const links = [
        { href: "https://wa.me/5522981073895", label: t.footer.whatsappAria, icon: <SiWhatsapp className="size-5" aria-hidden /> },
        { href: "mailto:homeoficelucas@gmail.com", label: t.footer.emailAria, icon: <Mail className="size-5" aria-hidden /> },
        { href: "https://www.linkedin.com/in/lucassantosdeoliveira-dev/", label: t.footer.linkedinAria, icon: <Linkedin className="size-5" aria-hidden /> },
        { href: "https://github.com/LucasSantos96", label: t.footer.githubAria, icon: <Github className="size-5" aria-hidden /> },
    ];

    if (pathname.startsWith("/upload")) {
        return null;
    }

    return (
        <footer className="border-t border-paper/[0.08] pb-24 md:pb-0">
            <div className={`${sectionContainer} flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between`}>
                <div>
                    <p className="type-heading text-2xl text-paper">Lucas Santos</p>
                    <p className="text-fog">{t.footer.role}</p>
                </div>

                <ul className="flex gap-2">
                    {links.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={link.label}
                                className="flex size-11 items-center justify-center rounded-full border border-paper/10 text-fog transition-colors hover:border-paper/25 hover:text-paper"
                            >
                                {link.icon}
                            </a>
                        </li>
                    ))}
                </ul>

                <p className="text-sm text-fog">
                    © {new Date().getFullYear()} Lucas Santos. {t.footer.rights}
                </p>
            </div>
        </footer>
    )
}

export default Footer
