import { NextResponse } from "next/server";

import {
  validateContactBody,
  type ContactRequestBody,
} from "@/lib/contact-validation";
import { sendContactConfirmation, sendContactNotification } from "@/lib/mailer";

export async function POST(request: Request) {
  const body = (await request.json()) as ContactRequestBody;
  const validationError = validateContactBody(body);

  if (validationError) {
    return NextResponse.json({ message: validationError }, { status: 400 });
  }

  const data = {
    service: body.service as string,
    name: body.name as string,
    email: body.email as string,
    phone: body.phone as string,
    message: body.message,
  };

  try {
    await sendContactNotification(data);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível enviar sua mensagem. Tente novamente.",
      },
      { status: 500 }
    );
  }

  try {
    await sendContactConfirmation(data);
  } catch (error) {
    console.error("Falha ao enviar e-mail de confirmação:", error);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
