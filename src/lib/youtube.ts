const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtu.be",
  "www.youtube-nocookie.com",
]);

const VIDEO_ID_REGEX = /^[A-Za-z0-9_-]{11}$/;

/**
 * Extrai o ID de um link do YouTube (watch, youtu.be, shorts, embed, live).
 * Retorna null quando o link não é do YouTube ou não tem um ID válido.
 */
export function getYoutubeId(rawUrl: string): string | null {
  let url: URL;

  try {
    url = new URL(rawUrl.trim());
  } catch {
    return null;
  }

  if (!YOUTUBE_HOSTS.has(url.hostname)) {
    return null;
  }

  let id: string | null = null;

  if (url.hostname === "youtu.be") {
    id = url.pathname.slice(1).split("/")[0];
  } else if (url.pathname === "/watch") {
    id = url.searchParams.get("v");
  } else {
    const [, kind, value] = url.pathname.split("/");
    if (kind === "shorts" || kind === "embed" || kind === "live") {
      id = value;
    }
  }

  return id && VIDEO_ID_REGEX.test(id) ? id : null;
}

export function getYoutubeThumbnail(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function getYoutubeEmbedUrl(id: string) {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
}
