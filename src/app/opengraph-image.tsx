import { ImageResponse } from "next/og";

import { loadOgAssets } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const { posterSrc, fonts } = await loadOgAssets();

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
