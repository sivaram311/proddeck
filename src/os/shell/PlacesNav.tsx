"use client";

import { MORE_NAV, OS_PLACES, PRIMARY_NAV } from "../places";
import type { OsPlaceId } from "../types";

type Props = {
  active: OsPlaceId;
  onSelect: (id: OsPlaceId) => void;
};

export function PlacesNav({ active, onSelect }: Props) {
  const byId = Object.fromEntries(OS_PLACES.map((p) => [p.id, p]));
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Cloud OS places">
      {PRIMARY_NAV.map((id) => {
        const p = byId[id];
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={`min-h-11 rounded-md px-3 text-sm backdrop-blur-sm ${
              active === id
                ? "bg-[var(--pd-lime)] font-semibold text-[var(--pd-ink)]"
                : "border border-white/15 bg-black/35 text-[var(--pd-mist)]"
            }`}
          >
            {p?.short ?? id}
          </button>
        );
      })}
      <details className="relative">
        <summary className="flex min-h-11 cursor-pointer list-none items-center rounded-md border border-white/15 bg-black/35 px-3 text-sm text-[var(--pd-mist)] backdrop-blur-sm">
          More
        </summary>
        <div className="absolute z-20 mt-1 flex min-w-[9rem] flex-col gap-1 rounded-md border border-white/10 bg-[var(--pd-ink)] p-2 shadow-lg">
          {MORE_NAV.map((id) => {
            const p = byId[id];
            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelect(id)}
                className={`min-h-11 rounded-md px-3 text-left text-sm ${
                  active === id
                    ? "bg-[var(--pd-lime)] font-semibold text-[var(--pd-ink)]"
                    : "text-[var(--pd-mist)] hover:bg-white/5"
                }`}
              >
                {p?.label ?? id}
              </button>
            );
          })}
        </div>
      </details>
    </nav>
  );
}
