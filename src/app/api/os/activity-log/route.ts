import { NextRequest, NextResponse } from "next/server";
import { withOpenCors } from "@/lib/cors";
import { readActivityLogTail } from "@/os/modules/activity-log/reader";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? undefined;

  try {
    const body = await readActivityLogTail(q);
    return withOpenCors(NextResponse.json(body));
  } catch (err) {
    const message = err instanceof Error ? err.message : "activity-log read failed";
    const code = message.includes("ENOENT") ? "not_found" : "activity_log_failed";
    return withOpenCors(
      NextResponse.json({ error: code, message }, { status: code === "not_found" ? 404 : 500 }),
    );
  }
}
