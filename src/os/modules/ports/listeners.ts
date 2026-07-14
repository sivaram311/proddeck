import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export type ListenerScan = {
  ports: Set<number>;
  scan: "ok" | "skipped" | "failed";
  note?: string;
};

async function scanViaPowerShell(): Promise<number[]> {
  const script =
    "Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | " +
    "Select-Object -ExpandProperty LocalPort -Unique";
  const { stdout } = await execFileAsync(
    "powershell.exe",
    ["-NoProfile", "-NonInteractive", "-Command", script],
    { timeout: 12_000, windowsHide: true, maxBuffer: 2 * 1024 * 1024 },
  );
  return stdout
    .split(/\r?\n/)
    .map((line) => Number.parseInt(line.trim(), 10))
    .filter((n) => Number.isFinite(n) && n > 0);
}

async function scanViaNetstat(): Promise<number[]> {
  const { stdout } = await execFileAsync("netstat.exe", ["-an"], {
    timeout: 12_000,
    windowsHide: true,
    maxBuffer: 4 * 1024 * 1024,
  });
  const ports = new Set<number>();
  for (const line of stdout.split(/\r?\n/)) {
    if (!/LISTENING/i.test(line)) continue;
    const match = line.match(/:(\d+)\s*$/);
    if (!match) continue;
    const port = Number.parseInt(match[1], 10);
    if (Number.isFinite(port) && port > 0) ports.add(port);
  }
  return Array.from(ports);
}

/** Best-effort local listener scan — Windows-first; skipped off-node. */
export async function scanListeningPorts(): Promise<ListenerScan> {
  if (process.platform !== "win32") {
    return {
      ports: new Set(),
      scan: "skipped",
      note: "Listener scan runs on Windows host only",
    };
  }

  try {
    const psPorts = await scanViaPowerShell();
    if (psPorts.length > 0) {
      return { ports: new Set(psPorts), scan: "ok" };
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "powershell failed";
    try {
      const netstatPorts = await scanViaNetstat();
      return {
        ports: new Set(netstatPorts),
        scan: "ok",
        note: `PowerShell unavailable (${msg}); used netstat`,
      };
    } catch (fallbackErr) {
      const fb = fallbackErr instanceof Error ? fallbackErr.message : "netstat failed";
      return {
        ports: new Set(),
        scan: "failed",
        note: `${msg}; netstat: ${fb}`,
      };
    }
  }

  try {
    const netstatPorts = await scanViaNetstat();
    return { ports: new Set(netstatPorts), scan: "ok", note: "PowerShell returned empty; used netstat" };
  } catch (err) {
    return {
      ports: new Set(),
      scan: "failed",
      note: err instanceof Error ? err.message : "listener scan failed",
    };
  }
}
