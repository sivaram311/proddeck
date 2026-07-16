import { NextRequest, NextResponse } from "next/server";
import { corsPreflight, withOpenCors } from "@/lib/cors";
import { osFlagsSnapshot } from "@/os/flags";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

/** Read-only flag snapshot for UI (never secrets). */
export async function GET() {
  return withOpenCors(
    NextResponse.json({
      ok: true,
      flags: osFlagsSnapshot(),
      note: "Hard outs default OFF — EM GO required to enable on any env.",
    }),
  );
}
