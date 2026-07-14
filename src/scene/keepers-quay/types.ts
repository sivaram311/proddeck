"use client";

import type { DeckApp } from "@/lib/types";
import type { KeeperAction } from "./Characters";

export type QuayPlace = "pier" | "manifest" | "shed" | "loft";

export type CrewToken = {
  id: string;
  label: string;
  watch: string;
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
};
