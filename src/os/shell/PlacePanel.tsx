"use client";

import { OS_PLACES } from "../places";
import { OS_MODULE_VIEWS } from "../registry";
import type { OsModuleFlags, OsPlaceId } from "../types";

type Props = {
  place: OsPlaceId;
  flags: OsModuleFlags;
};

export function PlacePanel({ place, flags }: Props) {
  if (place === "quay") return null;
  const def = OS_PLACES.find((p) => p.id === place);
  if (!def) return null;
  const modules = def.modules.filter((id) => flags[id] !== false);

  return (
    <section
      className="pointer-events-auto mt-4 max-h-[62vh] space-y-3 overflow-y-auto"
      aria-label={def.label}
    >
      <p
        className="m-0 text-sm text-[var(--pd-paper)]"
        style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
      >
        {def.label}
      </p>
      {modules.length === 0 ? (
        <p className="text-sm text-[var(--pd-mist)]">No modules enabled for this place.</p>
      ) : (
        modules.map((id) => {
          const View = OS_MODULE_VIEWS[id];
          return View ? <View key={id} /> : null;
        })
      )}
    </section>
  );
}
