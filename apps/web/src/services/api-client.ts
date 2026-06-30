const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type RequestOptions = RequestInit & {
  params?: Record<string, string>;
};

export async function apiClient<T>(
  endpoint: string,
  { params, ...options }: RequestOptions = {},
): Promise<T> {
  const url = new URL(endpoint, API_BASE || "http://localhost:3000");

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
