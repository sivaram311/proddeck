import { NextRequest, NextResponse } from "next/server";
import { corsPreflight, withOpenCors } from "@/lib/cors";
import { appendOsEvent, maybeForwardOsEvent, tailOsEvents } from "@/os/events/store";
import type { OsEventEnvelope, OsEventType } from "@/os/events/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALLOWED: OsEventType[] = [
  "dispatch.hire.requested",
  "promote.decision",
  "crew.fabric.spawned",
  "crew.fabric.lane.done",
];

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

/** Read-only tail — used by Yard / Beacon soft mirrors. */
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const limitRaw = Number(sp.get("limit") ?? "40");
    const limit = Number.isFinite(limitRaw) ? limitRaw : 40;
    const type = sp.get("type") ?? undefined;
    const events = await tailOsEvents({ limit, type: type || undefined });
    return withOpenCors(NextResponse.json({ ok: true, events, count: events.length }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "events failed";
    return withOpenCors(NextResponse.json({ error: "events_failed", message }, { status: 500 }));
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<OsEventEnvelope>;
    if (!body.type || !ALLOWED.includes(body.type as OsEventType)) {
      return withOpenCors(NextResponse.json({ error: "invalid_type" }, { status: 400 }));
    }
    const event: OsEventEnvelope = {
      type: body.type as OsEventType,
      at: new Date().toISOString(),
      env: typeof body.env === "string" ? body.env : undefined,
      actor: typeof body.actor === "string" ? body.actor : "proddeck",
      payload: body.payload && typeof body.payload === "object" ? body.payload : {},
    };
    await appendOsEvent(event);
    await maybeForwardOsEvent(event);
    return withOpenCors(NextResponse.json({ ok: true, event }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "events failed";
    return withOpenCors(NextResponse.json({ error: "events_failed", message }, { status: 500 }));
  }
}
