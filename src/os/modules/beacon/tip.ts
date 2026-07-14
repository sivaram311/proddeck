import type { BeaconTip, BeaconTipType } from "./types";

export const BEACON_TIP_TYPES: readonly BeaconTipType[] = [
  "dispatch.hire.requested",
  "promote.decision",
  "crew.fabric.spawned",
] as const;

const TIP_SET = new Set<string>(BEACON_TIP_TYPES);

type EventsResponse = {
  ok?: boolean;
  events?: Array<{
    type?: string;
    at?: string;
    actor?: string;
  }>;
};

/** Latest hire/promote-related OS event from read-only events tail. Soft-fails to null. */
export async function fetchBeaconTip(): Promise<BeaconTip | null> {
  try {
    const res = await fetch("/api/os/events?limit=20", { cache: "no-store" });
    if (!res.ok) return null;
    const body = (await res.json()) as EventsResponse;
    const events = Array.isArray(body.events) ? body.events : [];
    for (let i = events.length - 1; i >= 0; i--) {
      const e = events[i];
      if (!e?.type || !e?.at || !TIP_SET.has(e.type)) continue;
      return {
        type: e.type as BeaconTipType,
        at: e.at,
        actor: typeof e.actor === "string" && e.actor.length > 0 ? e.actor : "—",
      };
    }
    return null;
  } catch {
    return null;
  }
}
