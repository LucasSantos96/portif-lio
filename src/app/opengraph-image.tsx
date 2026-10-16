import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { site } from "@/lib/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Busca a Bricolage Grotesque em TTF (o Satori não lê woff2). Se a rede
 * falhar no build, a imagem sai com a fonte padrão em vez de quebrar.
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

export default async function OpengraphImage() {
  const [poster, regular, bold] = await Promise.all([
    readFile(join(process.cwd(), "public/hero/hero-poster.jpg")),
    loadFont(400),
    loadFont(700),
  ]);
  const fonts = [
    regular && { name: "Bricolage", data: regular, weight: 400 as const, style: "normal" as const },
    bold && { name: "Bricolage", data: bold, weight: 700 as const, style: "normal" as const },
  ].filter((font) => font !== null);
  const posterSrc = `data:image/jpeg;base64,${poster.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ position: "relative", display: "flex", width: "100%", height: "100%", background: "#0e191c" }}>
        <img
          src={posterSrc}
          alt=""
          width={1200}
          height={675}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(90deg, rgba(14,25,28,0.96) 0%, rgba(14,25,28,0.82) 45%, rgba(14,25,28,0.25) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "72px 80px",
            width: "100%",
            height: "100%",
            color: "#e8eeec",
            fontFamily: fonts.length ? "Bricolage" : undefined,
          }}
        >
          <div style={{ fontSize: 104, fontWeight: 700, lineHeight: 0.95, letterSpacing: "-0.03em" }}>
            {site.name}
          </div>
          <div style={{ marginTop: 20, fontSize: 40, color: "#f2b36b" }}>{site.jobTitle}</div>
          <div style={{ marginTop: 16, fontSize: 30, color: "#94a8aa", maxWidth: 760 }}>
            Sites, sistemas web e agentes de IA para o seu negócio.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fonts.length ? fonts : undefined,
    },
  );
}
