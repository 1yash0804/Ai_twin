const TOKEN_KEY = "ai_twin_token";

export function saveToken(token: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(TOKEN_KEY);
}

export function getUsernameFromToken(token: string | null): string | null {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = JSON.parse(atob(padded)) as { sub?: string };
    return decoded.sub ?? null;
  } catch {
    return null;
  }
}
