export async function shareListing(url: string, title: string) {
  if (typeof navigator !== "undefined" && navigator.share) {
    await navigator.share({ title, url });
    return "shared" as const;
  }

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    return "copied" as const;
  }

  return "unsupported" as const;
}
