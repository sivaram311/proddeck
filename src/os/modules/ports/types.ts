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
