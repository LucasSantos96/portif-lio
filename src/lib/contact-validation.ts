export interface ContactRequestBody {
  service?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export const CONTACT_SERVICES = [
  "Sites",
  "Sistemas Web",
  "Automações com n8n",
  "Consultoria & Implementação de ERP",
] as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactBody(body: ContactRequestBody): string | null {
  if (!body.service || !CONTACT_SERVICES.includes(body.service as (typeof CONTACT_SERVICES)[number])) {
    return "Selecione um serviço de interesse válido.";
  }

  if (!body.name || !body.name.trim()) {
    return "Preencha seu nome.";
  }

  if (!body.email || !EMAIL_REGEX.test(body.email)) {
    return "Informe um e-mail válido.";
  }

  if (!body.phone || !body.phone.trim()) {
    return "Informe um telefone/WhatsApp para contato.";
  }

  return null;
}
