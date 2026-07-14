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

/* --- css-next OAuth (Authorization Code + PKCE) --- */

const OAUTH_STATE_KEY = "prodDeckOauthState";
const OAUTH_VERIFIER_KEY = "prodDeckOauthVerifier";
const OAUTH_REDIRECT_KEY = "prodDeckOauthRedirect";

function resolveOAuthRedirectUri(config: AuthConfig): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin.replace(/\/$/, "")}/auth/callback`;
  }
  if (config.oauthRedirectUri) {
    return config.oauthRedirectUri.replace(/\/$/, "");
  }
  // SSR/docs only — set NEXT_PUBLIC_CSS_OAUTH_REDIRECT_URI or NEXT_PUBLIC_APP_URL
  const app =
    (typeof process !== "undefined" &&
      (process.env.NEXT_PUBLIC_APP_URL || process.env.PRODDECK_PUBLIC_URL)?.trim()) ||
    "";
  if (app) return `${app.replace(/\/$/, "")}/auth/callback`;
  throw new Error(
    "OAuth redirect URI missing: open in a browser or set NEXT_PUBLIC_CSS_OAUTH_REDIRECT_URI / NEXT_PUBLIC_APP_URL",
  );
}

function base64Url(bytes: ArrayBuffer | Uint8Array): string {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = "";
  u8.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomUrlSafe(length = 64): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return base64Url(bytes).slice(0, length);
}

async function pkceChallengeS256(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64Url(digest);
}

/** Full-page navigate to css-next /oauth/authorize (do not use /api/css proxy). */
export async function beginCssOAuthLogin(config: AuthConfig): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("OAuth login is browser-only");
  }
  const issuer = expectedIssuer(config);
  if (!issuer) throw new Error("NEXT_PUBLIC_CSS_ISSUER / authUrl missing");
  const redirectUri = resolveOAuthRedirectUri(config);
  const state = randomUrlSafe(32);
  const verifier = randomUrlSafe(64);
  const challenge = await pkceChallengeS256(verifier);
  sessionStorage.setItem(OAUTH_STATE_KEY, state);
  sessionStorage.setItem(OAUTH_VERIFIER_KEY, verifier);
  sessionStorage.setItem(OAUTH_REDIRECT_KEY, redirectUri);

  const url = new URL(`${issuer}/oauth/authorize`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", config.clientId || "proddeck");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("state", state);
  window.location.assign(url.toString());
}

export async function completeCssOAuthCallback(
  config: AuthConfig,
  params: { code?: string | null; state?: string | null; error?: string | null },
): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("OAuth callback is browser-only");
  }
  if (params.error) {
    throw new Error(`OAuth error: ${params.error}`);
  }
  const code = params.code;
  if (!code) throw new Error("Missing authorization code");
  const expectedState = sessionStorage.getItem(OAUTH_STATE_KEY);
  const verifier = sessionStorage.getItem(OAUTH_VERIFIER_KEY);
  const redirectUri =
    sessionStorage.getItem(OAUTH_REDIRECT_KEY) || resolveOAuthRedirectUri(config);
  sessionStorage.removeItem(OAUTH_STATE_KEY);
  sessionStorage.removeItem(OAUTH_VERIFIER_KEY);
  sessionStorage.removeItem(OAUTH_REDIRECT_KEY);
  if (!expectedState || params.state !== expectedState) {
    throw new Error("OAuth state mismatch");
  }
  if (!verifier) throw new Error("Missing PKCE verifier");

  const issuer = expectedIssuer(config);
  const tokenUrl = `${issuer}/oauth/token`;
  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: config.clientId || "proddeck",
      code_verifier: verifier,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Token exchange failed (${res.status})`);
  }
  const data = (await res.json()) as {
    accessToken?: string;
    token?: string;
    refreshToken?: string;
    username?: string;
    user?: unknown;
  };
  const access = data.accessToken || data.token;
  if (!access) throw new Error("No access token in OAuth token response");
  if (!isTokenAcceptable(access, config)) {
    throw new Error(
      `CSS issued an incompatible JWT (iss=${decodeJwtPayload(access)?.iss}). Expected ${issuer}.`,
    );
  }
  clearTokens();
  setTokens(access, data.refreshToken, data.user ?? { username: data.username });
}
