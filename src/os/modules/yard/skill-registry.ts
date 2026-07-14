import { PROMOTE_SKILL_IDS, PROMOTE_SKILL_LABEL, SKILL_PACKS } from "./skill-packs";
import type { SkillRegistryEntry } from "./types";

const WORKFLOW_ROOT = "E:\\MyAgent\\workflow\\";
const PROMOTE_ROOT = "E:\\MyAgent\\workflow\\promote\\";
const PERSONAS_ROOT = "E:\\machine-docs\\personas\\";
const SKILLS_ROOT = "E:\\MyAgent\\.cursor\\skills\\";

/** Persona / lane ids used in SKILL_PACKS — aligned with machine-docs personas. */
const PERSONA_ENTRIES: SkillRegistryEntry[] = [
  {
    id: "crew-lead",
    kind: "persona",
    label: "Crew Lead",
    blurb: "Owns hire order, pre-work gate, merge serial, ACTIVITY-LOG.",
    pathNote: PERSONAS_ROOT,
  },
  {
    id: "architect",
    kind: "persona",
    label: "Technical Architect",
    blurb: "Contracts, tech choices, non-regression gates before code.",
    pathNote: PERSONAS_ROOT,
  },
  {
    id: "implementer",
    kind: "persona",
    label: "Implementer",
    blurb: "Disjoint file ownership lanes — code only after pre-work GO.",
    pathNote: PERSONAS_ROOT,
  },
  {
    id: "docs-keeper",
    kind: "persona",
    label: "Docs-Keeper",
    blurb: "README / OPS / rule #12 docs in the same turn as the change.",
    pathNote: PERSONAS_ROOT,
  },
  {
    id: "qa",
    kind: "persona",
    label: "QA-Tester",
    blurb: "Smoke scripts and destination notes for product lanes.",
    pathNote: PERSONAS_ROOT,
  },
  {
    id: "validation-gatekeeper",
    kind: "persona",
    label: "Validation Gatekeeper",
    blurb: "Cross-review pre-work docs; checklist before coding roles.",
    pathNote: PERSONAS_ROOT,
  },
  {
    id: "security",
    kind: "persona",
    label: "Security-Auditor",
    blurb: "CSS / JWT / secrets posture on incident and product crews.",
    pathNote: PERSONAS_ROOT,
  },
  {
    id: "pulse-reader",
    kind: "lane",
    label: "Pulse reader",
    blurb: "Health snapshot lane for incident packs.",
    pathNote: WORKFLOW_ROOT,
  },
  {
    id: "ports-beacon",
    kind: "lane",
    label: "Ports / Beacon",
    blurb: "Listener vs port registry / nginx — read-only propose.",
    pathNote: `${WORKFLOW_ROOT}ports\\`,
  },
  {
    id: "ops-propose",
    kind: "lane",
    label: "Ops propose",
    blurb: "Change proposal only — execute after human confirm.",
    pathNote: WORKFLOW_ROOT,
  },
  {
    id: "dispatch",
    kind: "lane",
    label: "Dispatch",
    blurb: "Optional AgentVerse Session Desk hire with brief context.",
    pathNote: PERSONAS_ROOT,
  },
];

const PROMOTE_ENTRIES: SkillRegistryEntry[] = PROMOTE_SKILL_IDS.map((id) => ({
  id,
  kind: "promote" as const,
  label: id,
  blurb: PROMOTE_SKILL_LABEL[id],
  pathNote: `${SKILLS_ROOT}${id}\\`,
}));

const PACK_ENTRIES: SkillRegistryEntry[] = SKILL_PACKS.map((pack) => ({
  id: pack.id,
  kind: "pack" as const,
  label: pack.label,
  blurb: pack.blurb,
  pathNote: pack.id.startsWith("promote-") ? PROMOTE_ROOT : PERSONAS_ROOT,
}));

/**
 * Static MyAgent-aligned catalog for Yard Skill registry panel.
 * Read-only — Hire remains on Skill packs only (soft `crew.fabric.spawned`).
 */
export const SKILL_REGISTRY: SkillRegistryEntry[] = [
  ...PROMOTE_ENTRIES,
  ...PERSONA_ENTRIES,
  ...PACK_ENTRIES,
];

export const SKILL_REGISTRY_PATH_HINT =
  "SoT: E:\\MyAgent\\workflow\\ · personas: E:\\machine-docs\\personas\\";
