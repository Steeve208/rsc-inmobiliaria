const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isListingUuid(value: string): boolean {
  return UUID_RE.test(value);
}

export async function runOptionalQuery<T>(
  query: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await query();
  } catch (error) {
    console.warn("[visits] optional query skipped", error);
    return fallback;
  }
}
