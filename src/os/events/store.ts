import { appendFile, mkdir } from "fs/promises";
import path from "path";
import type { OsEventEnvelope } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const LOG_FILE = path.join(DATA_DIR, "os-events.jsonl");

export async function appendOsEvent(event: OsEventEnvelope): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await appendFile(LOG_FILE, `${JSON.stringify(event)}\n`, "utf8");
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
