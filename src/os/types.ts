/** Cloud OS shared types — Wave 0 scaffold. Extend in module lanes carefully. */

export type OsEnv = "dev" | "preprod" | "prod" | "releases";

export type OsPlaceId =
  | "quay"
  | "control-tower"
  | "forge"
  | "yard"
  | "archive"
  | "watch"
  | "remember"
  | "vault";

export type OsModuleId =
  | "pulse"
  | "ports"
  | "beacon"
  | "identity"
  | "activity-log"
  | "archive"
  | "dispatch"
  | "promote"
  | "yard"
  | "runbooks"
  | "appliances"
  | "drive-guard"
  | "filebridge"
  | "watch-ops";

export type OsModuleFlags = Record<OsModuleId, boolean>;

export type HealthSnapshot = {
  at: string;
  uptimeSec?: number;
  drives?: { letter: string; freeGb?: number; totalGb?: number; ok: boolean }[];
  postgresOk?: boolean;
  cssOk?: boolean;
  /** CSS_AUTH_URL used for the reachability probe */
  cssBase?: string;
  notes?: string[];
};
