import type { OsModuleId, OsPlaceId } from "./types";

export type PlaceDef = {
  id: OsPlaceId;
  label: string;
  short: string;
  /** Primary modules shown in this place */
  modules: OsModuleId[];
};

/** Purpose-first Places — Quay is home mythos. */
export const OS_PLACES: PlaceDef[] = [
  {
    id: "quay",
    label: "Quay",
    short: "Home",
    modules: [],
  },
  {
    id: "control-tower",
    label: "Control Tower",
    short: "Control",
    modules: ["pulse", "ports", "beacon", "drive-guard"],
  },
  {
    id: "forge",
    label: "Forge",
    short: "Forge",
    modules: ["dispatch", "promote", "appliances"],
  },
  {
    id: "yard",
    label: "Yard",
    short: "Crews",
    modules: ["yard"],
  },
  {
    id: "archive",
    label: "Archive",
    short: "Archive",
    modules: ["archive", "filebridge"],
  },
  {
    id: "watch",
    label: "Watch",
    short: "Watch",
    modules: ["activity-log"],
  },
  {
    id: "remember",
    label: "Remember",
    short: "Help",
    modules: ["runbooks"],
  },
  {
    id: "vault",
    label: "Vault",
    short: "ID",
    modules: ["identity"],
  },
];

export const PRIMARY_NAV: OsPlaceId[] = [
  "quay",
  "control-tower",
  "forge",
  "yard",
  "archive",
];

export const MORE_NAV: OsPlaceId[] = ["watch", "remember", "vault"];
