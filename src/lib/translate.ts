import "server-only";

const MYMEMORY_ENDPOINT = "https://api.mymemory.translated.net/get";

interface MyMemoryResponse {
  responseData?: {
    translatedText?: string;
  };
}

export async function translateText(text: string): Promise<string | null> {
  const trimmed = text.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const url = new URL(MYMEMORY_ENDPOINT);
    url.searchParams.set("q", trimmed);
    url.searchParams.set("langpair", "pt|en");

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error("Erro ao traduzir texto (MyMemory):", response.status);
      return null;
    }

    const data = (await response.json()) as MyMemoryResponse;
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
