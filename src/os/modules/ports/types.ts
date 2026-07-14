export type PortReservation = {
  port: number;
  appId: string;
  env: string;
  role?: string;
  status?: string;
  notes?: string;
};

export type PortRow = PortReservation & {
  listening: boolean;
  mismatch: "ok" | "reserved-not-listening" | "listening-unknown";
};

export type PortsSnapshot = {
  at: string;
  registryPath: string;
  rows: PortRow[];
  unknownListening: { port: number }[];
};

export type PortReserveEnv = "dev" | "preprod" | "prod";

/** Job payload for dispatch.hire.requested — request-only, no bind. */
export type PortReserveJob = {
  kind: "ports.reserve";
  port: number;
  appId: string;
  env: PortReserveEnv;
  notes?: string;
  registryHint: string;
  requestedAt: string;
};
