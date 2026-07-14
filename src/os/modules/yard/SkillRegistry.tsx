"use client";

import { SKILL_REGISTRY, SKILL_REGISTRY_PATH_HINT } from "./skill-registry";
import type { SkillRegistryKind } from "./types";

const KIND_LABEL: Record<SkillRegistryKind, string> = {
  promote: "Promote",
  persona: "Persona",
  pack: "Pack",
  lane: "Lane",
};

const KIND_ORDER: SkillRegistryKind[] = ["promote", "persona", "lane", "pack"];

export function SkillRegistry() {
  const grouped = KIND_ORDER.map((kind) => ({
    kind,
    entries: SKILL_REGISTRY.filter((e) => e.kind === kind),
  })).filter((g) => g.entries.length > 0);

  return (
    <section aria-label="Skill registry" className="flex flex-col gap-3">
      <header>
        <p
          className="m-0 text-sm text-[var(--pd-paper)]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
        >
          Skill registry
        </p>
        <p className="mt-1 m-0 text-xs text-[var(--pd-mist)]">
          Read-only catalog — MyAgent promote skills, personas, and Yard packs. No spawn from
          this list.
        </p>
        <p className="mt-2 m-0 break-all font-mono text-[10px] leading-relaxed text-[var(--pd-mist)]">
          {SKILL_REGISTRY_PATH_HINT}
        </p>
      </header>

      {grouped.map(({ kind, entries }) => (
        <div key={kind} className="flex flex-col gap-2">
          <p className="m-0 text-xs font-semibold uppercase tracking-wide text-[var(--pd-mist)]">
            {KIND_LABEL[kind]}
          </p>
          <ul className="m-0 flex list-none flex-col gap-2 p-0" aria-label={`${KIND_LABEL[kind]} ids`}>
            {entries.map((entry) => (
              <li
                key={`${entry.kind}-${entry.id}`}
                className="min-h-11 rounded-lg border border-white/10 bg-black/55 px-3 py-3 backdrop-blur-md"
              >
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <p className="m-0 font-mono text-xs text-[var(--pd-lime)]">{entry.id}</p>
                  <p className="m-0 text-xs font-semibold text-[var(--pd-paper)]">{entry.label}</p>
                </div>
                <p className="mt-1 m-0 text-xs text-[var(--pd-mist)]">{entry.blurb}</p>
                <p className="mt-2 m-0 break-all font-mono text-[10px] text-[var(--pd-mist)]">
                  {entry.pathNote}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
