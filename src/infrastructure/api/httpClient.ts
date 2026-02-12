import { APP_CONFIG } from "../../core/config/app.config";

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${APP_CONFIG.API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API Error");
  }

  // ✅ handle 204 No Content
  if (res.status === 204) {
    return null as T;
  }

  return res.json() as Promise<T>;
}
