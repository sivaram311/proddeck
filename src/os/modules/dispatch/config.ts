/** Dispatch → AgentVerse upgrade fleet (client-safe). */

/** Fleet toggle in the UI — maps to upgrade hosts (not classic agentverse.delena.buzz). */
export type DispatchFleet = "staging" | "prod";

/** `env` query hint consumed by AgentVerse Desk. */
export type DispatchEnv = "dev" | "preprod" | "prod";

export type DispatchIntent = "session-desk" | "hire";

/** Persona ids — AgentVerse `/desk?crew=` contract. */
export const DISPATCH_CREW = [
  "rajesh",
  "karthik",
  "lavanya",
  "aravind",
  "meenakshi",
  "muthu",
  "kabilan",
] as const;

export type DispatchCrewId = (typeof DISPATCH_CREW)[number];

export const DISPATCH_CREW_LABELS: Record<DispatchCrewId, string> = {
  rajesh: "Rajesh",
  karthik: "Karthik",
  lavanya: "Lavanya",
  aravind: "Aravind",
  meenakshi: "Meenakshi",
  muthu: "Muthu",
  kabilan: "Kabilan",
};

/**
 * Default AgentVerse bases — upgrade fleet is SoT for Dispatch.
 * Classic `agentverse.delena.buzz` is NOT the default.
 */
export const AGENTVERSE_UPGRADE_HOSTS: Record<DispatchFleet, string> = {
  staging: "https://agentverse-upgrade-staging.delena.buzz",
  prod: "https://agentverse-upgrade.delena.buzz",
};

/** ProdDeck pack hosts used when deriving return URL without `window`. */
const PACK_HOSTS: Record<DispatchFleet | "dev", string> = {
  dev: "http://127.0.0.1:3320",
  staging: "https://home-staging.delena.buzz",
  prod: "https://home.delena.buzz",
};

export function resolveFleetFromHostname(): DispatchFleet {
  if (typeof window === "undefined") return "prod";
  const host = window.location.hostname;
  if (host === "127.0.0.1" || host === "localhost") return "staging";
  if (host.includes("staging")) return "staging";
  return "prod";
}

/** Map fleet toggle → AgentVerse `env` query param. */
export function fleetToEnvParam(fleet: DispatchFleet): DispatchEnv {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "127.0.0.1" || host === "localhost") return "dev";
  }
  return fleet === "staging" ? "preprod" : "prod";
}

export function resolveAgentVerseBase(fleet: DispatchFleet): string {
  const override = (process.env.NEXT_PUBLIC_AGENTVERSE_URL || "").trim().replace(/\/$/, "");
  if (override) return override;
  return AGENTVERSE_UPGRADE_HOSTS[fleet];
}

/** Return = current ProdDeck origin (home-staging / home / local). */
export function defaultReturnUrl(): string {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin.replace(/\/$/, "");
  }
  const fleet = resolveFleetFromHostname();
  return PACK_HOSTS[fleet];
}
