"use client";

import * as React from "react";
import Image from "next/image";
import { Play } from "lucide-react";

import { getYoutubeEmbedUrl, getYoutubeThumbnail } from "@/lib/youtube";

interface YoutubeEmbedProps {
  videoId: string;
  title: string;
  playLabel: string;
}

/** Mostra só a miniatura e carrega o player do YouTube quando clicado. */
export function YoutubeEmbed({ videoId, title, playLabel }: YoutubeEmbedProps) {
  const [active, setActive] = React.useState(false);

  return (
    <div className="relative aspect-video overflow-hidden rounded-[1.25rem] border border-paper/[0.08] bg-night-high">
      {active ? (
        <iframe
          src={getYoutubeEmbedUrl(videoId)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={playLabel}
          className="group absolute inset-0"
        >
          <Image
            src={getYoutubeThumbnail(videoId)}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          <span className="absolute inset-0 bg-night/30 transition-colors group-hover:bg-night/15" />
          <span className="absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-lamp text-night shadow-[0_0_40px_-6px_var(--lamp)] transition-transform duration-300 group-hover:scale-110">
            <Play className="ml-1 size-7 fill-current" aria-hidden />
          </span>
        </button>
      )}
    </div>
  );
}
