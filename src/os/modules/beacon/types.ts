export type BeaconTarget = {
  id: string;
  label: string;
  kind: "http" | "tcp";
  url?: string;
  host?: string;
  port?: number;
};

export type BeaconRow = BeaconTarget & {
  ok: boolean;
  ms?: number;
  detail?: string;
};

export type BeaconSnapshot = {
  at: string;
  rows: BeaconRow[];
};
