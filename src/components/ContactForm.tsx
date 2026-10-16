"use client";

import React, { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "@/i18n/useLocale";
import { CONTACT_SERVICES } from "@/lib/contact-validation";
import { cn } from "@/lib/utils";

const fieldClass = "h-12 rounded-xl border-white/10 bg-night px-4 text-base md:text-base dark:bg-night";

interface ContactFormProps {
    /** De onde o contato veio (ex.: título de um artigo). Vai junto no e-mail para você. */
    source?: string;
    className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ source, className }) => {
    const { t } = useLocale();
    const f = t.contact.form;
    const uid = useId();

    const [service, setService] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const serviceLabels = Object.fromEntries(
        CONTACT_SERVICES.map((value, index) => [value, f.serviceOptions[index] ?? value])
    );

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ service, name, email, phone, message, source }),
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
        <form
            onSubmit={handleSubmit}
            className={cn("space-y-5 rounded-[1.75rem] border border-white/[0.08] bg-night-raised p-6 md:p-10", className)}
        >
            <div className="space-y-2">
                <Label htmlFor={`${uid}-service`}>{f.service}</Label>
                <Select
                    items={serviceLabels}
                    value={service}
                    onValueChange={(value) => setService(value as string | null)}
                    required
                >
                    <SelectTrigger id={`${uid}-service`} className={fieldClass}>
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
                    <Label htmlFor={`${uid}-name`}>{f.name}</Label>
                    <Input
                        id={`${uid}-name`}
                        autoComplete="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className={fieldClass}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor={`${uid}-phone`}>{f.phone}</Label>
                    <Input
                        id={`${uid}-phone`}
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
                <Label htmlFor={`${uid}-email`}>{f.email}</Label>
                <Input
                    id={`${uid}-email`}
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className={fieldClass}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor={`${uid}-message`}>{f.message}</Label>
                <Textarea
                    id={`${uid}-message`}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder={f.messagePlaceholder}
                    className="min-h-32 rounded-xl border-white/10 bg-night px-4 py-3 text-base md:text-base dark:bg-night"
                />
            </div>

            <div aria-live="polite">
                {status === "error" && <p className="text-sm text-destructive">{errorMessage}</p>}
                {status === "success" && <p className="text-sm text-monitor">{f.success}</p>}
            </div>

            <Button
                type="submit"
                disabled={status === "loading"}
                className="h-13 w-full rounded-full bg-lamp text-base font-semibold text-night hover:bg-lamp/90"
            >
                {status === "loading" ? f.sending : f.submit}
            </Button>
        </form>
    );
};

export default ContactForm;
