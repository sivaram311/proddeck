"use client";

import type { OsModuleId } from "../../types";

/** Placeholder until Wave 1 lane owns this module. */
export function ModuleStub({
  id,
  title,
  blurb,
}: {
  id: OsModuleId;
  title: string;
  blurb: string;
}) {
  return (
    <section
      className="rounded-lg border border-white/10 bg-black/55 p-4 backdrop-blur-md"
      aria-label={title}
    >
      <p
        className="m-0 text-sm text-[var(--pd-lime)]"
        style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
      >
        {title}
      </p>
      <p className="mt-2 m-0 text-sm text-[var(--pd-mist)]">{blurb}</p>
      <p className="mt-3 m-0 font-mono text-xs text-[var(--pd-mist)]">
        module:<span className="text-[var(--pd-paper)]">{id}</span> · Wave 1 owns{" "}
        <code className="text-[var(--pd-lime)]">src/os/modules/{id}/</code>
      </p>
    </section>
  );
}
