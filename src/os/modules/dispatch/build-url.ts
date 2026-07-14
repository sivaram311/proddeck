import {
  type DispatchEnv,
  type DispatchTargetApp,
  resolveDispatchEnv,
  resolveTargetBaseUrl,
} from "./config";

export type DispatchLinkInput = {
  target: DispatchTargetApp;
  missionTitle: string;
  returnUrl: string;
  env?: DispatchEnv;
};

/** Base64url-encode mission text for the `brief` query param (UTF-8 safe). */
export function encodeBrief(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  const bytes = new TextEncoder().encode(trimmed);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Build a Session Desk–style deep link for the selected target app.
 * AgentVerse is the primary consumer; Portal/ProdDeck use the same param contract (Wave 2 landing).
 */
export function buildDispatchUrl(input: DispatchLinkInput): string | null {
  const title = input.missionTitle.trim();
  if (!title) return null;

  const env = input.env ?? resolveDispatchEnv();
  const base = resolveTargetBaseUrl(input.target);
  const brief = encodeBrief(title);
  const returnUrl = input.returnUrl.trim().replace(/\/$/, "");

  if (input.target === "agentverse") {
    const url = new URL("/desk", `${base}/`);
    url.searchParams.set("src", "proddeck");
    url.searchParams.set("intent", "session-desk");
    url.searchParams.set("brief", brief);
    if (returnUrl) url.searchParams.set("return", returnUrl);
    url.searchParams.set("env", env);
    return url.toString();
  }

  if (input.target === "portal") {
    const url = new URL("/", `${base}/`);
    url.searchParams.set("src", "proddeck");
    url.searchParams.set("intent", "hire");
    url.searchParams.set("brief", brief);
    if (returnUrl) url.searchParams.set("return", returnUrl);
    url.searchParams.set("env", env);
    return url.toString();
  }

  // proddeck — return operator to Forge / Dispatch with mission context
  const url = new URL("/", `${base}/`);
  url.searchParams.set("src", "proddeck");
  url.searchParams.set("intent", "dispatch");
  url.searchParams.set("place", "forge");
  url.searchParams.set("module", "dispatch");
  url.searchParams.set("brief", brief);
  if (returnUrl) url.searchParams.set("return", returnUrl);
  url.searchParams.set("env", env);
  return url.toString();
}
