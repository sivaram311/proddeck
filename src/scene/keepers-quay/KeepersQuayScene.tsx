"use client";

import dynamic from "next/dynamic";
import type { QuaySceneProps } from "./types";

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

export function KeepersQuayScene(props: QuaySceneProps) {
  return <QuayCanvas {...props} />;
}
