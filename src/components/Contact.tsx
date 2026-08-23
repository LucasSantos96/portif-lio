"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

const Contact: React.FC = () => {
    const { t } = useLocale();

    const [service, setService] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
        "idle"
    );
    const [errorMessage, setErrorMessage] = useState("");

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
                setErrorMessage(data.message ?? "Não foi possível enviar sua mensagem.");
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
            setErrorMessage("Não foi possível enviar sua mensagem. Tente novamente.");
        }
    }

    return (
        <section className="my-20 mx-4 text-white mb-14 flex flex-col items-center lg:mx-32 lg:py-28" id="contato">

            <div className="text-center mb-12">
                <h2 className="text-[20px] mb-5 lg:text-[40px]">{t.contact.title}</h2>
                <p className="text-[#b0afaf] text-sm lg:text-base max-w-2xl">
                    {t.contact.subtitle}
                </p>
            </div>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

                {/* Informações de Contato */}
                <div className="bg-white/10 backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl p-8">
                    <h3 className="text-xl font-semibold mb-6 text-center">{t.contact.infoTitle}</h3>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-[#0980ec] p-3 rounded-full">
                                <Image
                                    src="/mail.png"
                                    alt="Email"
                                    width={24}
                                    height={24}
                                    className=""
                                />
                            </div>
                            <div>
                                <p className="text-sm text-[#b0afaf]">{t.contact.emailLabel}</p>
                                <p className="font-medium">homeoficelucas@gmail.com</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="bg-[#0980ec] p-3 rounded-full">
                                <Image
                                    src="/whatsapp.png"
                                    alt="WhatsApp"
                                    width={24}
                                    height={24}
                                    className=""
                                />
                            </div>
                            <div>
                                <p className="text-sm text-[#b0afaf]">{t.contact.whatsappLabel}</p>
                                <p className="font-medium">+55 (22) 98107-3895</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="bg-[#0980ec] p-3 rounded-full">
                                <Image
                                    src="/github.png"
                                    alt="GitHub"
                                    width={24}
                                    height={24}
                                    className=""
                                />
                            </div>
                            <div>
                                <p className="text-sm text-[#b0afaf]">{t.contact.githubLabel}</p>
                                <p className="font-medium">github.com/LucasSantos96</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Formulário de Contato */}
                <div className="bg-white/10 backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl p-8">
                    <h3 className="text-xl font-semibold mb-6 text-center">
                        {t.contact.ctaText}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="contact-service">Serviço de interesse</Label>
                        <Select
                            value={service}
                            onValueChange={(value) => setService(value as string | null)}
                            required
                        >
                            <SelectTrigger id="contact-service">
                                <SelectValue placeholder="Selecione um serviço" />
                            </SelectTrigger>
                            <SelectContent>
                                {CONTACT_SERVICES.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="contact-name">Nome</Label>
                        <Input
                            id="contact-name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="contact-email">Email</Label>
                        <Input
                            id="contact-email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="contact-phone">Telefone/WhatsApp</Label>
                        <Input
                            id="contact-phone"
                            type="tel"
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="contact-message">
                            Mensagem (opcional)
                        </Label>
                        <Textarea
                            id="contact-message"
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            placeholder="Conte mais sobre o projeto"
                        />
                    </div>

                    {status === "error" && (
                        <p className="text-sm text-red-400">{errorMessage}</p>
                    )}

                    {status === "success" && (
                        <p className="text-sm text-green-400">
                            Mensagem enviada! Você vai receber uma confirmação por
                            e-mail.
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full bg-[#0980ec] hover:bg-[#0659a6] text-white font-medium py-3 rounded-full"
                    >
                        {status === "loading" ? "Enviando..." : "Enviar mensagem"}
                    </Button>
                    </form>
                </div>
            </div>

        </section>
    );
};

export default Contact;
