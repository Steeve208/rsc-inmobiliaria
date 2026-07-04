export function toVirtualTourEmbedUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";

  try {
    const parsed = new URL(trimmed);

    if (parsed.hostname.includes("matterport.com")) {
      return trimmed;
    }

    if (parsed.hostname.includes("kuula.co")) {
      if (!parsed.searchParams.has("logo")) {
        parsed.searchParams.set("logo", "0");
        parsed.searchParams.set("info", "0");
        parsed.searchParams.set("fs", "1");
      }
      return parsed.toString();
    }

    if (parsed.hostname.includes("roundme.com") || parsed.hostname.includes("cloudpano.com")) {
      return trimmed;
    }

    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}`;
    }

    return trimmed;
  } catch {
    return trimmed;
  }
}
