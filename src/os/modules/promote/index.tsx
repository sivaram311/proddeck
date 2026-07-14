"use client";

import { useState } from "react";
import type { PromoteGate } from "./types";
import { GateChecklist } from "./GateChecklist";

const GATES: { id: PromoteGate; label: string; subtitle: string }[] = [
  {
    id: "Q1",
    label: "Q1 PREPROD",
    subtitle: "F:\\apps\\proddeck · :4320 · home-staging.delena.buzz",
  },
  {
    id: "Q2",
    label: "Q2 PROD",
    subtitle: "G:\\apps\\proddeck · :5320 · home.delena.buzz",
  },
];

export function PromoteView() {
  const [gate, setGate] = useState<PromoteGate>("Q1");
  const active = GATES.find((g) => g.id === gate) ?? GATES[0];

  return (
    <section
      className="rounded-lg border border-white/10 bg-black/55 p-4 backdrop-blur-md"
      aria-label="Promote"
    >
      <p
        className="m-0 text-sm text-[var(--pd-lime)]"
        style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
      >
        Promote
      </p>
      <p className="mt-2 m-0 text-sm text-[var(--pd-mist)]">
        Q1/Q2 evidence checklist + GO/HOLD record. Hire <code>promote-field-ops</code> on every
        promote crew.
      </p>

      <div
        className="mt-3 rounded-md border border-[var(--pd-danger)]/50 bg-[var(--pd-danger)]/10 px-3 py-2 text-sm text-[var(--pd-paper)]"
        role="note"
      >
        <strong className="text-[var(--pd-danger)]">Record only</strong> — this module does{" "}
        <strong>not</strong> run deploy scripts or copy to F:/G:. Decisions persist in browser
        localStorage (Wave 1).
      </div>

      <div
        className="mt-3 rounded-md border border-white/10 bg-black/35 px-3 py-2 text-xs text-[var(--pd-mist)]"
        role="note"
      >
        <span className="text-[var(--pd-lime)]">Field-ops tip:</span> bind race, CF cache, PS{" "}
        <code>$PID</code> traps, serial ACTIVITY-LOG — see{" "}
        <code>E:\MyAgent\workflow\promote\field-lessons.md</code>
      </div>

      <div className="mt-4 flex gap-2" role="tablist" aria-label="Promote gate">
        {GATES.map((g) => (
          <button
            key={g.id}
            type="button"
            role="tab"
            aria-selected={gate === g.id}
            onClick={() => setGate(g.id)}
            className={`min-h-11 flex-1 rounded-md px-3 text-sm font-semibold ${
              gate === g.id
                ? "bg-[var(--pd-lime)] text-[var(--pd-ink)]"
                : "border border-white/15 bg-black/35 text-[var(--pd-mist)]"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="mt-4" role="tabpanel" aria-label={active.label}>
        <GateChecklist gate={active.id} subtitle={active.subtitle} />
      </div>
    </section>
  );
}
