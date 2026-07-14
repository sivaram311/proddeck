import { readFile } from "fs/promises";
import { execFile } from "child_process";
import { promisify } from "util";
import type { PortReservation, PortRow, PortsSnapshot } from "./types";

export type { PortReservation, PortRow, PortsSnapshot } from "./types";

const execFileAsync = promisify(execFile);

const REGISTRY_PATH = "E:\\MyAgent\\workflow\\ports\\registry.json";

type RegistryFile = {
  shared?: PortReservation[];
  reservations?: PortReservation[];
};

async function loadRegistry(): Promise<PortReservation[]> {
  const raw = JSON.parse(await readFile(REGISTRY_PATH, "utf8")) as RegistryFile;
  return [...(raw.shared ?? []), ...(raw.reservations ?? [])];
}

async function listeningPorts(): Promise<Set<number>> {
  const set = new Set<number>();
  try {
    const { stdout } = await execFileAsync(
      "powershell.exe",
      [
        "-NoProfile",
        "-Command",
        "(Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue).LocalPort | Sort-Object -Unique",
      ],
      { timeout: 8000, windowsHide: true },
    );
    for (const line of stdout.split(/\r?\n/)) {
      const n = Number(line.trim());
      if (Number.isFinite(n) && n > 0) set.add(n);
    }
  } catch {
    try {
      const { stdout } = await execFileAsync("netstat", ["-ano"], {
        timeout: 8000,
        windowsHide: true,
      });
      for (const line of stdout.split(/\r?\n/)) {
        if (!/\sLISTEN/i.test(line)) continue;
        const m = line.match(/:(\d+)\s/);
        if (m) set.add(Number(m[1]));
      }
    } catch {
      /* best-effort */
    }
  }
  return set;
}

export async function collectPortsSnapshot(): Promise<PortsSnapshot> {
  const reserved = await loadRegistry();
  const listening = await listeningPorts();
  const reservedPorts = new Set(reserved.map((r) => r.port));

  const rows: PortRow[] = reserved.map((r) => {
    const isUp = listening.has(r.port);
    return {
      ...r,
      listening: isUp,
      mismatch: isUp ? "ok" : "reserved-not-listening",
    };
  });

  const unknownListening = [...listening]
    .filter((p) => !reservedPorts.has(p) && p >= 3000 && p < 6000)
    .sort((a, b) => a - b)
    .map((port) => ({ port }));

  for (const u of unknownListening) {
    rows.push({
      port: u.port,
      appId: "(unknown)",
      env: "?",
      listening: true,
      mismatch: "listening-unknown",
    });
  }

  rows.sort((a, b) => a.port - b.port);

  return {
    at: new Date().toISOString(),
    registryPath: REGISTRY_PATH,
    rows,
    unknownListening,
  };
}
