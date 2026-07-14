import { execFile } from "child_process";
import { promisify } from "util";
import type { PortRow } from "./types";
import { collectPortsSnapshot } from "./registry";

const execFileAsync = promisify(execFile);

/**
 * Ports that must never be kill candidates — dry-run still reports blocked.
 * Expand carefully; prefer deny over allow for shared services.
 */
export const NEVER_STOP_PORTS = new Set<number>([
  80, 443, 5432, 5900, 9000, 4900, // edge / postgres / CSS
  4080, 5080, // Portal APIs
  4310, 4311, 5310, 5311, // AgentVerse classic + v2
  4320, 5320, 3320, // ProdDeck (self + live)
]);

export type PortStopDryRunRow = {
  port: number;
  appId: string;
  env: string;
  listening: boolean;
  listenPid: number | null;
  allowed: boolean;
  reason: string;
  /** Always false in Wave A — no kill IO. */
  wouldKill: false;
};

export type PortStopDryRunResponse = {
  at: string;
  mode: "dry-run";
  wouldKill: false;
  rows: PortStopDryRunRow[];
};

async function listenPidFor(port: number): Promise<number | null> {
  try {
    const { stdout } = await execFileAsync(
      "netstat",
      ["-ano"],
      { windowsHide: true, maxBuffer: 4 * 1024 * 1024 },
    );
    const re = new RegExp(`:${port}\\s+.*LISTENING\\s+(\\d+)\\s*$`, "im");
    for (const line of stdout.split(/\r?\n/)) {
      if (!/LISTENING/i.test(line)) continue;
      if (!line.includes(`:${port}`)) continue;
      // tighter: :port followed by whitespace (not :4320 matching :432)
      if (!new RegExp(`:${port}\\s`).test(line)) continue;
      const m = line.match(/\s(\d+)\s*$/);
      if (m) return Number(m[1]);
    }
  } catch {
    /* ignore */
  }
  return null;
}

function reasonFor(port: number, row: PortRow | undefined, pid: number | null): {
  allowed: boolean;
  reason: string;
} {
  if (NEVER_STOP_PORTS.has(port)) {
    return { allowed: false, reason: "deny_list_critical_shared_service" };
  }
  if (!row) {
    return { allowed: false, reason: "not_in_registry" };
  }
  if (!row.listening && !pid) {
    return { allowed: false, reason: "not_listening" };
  }
  return {
    allowed: true,
    reason: "dry_run_ok_no_kill_wave_a",
  };
}

/** Preview only — never Stop-Process / taskkill. */
export async function dryRunPortStop(ports: number[]): Promise<PortStopDryRunResponse> {
  const unique = [...new Set(ports.filter((p) => Number.isFinite(p) && p >= 1 && p <= 65535))];
  const snapshot = await collectPortsSnapshot();
  const byPort = new Map<number, PortRow>();
  for (const r of snapshot.rows) {
    if (!byPort.has(r.port)) byPort.set(r.port, r);
  }

  const rows: PortStopDryRunRow[] = [];
  for (const port of unique) {
    const row = byPort.get(port);
    const pid = await listenPidFor(port);
    const { allowed, reason } = reasonFor(port, row, pid);
    rows.push({
      port,
      appId: row?.appId ?? "(unknown)",
      env: row?.env ?? "",
      listening: Boolean(row?.listening || pid),
      listenPid: pid,
      allowed,
      reason,
      wouldKill: false,
    });
  }

  return {
    at: new Date().toISOString(),
    mode: "dry-run",
    wouldKill: false,
    rows,
  };
}
