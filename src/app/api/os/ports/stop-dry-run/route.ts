import { NextRequest, NextResponse } from "next/server";
import { corsPreflight, withOpenCors } from "@/lib/cors";
import { dryRunPortStop } from "@/os/modules/ports/stopDryRun";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

/**
 * Wave A — preview only. Never kills / Stop-Process.
 * POST { ports: number[] }
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { ports?: unknown };
    const ports = Array.isArray(body.ports)
      ? body.ports.map((p) => Number(p)).filter((p) => Number.isFinite(p))
      : [];
    if (ports.length === 0) {
      return withOpenCors(
        NextResponse.json(
          { error: "ports_required", message: "ports: number[] is required" },
          { status: 400 },
        ),
      );
    }
    const result = await dryRunPortStop(ports);
    return withOpenCors(NextResponse.json({ ok: true, ...result }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "stop dry-run failed";
    return withOpenCors(
      NextResponse.json({ error: "stop_dry_run_failed", message }, { status: 500 }),
    );
  }
}

/** Reject accidental apply attempts. */
export async function DELETE() {
  return withOpenCors(
    NextResponse.json(
      {
        error: "blocked",
        code: "no_kill_wave_a",
        message: "Port kill/stop IO is not enabled. Use stop-dry-run POST preview only.",
      },
      { status: 403 },
    ),
  );
}
