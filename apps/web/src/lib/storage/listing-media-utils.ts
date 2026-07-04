export function isDirectVideoUrl(url: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url);
}

export function toVideoEmbedUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return "";

  if (isDirectVideoUrl(trimmed)) return trimmed;

  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (parsed.hostname.includes("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    return trimmed;
  }

  return trimmed;
}

export function isPdfFloorPlanUrl(url: string) {
  return /\.pdf(\?|$)/i.test(url.trim());
}
