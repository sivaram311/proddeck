import { NextResponse } from "next/server";
import { withOpenCors } from "@/lib/cors";
import { collectBeaconSnapshot } from "@/os/modules/beacon/probe";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    return withOpenCors(NextResponse.json(await collectBeaconSnapshot()));
  } catch (err) {
    const message = err instanceof Error ? err.message : "beacon failed";
    return withOpenCors(NextResponse.json({ error: "beacon_failed", message }, { status: 500 }));
  }
}
