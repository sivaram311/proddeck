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

/** Hire / promote-related OS events surfaced as Beacon tip. */
export type BeaconTipType =
  | "dispatch.hire.requested"
  | "promote.decision"
  | "crew.fabric.spawned";

export type BeaconTip = {
  type: BeaconTipType;
  at: string;
  actor: string;
};
