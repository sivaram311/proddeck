/** Dispatch target apps and base URL resolution (client-safe). */

export type DispatchTargetApp = "agentverse" | "proddeck" | "portal";

export type DispatchEnv = "dev" | "preprod" | "prod";

export const DISPATCH_TARGET_LABELS: Record<DispatchTargetApp, string> = {
  agentverse: "AgentVerse",
  proddeck: "ProdDeck",
  portal: "Agent Portal",
};

/** Machine-known prod hosts — overridable via NEXT_PUBLIC_* env vars. */
const DEFAULT_BASE_URLS: Record<DispatchTargetApp, string> = {
  agentverse: "https://agentverse.delena.buzz",
  proddeck: "https://home.delena.buzz",
  portal: "https://agent-portal.delena.buzz",
};

const ENV_BASE_KEYS: Record<DispatchTargetApp, string> = {
  agentverse: "NEXT_PUBLIC_AGENTVERSE_URL",
  proddeck: "NEXT_PUBLIC_PRODDECK_URL",
  portal: "NEXT_PUBLIC_AGENT_PORTAL_URL",
};

/** Pack host fallbacks when `window` is unavailable (SSR). */
const PACK_HOSTS: Record<DispatchEnv, string> = {
  dev: "http://127.0.0.1:3320",
  preprod: "https://home-staging.delena.buzz",
  prod: "https://home.delena.buzz",
};

export function resolveDispatchEnv(): DispatchEnv {
  if (typeof window === "undefined") return "prod";
  const host = window.location.hostname;
  if (host === "127.0.0.1" || host === "localhost") return "dev";
  if (host.includes("staging")) return "preprod";
  return "prod";
}

export function defaultReturnUrl(): string {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin.replace(/\/$/, "");
  }
  return PACK_HOSTS[resolveDispatchEnv()];
}

export function resolveTargetBaseUrl(target: DispatchTargetApp): string {
  const fromEnv = (process.env[ENV_BASE_KEYS[target]] || "").trim().replace(/\/$/, "");
  return fromEnv || DEFAULT_BASE_URLS[target];
}
