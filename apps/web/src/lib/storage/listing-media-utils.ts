export function isDirectVideoUrl(url: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url);
}

function withQueryParams(url: string, params: Record<string, string>) {
  try {
    const parsed = new URL(url);
    for (const [key, value] of Object.entries(params)) {
      if (!parsed.searchParams.has(key)) {
        parsed.searchParams.set(key, value);
      }
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

/** Normalize listing video URLs to a playable embed or direct file URL. */
export function toVideoEmbedUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return "";

  if (isDirectVideoUrl(trimmed)) return trimmed;

  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      // Already an embed path
      if (parsed.pathname.includes("/embed/")) return trimmed;
    }
    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (parsed.hostname.includes("vimeo.com")) {
      if (parsed.hostname.includes("player.vimeo.com")) return trimmed;
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    return trimmed;
  }

  return trimmed;
}

/**
 * Same as toVideoEmbedUrl, but prefers HD playback for hosted embeds.
 * Direct files are returned unchanged (original bitrate/resolution).
 */
export function toHighQualityVideoEmbedUrl(url: string) {
  const embed = toVideoEmbedUrl(url);
  if (!embed || isDirectVideoUrl(embed)) return embed;

  try {
    const parsed = new URL(embed);
    if (parsed.hostname.includes("youtube.com")) {
      return withQueryParams(embed, {
        rel: "0",
        modestbranding: "1",
        // Hint higher default quality when the player is large enough.
        vq: "hd1080",
      });
    }
    if (parsed.hostname.includes("vimeo.com")) {
      return withQueryParams(embed, {
        quality: "1080p",
        dnt: "1",
      });
    }
  } catch {
    return embed;
  }

  return embed;
}

export function isPdfFloorPlanUrl(url: string) {
  return /\.pdf(\?|$)/i.test(url.trim());
}
