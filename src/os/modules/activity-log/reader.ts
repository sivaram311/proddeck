import { readFile } from "fs/promises";
import type { ActivityLogEntry, ActivityLogResponse } from "./types";

/** Read-only SoT — never write from ProdDeck. */
export const ACTIVITY_LOG_PATH = "E:\\MyAgent\\workflow\\activity\\ACTIVITY-LOG.md";

export const TAIL_LIMIT = 80;
const MAX_RESPONSE_BYTES = 64 * 1024;

const DATE_ROW_RE = /^\|\s*(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})/;
const SEPARATOR_ROW_RE = /^\|\s*[-|:\s]+\|/;

const SENSITIVE_VALUE_RE =
  /\b(?:password|passwd|pwd|token|secret|api[_-]?key)\s*[=:]\s*\S+|\bbearer\s+\S+/gi;

function stripBackticks(value: string): string {
  return value.replace(/^`(.+)`$/, "$1").trim();
}

function parseRow(line: string): ActivityLogEntry | null {
  if (!DATE_ROW_RE.test(line) || SEPARATOR_ROW_RE.test(line)) return null;
  const cells = line.split("|").map((c) => c.trim());
  if (cells.length < 9) return null;
  const [, when, session, provider, role, action, target, result, notes] = cells;
  if (!when || !DATE_ROW_RE.test(`| ${when}`)) return null;
  return {
    timestamp: when,
    session: stripBackticks(session ?? ""),
    provider: provider ?? "",
    role: role ?? "",
    action: action ?? "",
    target: target ?? "",
    result: result ?? "",
    notes: notes ?? "",
    redacted: false,
  };
}

function redactEntry(entry: ActivityLogEntry): ActivityLogEntry {
  const parts = [
    entry.timestamp,
    entry.session,
    entry.provider,
    entry.role,
    entry.action,
    entry.target,
    entry.result,
    entry.notes,
  ];
  const combined = parts.join(" ");
  if (!SENSITIVE_VALUE_RE.test(combined) && !/\b(password|token|secret)\b/i.test(combined)) {
    return entry;
  }

  const redactText = (text: string) =>
    text.replace(SENSITIVE_VALUE_RE, (m) => {
      const key = m.split(/[=:]/)[0]?.trim() ?? "value";
      return `${key}= [REDACTED]`;
    });

  return {
    ...entry,
    action: redactText(entry.action),
    target: redactText(entry.target),
    notes: redactText(entry.notes),
    redacted: true,
  };
}

function capResponse(entries: ActivityLogEntry[]): {
  entries: ActivityLogEntry[];
  truncated: boolean;
} {
  let truncated = false;
  const capped: ActivityLogEntry[] = [];

  for (const entry of entries) {
    capped.push(entry);
    const payload = JSON.stringify({ entries: capped });
    if (payload.length > MAX_RESPONSE_BYTES || capped.length > TAIL_LIMIT) {
      capped.pop();
      truncated = true;
      break;
    }
  }

  return { entries: capped, truncated };
}

export async function readActivityLogTail(query?: string): Promise<ActivityLogResponse> {
  const raw = await readFile(ACTIVITY_LOG_PATH, "utf8");
  const lines = raw.split(/\r?\n/);

  const rows: ActivityLogEntry[] = [];
  for (const line of lines) {
    const parsed = parseRow(line);
    if (parsed) rows.push(parsed);
  }

  const tailed = rows.slice(-TAIL_LIMIT);
  const q = query?.trim().toLowerCase();
  const filtered = q
    ? tailed.filter((row) =>
        [
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

  const redacted = filtered.map(redactEntry);
  const { entries, truncated } = capResponse(redacted);

  return {
    at: new Date().toISOString(),
    source: ACTIVITY_LOG_PATH,
    query: q || undefined,
    tailLimit: TAIL_LIMIT,
    totalRows: rows.length,
    matched: filtered.length,
    truncated,
    entries,
  };
}
