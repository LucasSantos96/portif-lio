import nodemailer from "nodemailer";

export interface ContactEmailData {
  service: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
}

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "GMAIL_USER e GMAIL_PASSWORD precisam estar configurados no ambiente."
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export async function sendContactNotification(data: ContactEmailData) {
  const transporter = getTransporter();
  const ownerEmail = process.env.GMAIL_USER as string;

  await transporter.sendMail({
    from: ownerEmail,
    to: ownerEmail,
    replyTo: data.email,
    subject: `Novo contato pelo site — ${data.service}`,
    text: [
      `Serviço de interesse: ${data.service}`,
      `Nome: ${data.name}`,
      `Email: ${data.email}`,
      `Telefone: ${data.phone}`,
      `Mensagem: ${data.message?.trim() || "(não informada)"}`,
    ].join("\n"),
  });
}

export async function sendContactConfirmation(data: ContactEmailData) {
  const transporter = getTransporter();
  const ownerEmail = process.env.GMAIL_USER as string;

  await transporter.sendMail({
    from: ownerEmail,
    to: data.email,
    subject: "Recebemos seu contato!",
    text: [
      `Olá, ${data.name}!`,
      "",
      `Recebemos seu contato sobre "${data.service}" e retornaremos em breve.`,
      "",
      "Obrigado por entrar em contato!",
    ].join("\n"),
  });
}
