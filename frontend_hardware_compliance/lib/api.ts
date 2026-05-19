import { getAccessToken } from "./auth-storage";

export function apiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8001";
  return base.replace(/\/$/, "");
}

export async function apiFetch(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<Response> {
  const url = `${apiBase()}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (options.auth !== false) {
    const t = getAccessToken();
    if (t) {
      headers.set("Authorization", `Bearer ${t}`);
    }
  }
  const { auth: _a, ...rest } = options;
  return fetch(url, { ...rest, headers });
}
