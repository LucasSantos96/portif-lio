"use client"

import React, { useState } from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { SiWhatsapp } from '@icons-pack/react-simple-icons';

import Reveal from '@/components/motion/Reveal';
import SectionHeading, { sectionContainer } from '@/components/SectionHeading';
import { useLocale } from '@/i18n/useLocale';
import { CONTACT_SERVICES } from "@/lib/contact-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const fieldClass = "h-12 rounded-xl border-white/10 bg-night px-4 text-base md:text-base dark:bg-night";

const Contact: React.FC = () => {
    const { t } = useLocale();
    const f = t.contact.form;

    const [service, setService] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
        "idle"
    );
    const [errorMessage, setErrorMessage] = useState("");

    const serviceLabels = Object.fromEntries(
        CONTACT_SERVICES.map((value, index) => [value, f.serviceOptions[index] ?? value])
    );

    const channels = [
        { label: t.contact.whatsappLabel, value: "+55 (22) 98107-3895", href: "https://wa.me/5522981073895", icon: <SiWhatsapp className="size-5" aria-hidden /> },
        { label: t.contact.emailLabel, value: "homeoficelucas@gmail.com", href: "mailto:homeoficelucas@gmail.com", icon: <Mail className="size-5" aria-hidden /> },
        { label: t.contact.linkedinLabel, value: "Lucas Santos de Oliveira", href: "https://www.linkedin.com/in/lucassantosdeoliveira-dev/", icon: <Linkedin className="size-5" aria-hidden /> },
        { label: t.contact.githubLabel, value: "LucasSantos96", href: "https://github.com/LucasSantos96", icon: <Github className="size-5" aria-hidden /> },
    ];

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ service, name, email, phone, message }),
            });

            const data = (await response.json()) as {
                ok?: boolean;
                message?: string;
            };

            if (!response.ok) {
                setStatus("error");
                setErrorMessage(data.message ?? f.error);
                return;
            }

            setStatus("success");
            setService(null);
            setName("");
            setEmail("");
            setPhone("");
            setMessage("");
        } catch {
            setStatus("error");
            setErrorMessage(f.error);
        }
    }

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
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5 rounded-[1.75rem] border border-white/[0.08] bg-night-raised p-6 md:p-10"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="contact-service">{f.service}</Label>
                            <Select
                                items={serviceLabels}
                                value={service}
                                onValueChange={(value) => setService(value as string | null)}
                                required
                            >
                                <SelectTrigger id="contact-service" className={fieldClass}>
                                    <SelectValue placeholder={f.servicePlaceholder} />
                                </SelectTrigger>
                                <SelectContent>
                                    {CONTACT_SERVICES.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {serviceLabels[option]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="contact-name">{f.name}</Label>
                                <Input
                                    id="contact-name"
                                    autoComplete="name"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    className={fieldClass}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contact-phone">{f.phone}</Label>
                                <Input
                                    id="contact-phone"
                                    type="tel"
                                    autoComplete="tel"
                                    value={phone}
                                    onChange={(event) => setPhone(event.target.value)}
                                    className={fieldClass}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contact-email">{f.email}</Label>
                            <Input
                                id="contact-email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className={fieldClass}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contact-message">{f.message}</Label>
                            <Textarea
                                id="contact-message"
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                placeholder={f.messagePlaceholder}
                                className="min-h-32 rounded-xl border-white/10 bg-night px-4 py-3 text-base md:text-base dark:bg-night"
                            />
                        </div>

                        <div aria-live="polite">
                            {status === "error" && (
                                <p className="text-sm text-destructive">{errorMessage}</p>
                            )}
                            {status === "success" && (
                                <p className="text-sm text-monitor">{f.success}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={status === "loading"}
                            className="h-13 w-full rounded-full bg-lamp text-base font-semibold text-night hover:bg-lamp/90"
                        >
                            {status === "loading" ? f.sending : f.submit}
                        </Button>
                    </form>
                </Reveal>
            </div>
        </section>
    );
};

export default Contact;
