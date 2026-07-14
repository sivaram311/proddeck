import { appendFile, mkdir, readFile } from "fs/promises";
import path from "path";
import type { OsEventEnvelope, OsEventType } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const LOG_FILE = path.join(DATA_DIR, "os-events.jsonl");

export async function appendOsEvent(event: OsEventEnvelope): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await appendFile(LOG_FILE, `${JSON.stringify(event)}\n`, "utf8");
}

/** Read-only tail of local OS events jsonl (newest last). */
export async function tailOsEvents(opts?: {
  limit?: number;
  type?: OsEventType | string;
}): Promise<OsEventEnvelope[]> {
  const limit = Math.min(Math.max(opts?.limit ?? 40, 1), 200);
  let raw = "";
  try {
    raw = await readFile(LOG_FILE, "utf8");
  } catch {
    return [];
  }
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const events: OsEventEnvelope[] = [];
  for (const line of lines) {
    try {
      const parsed = JSON.parse(line) as OsEventEnvelope;
      if (!parsed?.type || !parsed?.at) continue;
      if (opts?.type && parsed.type !== opts.type) continue;
      events.push({
        type: parsed.type,
        at: parsed.at,
        env: parsed.env,
        actor: parsed.actor,
        payload: parsed.payload && typeof parsed.payload === "object" ? parsed.payload : {},
      });
    } catch {
      /* skip bad line */
    }
  }
  return events.slice(-limit);
}

/**
 * Soft forward to Portal `POST /api/os-events`.
 * On when `OS_EVENTS_FORWARD=1`, or DEV (`NODE_ENV=development`) unless explicitly `0`.
 * Base URL from `PLATFORM_APPS_URL` (strip `/api/platform/apps`).
 */
export async function maybeForwardOsEvent(event: OsEventEnvelope): Promise<void> {
  const forwardFlag = process.env.OS_EVENTS_FORWARD;
  const forwardOn =
    forwardFlag === "1" ||
    (process.env.NODE_ENV === "development" && forwardFlag !== "0");
  if (!forwardOn) return;
  const base = (process.env.PLATFORM_APPS_URL || "").replace(/\/api\/platform\/apps\/?$/, "");
  if (!base) return;
  try {
    await fetch(`${base}/api/os-events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
      signal: AbortSignal.timeout(2000),
    });
  } catch {
    /* fail soft */
  }
}
