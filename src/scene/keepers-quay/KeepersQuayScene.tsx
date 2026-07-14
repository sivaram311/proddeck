"use client";

import dynamic from "next/dynamic";
import type { DeckApp } from "@/lib/types";
import type { CrewToken, QuayPlace } from "./types";

const QuayCanvas = dynamic(
  () => import("./QuayCanvas").then((m) => m.QuayCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-[var(--pd-ink)]">
        <p className="text-[var(--pd-mist)]">Lighting the Gate Lantern…</p>
      </div>
    ),
  },
);

type Props = {
  apps: DeckApp[];
  crews: CrewToken[];
  place: QuayPlace;
  onPlace: (p: QuayPlace) => void;
  onSelectApp: (app: DeckApp) => void;
  wakeToken: number;
  webglFailed: boolean;
  onWebglFail: () => void;
};

export function KeepersQuayScene(props: Props) {
  return <QuayCanvas {...props} />;
}
