import "server-only";

const MYMEMORY_ENDPOINT = "https://api.mymemory.translated.net/get";

const MYMEMORY_MAX_QUERY_LENGTH = 500;

interface MyMemoryResponse {
  responseData?: {
    translatedText?: string;
  };
  responseStatus?: string | number;
}

export async function translateText(text: string): Promise<string | null> {
  const trimmed = text.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.length > MYMEMORY_MAX_QUERY_LENGTH) {
    console.error(
      "Erro ao traduzir texto (MyMemory): texto excede o limite de 500 caracteres",
    );
    return null;
  }

  try {
    const url = new URL(MYMEMORY_ENDPOINT);
    url.searchParams.set("q", trimmed);
    url.searchParams.set("langpair", "pt|en");

    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error("Erro ao traduzir texto (MyMemory):", response.status);
      return null;
    }

    const data = (await response.json()) as MyMemoryResponse;

    if (String(data.responseStatus) !== "200") {
      console.error(
        "Erro ao traduzir texto (MyMemory): responseStatus inválido",
        data.responseStatus,
      );
      return null;
    }

    const translated = data.responseData?.translatedText;

    if (typeof translated !== "string" || !translated.trim()) {
      return null;
    }

    return translated;
  } catch (error) {
    console.error("Erro ao traduzir texto (MyMemory):", error);
    return null;
  }
}
