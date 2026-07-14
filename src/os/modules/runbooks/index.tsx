"use client";

import { useState } from "react";
import { RUNBOOKS, type Runbook } from "./data";

export function RunbooksView() {
  const [active, setActive] = useState<Runbook>(RUNBOOKS[0]!);

  return (
    <section className="flex flex-col gap-4" aria-label="Runbooks">
      <header>
        <p className="m-0 text-base text-[var(--pd-lime)]" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
          Remember · Runbooks
        </p>
        <p className="mt-1 m-0 text-sm text-[var(--pd-mist)]">Category → steps → Dispatch / Yard / Pulse</p>
      </header>
      <div className="flex flex-col gap-2">
        {RUNBOOKS.map((rb) => (
          <button
            key={rb.id}
            type="button"
            onClick={() => setActive(rb)}
            className={`min-h-11 rounded-lg border px-3 py-3 text-left ${
              active.id === rb.id
                ? "border-[var(--pd-lime)]/50 bg-[var(--pd-lime)]/10"
                : "border-white/10 bg-black/55"
            }`}
          >
            <p className="m-0 text-sm font-semibold text-[var(--pd-paper)]">{rb.title}</p>
            <p className="mt-1 m-0 text-xs text-[var(--pd-mist)]">{rb.category}</p>
          </button>
        ))}
      </div>
      <article className="rounded-lg border border-white/10 bg-black/55 p-4">
        <p className="m-0 text-sm font-semibold text-[var(--pd-paper)]">{active.title}</p>
        <ol className="mt-3 m-0 list-decimal space-y-2 pl-5 text-sm text-[var(--pd-mist)]">
          {active.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <div className="mt-4 flex flex-wrap gap-2">
          {active.links.map((l) => (
            <a
              key={l.href + l.label}
              href={l.href}
              className="flex min-h-11 items-center rounded-md border border-white/15 px-3 text-sm text-[var(--pd-lime)]"
            >
              {l.label}
            </a>
          ))}
        </div>
      </article>
    </section>
  );
}
