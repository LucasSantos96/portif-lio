import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Busca a Bricolage Grotesque em TTF (o Satori não lê woff2). Se a rede
 * falhar, a imagem sai com a fonte padrão em vez de quebrar.
 */
async function loadFont(weight: 400 | 700) {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@96,${weight}`,
    ).then((response) => response.text());
    const fontUrl = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];

    return fontUrl ? await fetch(fontUrl).then((response) => response.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

export async function loadOgAssets() {
  const [poster, regular, bold] = await Promise.all([
    readFile(join(process.cwd(), "public/hero/hero-poster.jpg")),
    loadFont(400),
    loadFont(700),
  ]);

  const fonts = [
    regular && { name: "Bricolage", data: regular, weight: 400 as const, style: "normal" as const },
    bold && { name: "Bricolage", data: bold, weight: 700 as const, style: "normal" as const },
  ].filter((font) => font !== null);

  return {
    posterSrc: `data:image/jpeg;base64,${poster.toString("base64")}`,
    fonts,
  };
}
