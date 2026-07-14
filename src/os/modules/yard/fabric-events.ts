/** Read-only OS event tail shape from GET /api/os/events (Yard soft mirror). */

export type YardOsEvent = {
  type: string;
  at: string;
  env?: string;
  actor?: string;
  payload: Record<string, unknown>;
};

export type YardEventsResponse = {
  ok?: boolean;
  events?: YardOsEvent[];
  count?: number;
};

const FABRIC_TYPES = new Set(["crew.fabric.spawned", "crew.fabric.lane.done"]);

export function isFabricEvent(ev: YardOsEvent): boolean {
  return FABRIC_TYPES.has(ev.type);
}

export function eventSummary(ev: YardOsEvent): string {
  const p = ev.payload ?? {};
  if (typeof p.packId === "string" && p.packId) return p.packId;
  if (typeof p.lane === "string" && p.lane) return `lane ${p.lane}`;
  if (typeof p.missionId === "string" && p.missionId) return p.missionId;
  if (typeof p.source === "string" && p.source) return p.source;
  return ev.type.replace(/^crew\.fabric\./, "");
}

export function formatEventAt(at: string): string {
  const d = new Date(at);
  if (Number.isNaN(d.getTime())) return at;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Soft-fail: never throws; empty list on any failure. */
export async function fetchFabricEvents(limit = 30): Promise<YardOsEvent[]> {
  try {
    const res = await fetch(`/api/os/events?limit=${limit}&type=crew.fabric.spawned`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const body = (await res.json()) as YardEventsResponse;
    const events = Array.isArray(body.events) ? body.events : [];
    return events.filter(isFabricEvent);
  } catch {
    return [];
  }
}
