import type { AuthConfig } from "./types";

/** ProdDeck-only keys — do not share AgentVerse / Agent Portal tokens. */
const ACCESS = "prodDeckAccessToken";
const REFRESH = "prodDeckRefreshToken";
const USER = "prodDeckUser";

const CSS_PROXY_BASE = "/api/css";

export type JwtClaims = {
  iss?: string;
  sub?: string;
  exp?: number;
  aud?: string | string[];
  client_id?: string;
};

export function decodeJwtPayload(token: string): JwtClaims | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const padded = part.replace(/-/g, "+").replace(/_/g, "/");
    const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
    return JSON.parse(atob(padded + pad)) as JwtClaims;
  } catch {
    return null;
  }
}

export function expectedIssuer(config: AuthConfig | null | undefined): string {
  const fromConfig = (config?.authUrl || "").trim().replace(/\/$/, "");
  if (fromConfig) return fromConfig;
  return (process.env.NEXT_PUBLIC_CSS_ISSUER || "").trim().replace(/\/$/, "");
}

export function isTokenAcceptable(
  token: string | null | undefined,
  config: AuthConfig | null | undefined,
): boolean {
  if (!token) return false;
  const claims = decodeJwtPayload(token);
  if (!claims) return false;
  if (claims.exp && Date.now() >= claims.exp * 1000) return false;
  const iss = expectedIssuer(config);
  if (iss && claims.iss && claims.iss.replace(/\/$/, "") !== iss) return false;
  const clientId = config?.clientId || "proddeck";
  const aud = claims.aud;
  const audOk = Array.isArray(aud)
    ? aud.includes(clientId)
    : aud === clientId || claims.client_id === clientId;
  return audOk;
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH);
}

export function setTokens(access: string, refresh?: string, user?: unknown) {
  localStorage.setItem(ACCESS, access);
  if (refresh) localStorage.setItem(REFRESH, refresh);
  if (user !== undefined) localStorage.setItem(USER, JSON.stringify(user));
}

export function clearTokens() {
  localStorage.removeItem(ACCESS);
  localStorage.removeItem(REFRESH);
  localStorage.removeItem(USER);
}

export function getStoredUser(): { username?: string } | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { username?: string };
  } catch {
    return null;
  }
}

function cssUrl(config: AuthConfig, path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (typeof window !== "undefined") return `${CSS_PROXY_BASE}${p}`;
  return `${config.authUrl.replace(/\/$/, "")}${p}`;
}

export function isAccessTokenExpired(token?: string | null, skewSeconds = 60): boolean {
  const raw = token ?? getAccessToken();
  if (!raw) return true;
  const claims = decodeJwtPayload(raw);
  if (!claims?.exp) return !claims;
  return Date.now() >= (claims.exp - skewSeconds) * 1000;
}

export async function loginWithCss(
  config: AuthConfig,
  username: string,
  password: string,
): Promise<void> {
  clearTokens();
  const url = cssUrl(config, config.loginPath || "/auth/login");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
      clientId: config.clientId || "proddeck",
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Login failed (${res.status})`);
  }
  const data = (await res.json()) as {
    accessToken?: string;
    token?: string;
    refreshToken?: string;
    user?: unknown;
    username?: string;
  };
  const access = data.accessToken || data.token;
  if (!access) throw new Error("No access token in login response");
  if (!isTokenAcceptable(access, config)) {
    throw new Error(
      `CSS issued an incompatible JWT (iss=${decodeJwtPayload(access)?.iss}). Expected ${expectedIssuer(config)}.`,
    );
  }
  setTokens(access, data.refreshToken, data.user ?? { username: data.username ?? username });
}

export async function refreshCss(config: AuthConfig): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;
  const url = cssUrl(config, config.refreshPath || "/auth/refresh");
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken: refresh,
        clientId: config.clientId || "proddeck",
      }),
    });
    if (!res.ok) {
      clearTokens();
      return false;
    }
    const data = (await res.json()) as {
      accessToken?: string;
      token?: string;
      refreshToken?: string;
    };
    const access = data.accessToken || data.token;
    if (!access || !isTokenAcceptable(access, config)) {
      clearTokens();
      return false;
    }
    setTokens(access, data.refreshToken ?? refresh);
    return true;
  } catch {
    return false;
  }
}

export async function ensureFreshToken(
  config: AuthConfig | null | undefined,
): Promise<string | null> {
  let token = getAccessToken();
  if (token && !isTokenAcceptable(token, config)) {
    clearTokens();
    token = null;
  }
  if (token && !isAccessTokenExpired(token)) return token;
  if (!config?.cssEnabled) return token;
  const ok = await refreshCss(config);
  return ok ? getAccessToken() : null;
}

/** Lightweight session gate: valid (or refreshable) JWT for clientId proddeck. */
export async function verifySession(config: AuthConfig): Promise<boolean> {
  const token = await ensureFreshToken(config);
  return Boolean(token);
}
