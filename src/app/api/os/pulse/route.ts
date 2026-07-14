import { NextResponse } from "next/server";
import { withOpenCors } from "@/lib/cors";
import { collectHealthSnapshot } from "@/os/modules/pulse/health";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const snapshot = await collectHealthSnapshot();
    return withOpenCors(NextResponse.json(snapshot));
  } catch (err) {
    const message = err instanceof Error ? err.message : "pulse collect failed";
    return withOpenCors(
      NextResponse.json({ error: "pulse_failed", message }, { status: 500 }),
    );
  }
}
