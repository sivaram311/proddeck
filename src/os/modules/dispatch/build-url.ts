import {
  type DispatchCrewId,
  type DispatchFleet,
  type DispatchIntent,
  fleetToEnvParam,
  resolveAgentVerseBase,
} from "./config";

export type DispatchLinkInput = {
  fleet: DispatchFleet;
  crew: DispatchCrewId;
  intent: DispatchIntent;
  brief: string;
  returnUrl: string;
  /** Optional comma-separated skills (informational). */
  skills?: string;
  /** Optional Portal session UUID. */
  session?: string;
};

/**
 * Normalize brief for `URLSearchParams.set` — plain UTF-8 only.
 * Do not pre-`encodeURIComponent` (double-encode) and do not base64url-encode.
 */
export function normalizeBrief(text: string): string {
  return text.trim();
}

/**
 * Build AgentVerse Desk deep link (upgrade fleet by default):
 * `/desk?src=proddeck&crew=&session=&intent=&brief=&skills=&return=&env=`
 */
export function buildDispatchUrl(input: DispatchLinkInput): string | null {
  const brief = normalizeBrief(input.brief);
  if (!brief) return null;

  const base = resolveAgentVerseBase(input.fleet);
  const returnUrl = input.returnUrl.trim().replace(/\/$/, "");
  const env = fleetToEnvParam(input.fleet);

  const url = new URL("/desk", `${base}/`);
  url.searchParams.set("src", "proddeck");
  url.searchParams.set("crew", input.crew);
  url.searchParams.set("intent", input.intent);
  url.searchParams.set("brief", brief);
  url.searchParams.set("env", env);

  const session = (input.session || "").trim();
  if (session) url.searchParams.set("session", session);

  const skills = (input.skills || "").trim();
  if (skills) url.searchParams.set("skills", skills);

  if (returnUrl) url.searchParams.set("return", returnUrl);

  return url.toString();
}
