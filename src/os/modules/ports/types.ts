/** Shared types for Ports module — registry rows + live listener scan. */

export type PortStatus = "active" | "reserved" | "legacy" | "retired";

export type PortRegistryEntry = {
  port: number;
  appId: string;
  env: string;
  role: string;
  status: PortStatus | string;
  notes?: string;
  path?: string;
};

export type PortMismatch = "none" | "not-listening" | "unknown-listener";

export type PortRow = PortRegistryEntry & {
  listening: boolean;
  mismatch: PortMismatch;
};

export type PortRange = {
  drive: string;
  min: number;
  max: number;
};

export type PortsResponse = {
  at: string;
  source: "registry.json" | "registry.md" | "merged";
  registryUpdated?: string;
  ranges?: Record<string, PortRange>;
  reserved: PortRow[];
  unknownListeners: number[];
  listenerScan: "ok" | "skipped" | "failed";
  listenerNote?: string;
};
