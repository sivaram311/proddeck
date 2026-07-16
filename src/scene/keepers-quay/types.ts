"use client";

import type { DeckApp } from "@/lib/types";
import type { KeeperAction } from "./Characters";

export type QuayPlace = "pier" | "manifest" | "shed" | "loft";

export type CrewToken = {
  id: string;
  label: string;
  watch: string;
};

/** Optional OS → scene echo props (Q3D read-only). */
export type QuayOsEcho = {
  pulse?: { e: number; f: number; g: number; h: number };
  ports?: { port: number; state: "ok" | "mismatch" | "unknown" }[];
  cssFresh?: boolean;
  promoteDecision?: "GO" | "HOLD" | "NEED_EVIDENCE" | null;
  fabricLanes?: { id: string; label: string; status: string }[];
  beaconUp?: number;
};

export type QuaySceneProps = {
  apps: DeckApp[];
  crews: CrewToken[];
  place: QuayPlace;
  onPlace: (p: QuayPlace) => void;
  onSelectApp: (app: DeckApp) => void;
  wakeToken: number;
  webglFailed: boolean;
  onWebglFail: () => void;
  pendingSlug: string | null;
  ticketToken: number;
  keeperAction: KeeperAction;
  actionToken: number;
  loftAck: boolean;
  gateAck: boolean;
  /** Cloud OS 1.0 — optional read-only echoes */
  osEcho?: QuayOsEcho;
};
