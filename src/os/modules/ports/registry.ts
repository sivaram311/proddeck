import { readFile } from "fs/promises";
import path from "path";
import type { PortRegistryEntry, PortStatus } from "./types";

const DEFAULT_JSON = "E:\\MyAgent\\workflow\\ports\\registry.json";

type RawRegistry = {
  version?: number;
  updated?: string;
  ranges?: Record<string, { drive?: string; min?: number; max?: number }>;
  shared?: RawEntry[];
  reservations?: RawEntry[];
  ports?: RawEntry[];
};

type RawEntry = {
  port?: number;
  appId?: string;
  env?: string;
  role?: string;
  status?: string;
  notes?: string;
  path?: string;
};

function registryJsonPath(): string {
  return (process.env.MYAGENT_PORTS_REGISTRY || DEFAULT_JSON).trim();
}

function registryMdPath(): string {
  const fromEnv = (process.env.MYAGENT_PORTS_REGISTRY_MD || "").trim();
  if (fromEnv) return fromEnv;
  return path.join(path.dirname(registryJsonPath()), "REGISTRY.md");
}

function stripBom(raw: string): string {
  return raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
}

function normalizeStatus(raw: string | undefined): PortStatus | string {
  const s = (raw || "reserved").toLowerCase();
  if (s === "active" || s === "reserved" || s === "legacy" || s === "retired") return s;
  return s;
}

function normalizeEntry(raw: RawEntry): PortRegistryEntry | null {
  const port = Number(raw.port);
  const appId = String(raw.appId ?? "").trim();
  if (!Number.isFinite(port) || port <= 0 || !appId) return null;
  return {
    port,
    appId,
    env: String(raw.env ?? "unknown").trim(),
    role: String(raw.role ?? "http").trim(),
    status: normalizeStatus(raw.status),
    notes: raw.notes ? String(raw.notes).trim() : undefined,
    path: raw.path ? String(raw.path).trim() : undefined,
  };
}

function mergeEntries(lists: PortRegistryEntry[][]): PortRegistryEntry[] {
  const byPort = new Map<number, PortRegistryEntry>();
  for (const list of lists) {
    for (const entry of list) {
      const prev = byPort.get(entry.port);
      byPort.set(entry.port, prev ? { ...prev, ...entry } : entry);
    }
  }
  return Array.from(byPort.values()).sort((a, b) => a.port - b.port);
}

function inferEnvFromSection(section: string): string {
  const s = section.toLowerCase();
  if (s.includes("dev (e:")) return "dev";
  if (s.includes("preprod (f:")) return "preprod";
  if (s.includes("prod (g:")) return "prod";
  if (s.includes("shared")) return "shared";
  if (s.includes("legacy")) return "unknown";
  return "unknown";
}

function parseRegistryMd(content: string): PortRegistryEntry[] {
  const entries: PortRegistryEntry[] = [];
  let section = "";

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) {
      section = trimmed.slice(3);
      continue;
    }
    if (!trimmed.startsWith("|")) continue;
    if (/^\|\s*[-:]/.test(trimmed)) continue;

    const cols = trimmed
      .split("|")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);
    if (cols.length < 4) continue;

    const port = Number.parseInt(cols[0], 10);
    if (!Number.isFinite(port) || port <= 0) continue;

    const appId = cols[1];
    if (!appId || appId.toLowerCase() === "port") continue;

    let env = inferEnvFromSection(section);
    let role = "http";
    let status: PortStatus | string = "reserved";
    let notes: string | undefined;
    let entryPath: string | undefined;

    if (cols.length >= 7) {
      env = cols[2] || env;
      role = cols[3] || role;
      status = normalizeStatus(cols[4]);
      notes = cols[6] || cols[5] || undefined;
    } else if (cols.length >= 6) {
      role = cols[2] || role;
      status = normalizeStatus(cols[3]);
      entryPath = cols[4] || undefined;
      notes = cols[5] || undefined;
    } else {
      role = cols[2] || role;
      status = normalizeStatus(cols[3]);
      notes = cols[4] || undefined;
    }

    entries.push({ port, appId, env, role, status, notes, path: entryPath });
  }

  return entries;
}

export type LoadedRegistry = {
  updated?: string;
  ranges?: RawRegistry["ranges"];
  entries: PortRegistryEntry[];
  source: "registry.json" | "registry.md" | "merged";
};

const THIN_JSON_THRESHOLD = 5;

export async function loadPortRegistry(): Promise<LoadedRegistry> {
  const jsonPath = registryJsonPath();
  const mdPath = registryMdPath();

  let jsonEntries: PortRegistryEntry[] = [];
  let updated: string | undefined;
  let ranges: RawRegistry["ranges"];

  try {
    const raw = stripBom(await readFile(jsonPath, "utf8"));
    const parsed = JSON.parse(raw) as RawRegistry;
    updated = parsed.updated;
    ranges = parsed.ranges;
    jsonEntries = mergeEntries([
      (parsed.shared || []).map(normalizeEntry).filter(Boolean) as PortRegistryEntry[],
      (parsed.reservations || []).map(normalizeEntry).filter(Boolean) as PortRegistryEntry[],
      (parsed.ports || []).map(normalizeEntry).filter(Boolean) as PortRegistryEntry[],
    ]);
  } catch {
    jsonEntries = [];
  }

  if (jsonEntries.length >= THIN_JSON_THRESHOLD) {
    return { updated, ranges, entries: jsonEntries, source: "registry.json" };
  }

  let mdEntries: PortRegistryEntry[] = [];
  try {
    const md = await readFile(mdPath, "utf8");
    mdEntries = parseRegistryMd(md);
  } catch {
    mdEntries = [];
  }

  if (jsonEntries.length === 0 && mdEntries.length > 0) {
    return { updated, ranges, entries: mdEntries, source: "registry.md" };
  }

  if (jsonEntries.length > 0 && mdEntries.length > 0) {
    return {
      updated,
      ranges,
      entries: mergeEntries([jsonEntries, mdEntries]),
      source: "merged",
    };
  }

  return {
    updated,
    ranges,
    entries: jsonEntries.length > 0 ? jsonEntries : mdEntries,
    source: jsonEntries.length > 0 ? "registry.json" : "registry.md",
  };
}
