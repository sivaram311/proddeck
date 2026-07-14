import { NextResponse } from "next/server";
import { withOpenCors } from "@/lib/cors";
import { collectPortsSnapshot } from "@/os/modules/ports/registry";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const snapshot = await collectPortsSnapshot();
    return withOpenCors(NextResponse.json(snapshot));
  } catch (err) {
    const message = err instanceof Error ? err.message : "ports collect failed";
    return withOpenCors(
      NextResponse.json({ error: "ports_failed", message }, { status: 500 }),
    );
  }
}
