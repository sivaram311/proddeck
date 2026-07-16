import { execFile } from "child_process";
import { promisify } from "util";
import { OS_FLAGS } from "@/os/flags";
import { appendActivityQueueRow } from "@/os/modules/activity-log/queue";
import { dryRunPortStop, NEVER_STOP_PORTS } from "./stopDryRun";

const execFileAsync = promisify(execFile);

export const STOP_CONFIRM_PHRASE = "STOP_PORT_PROCESS";

export type PortStopKillResult = {
  at: string;
  mode: "kill";
  flagOn: boolean;
  rows: {
    port: number;
    pid: number | null;
    killed: boolean;
    reason: string;
  }[];
};

/**
 * Kill allowlisted listeners only. Flag OFF → refuse.
 * Always re-runs dry-run allow logic; never touches NEVER_STOP_PORTS.
 */
export async function killPortProcesses(input: {
  ports: number[];
  confirmPorts: number[];
  confirmPhrase: string;
}): Promise<{ ok: true; result: PortStopKillResult } | { ok: false; status: number; error: string; message: string; code?: string }> {
  if (!OS_FLAGS.portsStopKill()) {
    return {
      ok: false,
      status: 403,
      error: "blocked",
      code: "flag_off",
      message: "OS_PORTS_STOP_KILL=0 (default). Dry-run only.",
    };
  }

  if (input.confirmPhrase !== STOP_CONFIRM_PHRASE) {
    return {
      ok: false,
      status: 400,
      error: "confirm_required",
      code: "confirm_required",
      message: `Type exact phrase ${STOP_CONFIRM_PHRASE}`,
    };
  }

  const ports = [...new Set(input.ports.filter((p) => Number.isFinite(p) && p >= 1 && p <= 65535))];
  if (ports.length === 0 || ports.length > 3) {
    return {
      ok: false,
      status: 400,
      error: "ports_limit",
      message: "Provide 1–3 ports",
    };
  }

  const confirmSorted = [...input.confirmPorts].sort((a, b) => a - b);
  const portsSorted = [...ports].sort((a, b) => a - b);
  if (confirmSorted.join(",") !== portsSorted.join(",")) {
    return {
      ok: false,
      status: 400,
      error: "confirm_ports_mismatch",
      message: "confirmPorts must equal ports",
    };
  }

  for (const p of ports) {
    if (NEVER_STOP_PORTS.has(p)) {
      return {
        ok: false,
        status: 403,
        error: "deny_list",
        code: "deny_list_critical_shared_service",
        message: `Port ${p} is on NEVER_STOP_PORTS`,
      };
    }
  }

  const dry = await dryRunPortStop(ports);
  const rows: PortStopKillResult["rows"] = [];

  for (const row of dry.rows) {
    if (!row.allowed) {
      rows.push({
        port: row.port,
        pid: row.listenPid,
        killed: false,
        reason: row.reason,
      });
      continue;
    }
    const pid = row.listenPid;
    if (!pid || pid <= 0) {
      rows.push({ port: row.port, pid: null, killed: false, reason: "no_pid" });
      continue;
    }

    try {
      await execFileAsync("taskkill", ["/PID", String(pid), "/T", "/F"], {
        windowsHide: true,
      });
      rows.push({ port: row.port, pid, killed: true, reason: "taskkill_ok" });
      try {
        await appendActivityQueueRow({
          action: "ports.stop.kill",
          target: String(row.port),
          result: "killed",
          notes: `pid=${pid}`,
          provider: "proddeck",
          role: "os",
          session: "proddeck-ports",
        });
      } catch {
        /* ignore */
      }
    } catch (err) {
      rows.push({
        port: row.port,
        pid,
        killed: false,
        reason: err instanceof Error ? err.message : "taskkill_failed",
      });
    }
  }

  return {
    ok: true,
    result: {
      at: new Date().toISOString(),
      mode: "kill",
      flagOn: true,
      rows,
    },
  };
}
