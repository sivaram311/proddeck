import { mkdir, open, readFile, rename, unlink, writeFile } from "fs/promises";
import path from "path";
import type { ActivityQueueRow } from "./types";
import { ACTIVITY_QUEUE_PATH } from "./queue";

/** Lead drain only — never call from an open "phone POST" without confirm phrase. */
export const ACTIVITY_LOG_PATH =
  "E:\\MyAgent\\workflow\\activity\\ACTIVITY-LOG.md";

export const DRAIN_CONFIRM_PHRASE = "DRAIN_TO_MYAGENT";

const DATA_DIR = path.join(process.cwd(), ".data");
const LOCK_PATH = path.join(DATA_DIR, "activity-queue.lock");

function cell(value: string): string {
  return value.replace(/\|/g, "/").replace(/\r?\n/g, " ").trim();
}

export function formatActivityLogMarkdownRow(row: ActivityQueueRow): string {
  return `| ${cell(row.timestamp)} | \`${cell(row.session)}\` | ${cell(row.provider)} | ${cell(row.role)} | ${cell(row.action)} | ${cell(row.target)} | ${cell(row.result)} | ${cell(row.notes)} |`;
}

async function readAllQueueRows(): Promise<ActivityQueueRow[]> {
  let raw = "";
  try {
    raw = await readFile(ACTIVITY_QUEUE_PATH, "utf8");
  } catch (err) {
    const code =
      err && typeof err === "object" && "code" in err
        ? (err as NodeJS.ErrnoException).code
        : undefined;
    if (code === "ENOENT") return [];
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
        timestamp: String(parsed.timestamp ?? parsed.at).slice(0, 16).replace("T", " "),
        session: String(parsed.session ?? "proddeck"),
        provider: String(parsed.provider ?? "other"),
        role: String(parsed.role ?? "agent"),
        action: String(parsed.action),
        target: String(parsed.target ?? ""),
        result: String(parsed.result ?? "queued"),
        notes: String(parsed.notes ?? ""),
      });
    } catch {
      /* skip */
    }
  }
  return rows;
}

function selectRows(all: ActivityQueueRow[], ats?: string[]): ActivityQueueRow[] {
  if (!ats || ats.length === 0) return all;
  const want = new Set(ats);
  return all.filter((r) => want.has(r.at));
}

export type DrainPreview = {
  at: string;
  mode: "dry-run" | "apply";
  sourceQueue: string;
  targetLog: string;
  selected: number;
  remaining: number;
  rows: ActivityQueueRow[];
  markdownLines: string[];
};

export async function previewActivityDrain(ats?: string[]): Promise<DrainPreview> {
  const all = await readAllQueueRows();
  const selected = selectRows(all, ats);
  const remaining = all.length - selected.length;
  return {
    at: new Date().toISOString(),
    mode: "dry-run",
    sourceQueue: ACTIVITY_QUEUE_PATH,
    targetLog: ACTIVITY_LOG_PATH,
    selected: selected.length,
    remaining,
    rows: selected,
    markdownLines: selected.map(formatActivityLogMarkdownRow),
  };
}

async function withQueueLock<T>(fn: () => Promise<T>): Promise<T> {
  await mkdir(DATA_DIR, { recursive: true });
  let handle;
  try {
    handle = await open(LOCK_PATH, "wx");
  } catch (err) {
    const code =
      err && typeof err === "object" && "code" in err
        ? (err as NodeJS.ErrnoException).code
        : undefined;
    if (code === "EEXIST") {
      throw new Error("drain_locked");
    }
    throw err;
  }
  try {
    return await fn();
  } finally {
    await handle.close();
    try {
      await unlink(LOCK_PATH);
    } catch {
      /* ignore */
    }
  }
}

function insertMarkdownRows(logRaw: string, markdownLines: string[]): string {
  if (markdownLines.length === 0) return logRaw;

  const lines = logRaw.replace(/\r\n/g, "\n").split("\n");
  let insertAt = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\| When \(UTC\+5:30\)/.test(lines[i] ?? "")) {
      if (i + 1 < lines.length && /^\|[-| ]+\|$/.test(lines[i + 1] ?? "")) {
        insertAt = i + 2;
      } else {
        insertAt = i + 1;
        lines.splice(i + 1, 0, "|-----------------|---------|----------|------|--------|--------|--------|------------------|");
        insertAt = i + 2;
      }
      break;
    }
  }
  if (insertAt < 0) {
    // Fallback: append at end with a blank line
    const block = ["", ...markdownLines, ""];
    return `${logRaw.replace(/\s*$/, "")}\n${block.join("\n")}\n`;
  }
  lines.splice(insertAt, 0, ...markdownLines);
  return `${lines.join("\n").replace(/\s*$/, "")}\n`;
}

export async function applyActivityDrain(input: {
  ats?: string[];
  confirm: string;
}): Promise<DrainPreview & { drained: number; ok: true }> {
  if (input.confirm !== DRAIN_CONFIRM_PHRASE) {
    throw new Error("confirm_required");
  }

  return withQueueLock(async () => {
    const all = await readAllQueueRows();
    const selected = selectRows(all, input.ats);
    if (selected.length === 0) {
      return {
        at: new Date().toISOString(),
        mode: "apply" as const,
        sourceQueue: ACTIVITY_QUEUE_PATH,
        targetLog: ACTIVITY_LOG_PATH,
        selected: 0,
        remaining: all.length,
        rows: [],
        markdownLines: [],
        drained: 0,
        ok: true as const,
      };
    }

    const selectedAts = new Set(selected.map((r) => r.at));
    const remainingRows = all.filter((r) => !selectedAts.has(r.at));
    const markdownLines = selected.map(formatActivityLogMarkdownRow);

    const logRaw = await readFile(ACTIVITY_LOG_PATH, "utf8");
    const nextLog = insertMarkdownRows(logRaw, markdownLines);
    const tmpLog = `${ACTIVITY_LOG_PATH}.tmp`;
    await writeFile(tmpLog, nextLog, "utf8");
    await rename(tmpLog, ACTIVITY_LOG_PATH);

    await mkdir(DATA_DIR, { recursive: true });
    const nextQueue = remainingRows.map((r) => `${JSON.stringify(r)}\n`).join("");
    const tmpQueue = `${ACTIVITY_QUEUE_PATH}.tmp`;
    await writeFile(tmpQueue, nextQueue, "utf8");
    await rename(tmpQueue, ACTIVITY_QUEUE_PATH);

    return {
      at: new Date().toISOString(),
      mode: "apply" as const,
      sourceQueue: ACTIVITY_QUEUE_PATH,
      targetLog: ACTIVITY_LOG_PATH,
      selected: selected.length,
      remaining: remainingRows.length,
      rows: selected,
      markdownLines,
      drained: selected.length,
      ok: true as const,
    };
  });
}
