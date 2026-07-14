import { NextRequest, NextResponse } from "next/server";
import { corsPreflight, withOpenCors } from "@/lib/cors";
import { readActivityLogTail } from "@/os/modules/activity-log/reader";
import { appendActivityQueueRow, readActivityQueue } from "@/os/modules/activity-log/queue";
import {
  applyActivityDrain,
  DRAIN_CONFIRM_PHRASE,
  previewActivityDrain,
} from "@/os/modules/activity-log/drain";
import type { ActivityQueueInput } from "@/os/modules/activity-log/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

/**
 * GET MyAgent ACTIVITY-LOG tail (default), or pending staging rows with `?queue=1`.
 * Never writes MyAgent ACTIVITY-LOG.
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? undefined;
  const queue = req.nextUrl.searchParams.get("queue") === "1";

  try {
    if (queue) {
      const body = await readActivityQueue(q);
      return withOpenCors(NextResponse.json(body));
    }
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

type DrainBody = {
  op: "drain";
  mode?: "dry-run" | "apply";
  ats?: string[];
  confirm?: string;
};

function isDrainBody(body: unknown): body is DrainBody {
  return Boolean(body && typeof body === "object" && (body as DrainBody).op === "drain");
}

/**
 * POST:
 * - default: stage a row into `.data/activity-queue.jsonl` only
 * - `{ op: "drain", mode: "dry-run"|"apply" }`: Lead drain preview / confirmed apply
 */
export async function POST(req: NextRequest) {
  try {
    const raw: unknown = await req.json();

    if (isDrainBody(raw)) {
      const ats = Array.isArray(raw.ats)
        ? raw.ats.filter((x): x is string => typeof x === "string" && x.length > 0)
        : undefined;
      const mode = raw.mode === "apply" ? "apply" : "dry-run";
      if (mode === "dry-run") {
        const preview = await previewActivityDrain(ats);
        return withOpenCors(NextResponse.json({ ok: true, ...preview }));
      }
      try {
        const result = await applyActivityDrain({
          ats,
          confirm: typeof raw.confirm === "string" ? raw.confirm : "",
        });
        return withOpenCors(NextResponse.json(result));
      } catch (err) {
        const message = err instanceof Error ? err.message : "drain failed";
        if (message === "confirm_required") {
          return withOpenCors(
            NextResponse.json(
              {
                error: "confirm_required",
                message: `confirm must be exactly ${DRAIN_CONFIRM_PHRASE}`,
                confirmPhrase: DRAIN_CONFIRM_PHRASE,
              },
              { status: 400 },
            ),
          );
        }
        if (message === "drain_locked") {
          return withOpenCors(
            NextResponse.json(
              { error: "drain_locked", message: "another drain is in progress" },
              { status: 409 },
            ),
          );
        }
        throw err;
      }
    }

    const body = raw as Partial<ActivityQueueInput>;
    if (!body.action || typeof body.action !== "string" || !body.action.trim()) {
      return withOpenCors(
        NextResponse.json({ error: "action_required", message: "action is required" }, { status: 400 }),
      );
    }
    const row = await appendActivityQueueRow({
      timestamp: typeof body.timestamp === "string" ? body.timestamp : undefined,
      session: typeof body.session === "string" ? body.session : undefined,
      provider: typeof body.provider === "string" ? body.provider : undefined,
      role: typeof body.role === "string" ? body.role : undefined,
      action: body.action,
      target: typeof body.target === "string" ? body.target : undefined,
      result: typeof body.result === "string" ? body.result : undefined,
      notes: typeof body.notes === "string" ? body.notes : undefined,
    });
    return withOpenCors(NextResponse.json({ ok: true, queued: true, row }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "activity-log queue failed";
    if (message === "action_required") {
      return withOpenCors(
        NextResponse.json({ error: "action_required", message }, { status: 400 }),
      );
    }
    return withOpenCors(
      NextResponse.json({ error: "activity_queue_failed", message }, { status: 500 }),
    );
  }
}
