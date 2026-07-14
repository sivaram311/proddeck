"use client";

import type { DeckApp } from "@/lib/types";

type Props = {
  app: DeckApp;
  index: number;
  onPick?: (app: DeckApp) => void;
};

export function AppTile({ app, index, onPick }: Props) {
  const className =
    "pd-tile block min-h-11 w-full rounded-lg border border-white/10 bg-[var(--pd-steel)]/80 px-4 py-4 text-left no-underline transition-[border-color,background-color] duration-200 hover:border-[var(--pd-lime)]/60 hover:bg-[var(--pd-steel)]";
  const style = { animationDelay: `${Math.min(index, 8) * 45}ms` } as const;
  const body = (
    <>
      <span
        className="block text-lg text-[var(--pd-paper)]"
        style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
      >
        {app.name}
      </span>
      <span className="mt-1 block text-sm leading-snug text-[var(--pd-mist)]">
        {app.description || app.baseUrl}
      </span>
    </>
  );

  if (onPick) {
    return (
      <button type="button" className={className} style={style} onClick={() => onPick(app)}>
        {body}
      </button>
    );
  }

  return (
    <a
      href={app.baseUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
    >
      {body}
    </a>
  );
}
