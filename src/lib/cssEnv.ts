/**
 * CSS / public URL SoT — read from env only.
 * Client: NEXT_PUBLIC_* (inlined at build).
 * Server: CSS_AUTH_URL (+ same NEXT_PUBLIC_*).
 */

function trimSlash(s: string): string {
  return s.trim().replace(/\/$/, "");
}

/** Upstream CSS base for server fetch / JWKS / BFF proxy. */
export function cssAuthUrl(): string {
  const v = process.env.CSS_AUTH_URL?.trim();
  if (v) return trimSlash(v);
  // Local-only last resort when .env missing (never bake delena.buzz here)
  return "http://127.0.0.1:9000";
}

/** JWT iss the client/server expect (must match CSS issuer claim). */
export function cssIssuer(): string {
  const v = process.env.NEXT_PUBLIC_CSS_ISSUER?.trim();
  if (v) return trimSlash(v);
  return cssAuthUrl();
}

export type CssAuthMode = "password" | "hybrid" | "oauth";

export function cssAuthMode(): CssAuthMode {
  const v = (process.env.NEXT_PUBLIC_CSS_AUTH_MODE || "password").toLowerCase();
  if (v === "oauth" || v === "hybrid") return "hybrid";
  return "password";
}

/**
 * Optional fixed OAuth redirect. Prefer blank — browser uses window.location.origin.
 * When set (e.g. docs/smoke), must match css-next allow-list exactly.
 */
export function cssOauthRedirectUri(): string | undefined {
  const v = process.env.NEXT_PUBLIC_CSS_OAUTH_REDIRECT_URI?.trim();
  return v ? trimSlash(v) : undefined;
}

/** Public ProdDeck base (home-dev / staging / prod). */
export function appPublicUrl(): string | undefined {
  const v =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.PRODDECK_PUBLIC_URL?.trim();
  return v ? trimSlash(v) : undefined;
}

/** Hostnames treated as "DEV" for UX hints (comma-separated). */
export function devHostnames(): string[] {
  const raw =
    process.env.NEXT_PUBLIC_DEV_HOSTS?.trim() ||
    "localhost,127.0.0.1";
  return raw
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
}

export function isDevHostname(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (devHostnames().includes(h)) return true;
  const app = appPublicUrl();
  if (app) {
    try {
      if (new URL(app).hostname.toLowerCase() === h) return true;
    } catch {
      /* ignore */
    }
  }
  return false;
}
