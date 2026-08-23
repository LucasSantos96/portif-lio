const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const MYMEMORY_MAX_QUERY_LENGTH = 500;

async function translateText(text) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  if (trimmed.length > MYMEMORY_MAX_QUERY_LENGTH) {
    console.error(
      "Erro ao traduzir texto (MyMemory): texto excede o limite de 500 caracteres",
    );
    return null;
  }

  try {
    const url = new URL("https://api.mymemory.translated.net/get");
    url.searchParams.set("q", trimmed);
    url.searchParams.set("langpair", "pt|en");

    const response = await fetch(url.toString());
    if (!response.ok) {
      console.error("Erro ao traduzir texto (MyMemory):", response.status);
      return null;
    }

    const data = await response.json();

    if (String(data?.responseStatus) !== "200") {
      console.error(
        "Erro ao traduzir texto (MyMemory): responseStatus inválido",
        data?.responseStatus,
      );
      return null;
    }

    const translated = data?.responseData?.translatedText;

    if (typeof translated !== "string" || !translated.trim()) {
      return null;
    }

    return translated;
  } catch (error) {
    console.error("Erro ao traduzir texto (MyMemory):", error);
    return null;
  }
}

async function main() {
  const pending = await prisma.portfolioProject.findMany({
    where: {
      OR: [{ titleEn: null }, { descriptionEn: null }],
    },
  });

  console.log(`Projetos pendentes de tradução: ${pending.length}`);

  for (const project of pending) {
    const [titleEn, descriptionEn] = await Promise.all([
      project.titleEn ? Promise.resolve(project.titleEn) : translateText(project.title),
      project.descriptionEn
        ? Promise.resolve(project.descriptionEn)
        : translateText(project.description),
    ]);

    if (titleEn === null && descriptionEn === null) {
      console.log(
        `Ignorado (tradução falhou, ainda pendente): "${project.title}"`,
      );
    } else {
      await prisma.portfolioProject.update({
        where: { id: project.id },
        data: { titleEn, descriptionEn },
      });

      console.log(`Traduzido: "${project.title}" -> "${titleEn ?? "(falhou)"}"`);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("Backfill concluído.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
