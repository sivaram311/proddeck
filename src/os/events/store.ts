import { appendFile, mkdir } from "fs/promises";
import path from "path";
import type { OsEventEnvelope } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const LOG_FILE = path.join(DATA_DIR, "os-events.jsonl");

export async function appendOsEvent(event: OsEventEnvelope): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await appendFile(LOG_FILE, `${JSON.stringify(event)}\n`, "utf8");
}

/** Soft forward to Portal platform URL when OS_EVENTS_FORWARD=1. */
export async function maybeForwardOsEvent(event: OsEventEnvelope): Promise<void> {
  if (process.env.OS_EVENTS_FORWARD !== "1") return;
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
