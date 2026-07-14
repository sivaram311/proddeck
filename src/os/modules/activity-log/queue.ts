import { appendFile, mkdir, readFile } from "fs/promises";
import path from "path";
import type { ActivityQueueResponse, ActivityQueueRow, ActivityQueueInput } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
export const ACTIVITY_QUEUE_PATH = path.join(DATA_DIR, "activity-queue.jsonl");

const QUEUE_TAIL_LIMIT = 80;

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

/** Append one staging row — never touches MyAgent ACTIVITY-LOG. */
export async function appendActivityQueueRow(
  input: ActivityQueueInput,
): Promise<ActivityQueueRow> {
  const row: ActivityQueueRow = {
    at: new Date().toISOString(),
    timestamp: asString(input.timestamp) || new Date().toISOString().slice(0, 16).replace("T", " "),
    session: asString(input.session) || "proddeck",
    provider: asString(input.provider) || "other",
    role: asString(input.role) || "agent",
    action: asString(input.action),
    target: asString(input.target),
    result: asString(input.result) || "queued",
    notes: asString(input.notes),
  };

  if (!row.action) {
    throw new Error("action_required");
  }

  await mkdir(DATA_DIR, { recursive: true });
  await appendFile(ACTIVITY_QUEUE_PATH, `${JSON.stringify(row)}\n`, "utf8");
  return row;
}

/** Read pending staging rows from local jsonl (newest last). */
export async function readActivityQueue(query?: string): Promise<ActivityQueueResponse> {
  let raw = "";
  try {
    raw = await readFile(ACTIVITY_QUEUE_PATH, "utf8");
  } catch (err) {
    const code = err && typeof err === "object" && "code" in err ? (err as NodeJS.ErrnoException).code : undefined;
    if (code === "ENOENT") {
      return {
        at: new Date().toISOString(),
        source: ACTIVITY_QUEUE_PATH,
        queue: true,
        query: query?.trim() || undefined,
        matched: 0,
        truncated: false,
        entries: [],
      };
    }
    throw err;
  }

  const rows: ActivityQueueRow[] = [];
  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim()) continue;
    try {
      const parsed = JSON.parse(line) as Partial<ActivityQueueRow>;
      if (!parsed?.action || !parsed?.at) continue;
      rows.push({
        at: String(parsed.at),
        timestamp: asString(parsed.timestamp) || String(parsed.at).slice(0, 16).replace("T", " "),
        session: asString(parsed.session) || "proddeck",
        provider: asString(parsed.provider) || "other",
        role: asString(parsed.role) || "agent",
        action: asString(parsed.action),
        target: asString(parsed.target),
        result: asString(parsed.result) || "queued",
        notes: asString(parsed.notes),
      });
    } catch {
      /* skip bad line */
    }
  }

  const tailed = rows.slice(-QUEUE_TAIL_LIMIT);
  const q = query?.trim().toLowerCase();
  const filtered = q
    ? tailed.filter((row) =>
        [
          row.at,
          row.timestamp,
          row.session,
          row.provider,
          row.role,
          row.action,
          row.target,
          row.result,
          row.notes,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
    : tailed;

  const truncated = rows.length > QUEUE_TAIL_LIMIT;

  return {
    at: new Date().toISOString(),
    source: ACTIVITY_QUEUE_PATH,
    queue: true,
    query: q || undefined,
    matched: filtered.length,
    truncated,
    entries: filtered,
  };
}
