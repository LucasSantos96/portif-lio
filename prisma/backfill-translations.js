const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function translateText(text) {
  const trimmed = text.trim();
  if (!trimmed) return null;

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

    await prisma.portfolioProject.update({
      where: { id: project.id },
      data: { titleEn, descriptionEn },
    });

    console.log(`Traduzido: "${project.title}" -> "${titleEn ?? "(falhou)"}"`);
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
