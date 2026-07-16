import type { LaneStatus, MissionTemplate } from "./types";

/** Static mission templates — Wave 1 manual lane board (no Portal hire yet). */
export const MISSION_TEMPLATES: MissionTemplate[] = [
  {
    id: "promote-q1-proddeck",
    title: "Promote Q1 · ProdDeck",
    env: "preprod",
    goal: "Qualify 0.5.x scaffold for PREPROD — evidence under H:\\releases\\proddeck-*\\evidence\\q1\\",
    linkedApp: "proddeck",
    packId: "promote-q1",
    lanes: [
      {
        id: "em",
        skillId: "promote-em",
        label: "promote-em",
        job: "Orchestrate checklist; only lane that may set GO/HOLD.",
      },
      {
        id: "qa",
        skillId: "promote-qa",
        label: "promote-qa",
        job: "Smoke matrix + destination smoke notes.",
      },
      {
        id: "security",
        skillId: "promote-security",
        label: "promote-security",
        job: "CSS / JWT / secrets scan notes.",
      },
      {
        id: "review",
        skillId: "promote-review",
        label: "promote-review",
        job: "Ports, DB, drive, diff compliance.",
      },
      {
        id: "field-ops",
        skillId: "promote-field-ops",
        label: "promote-field-ops",
        job: "Bind race, CF cache, PS traps, serial ACTIVITY-LOG.",
      },
      {
        id: "ops",
        skillId: "promote-ops",
        label: "promote-ops",
        job: "Deploy only — blocked until EM GO.",
      },
    ],
  },
  {
    id: "promote-q2-proddeck",
    title: "Promote Q2 · ProdDeck",
    env: "prod",
    goal: "Qualify PREPROD→PROD — evidence under H:\\releases\\proddeck-*\\evidence\\q2\\",
    linkedApp: "proddeck",
    packId: "promote-q2",
    lanes: [
      {
        id: "em",
        skillId: "promote-em",
        label: "promote-em",
        job: "Orchestrate checklist; only lane that may set GO/HOLD.",
      },
      {
        id: "qa",
        skillId: "promote-qa",
        label: "promote-qa",
        job: "Smoke matrix + destination smoke notes.",
      },
      {
        id: "security",
        skillId: "promote-security",
        label: "promote-security",
        job: "CSS / JWT / secrets scan notes.",
      },
      {
        id: "review",
        skillId: "promote-review",
        label: "promote-review",
        job: "Ports, DB, drive, diff compliance.",
      },
      {
        id: "field-ops",
        skillId: "promote-field-ops",
        label: "promote-field-ops",
        job: "Bind race, CF cache, PS traps, serial ACTIVITY-LOG.",
      },
      {
        id: "ops",
        skillId: "promote-ops",
        label: "promote-ops",
        job: "Deploy only — blocked until EM GO.",
      },
    ],
  },
  {
    id: "quay-bugfix",
    title: "Quay bugfix · pier overlay",
    env: "dev",
    goal: "Fix mobile pier tap target overlap on Realme 360×800 without scene regressions.",
    linkedApp: "proddeck",
    packId: "feature-ship",
    lanes: [
      {
        id: "lead",
        skillId: "crew-lead",
        label: "Crew lead",
        job: "Merge order + serial ACTIVITY-LOG.",
      },
      {
        id: "scene",
        skillId: "implementer",
        label: "Scene lane",
        job: "Own src/scene/keepers-quay/** only.",
      },
      {
        id: "shell",
        skillId: "implementer",
        label: "Shell lane",
        job: "Own DeckHome / Places chrome only.",
      },
      {
        id: "docs",
        skillId: "docs-keeper",
        label: "docs-keeper",
        job: "WORLD / OPS / MOBILE-QA in same turn.",
      },
      {
        id: "qa",
        skillId: "qa",
        label: "QA",
        job: "360×800 smoke + reduced-motion check.",
      },
    ],
  },
  {
    id: "cloud-os-wave1",
    title: "Cloud OS Wave 1 · parallel lanes",
    env: "dev",
    goal: "Ship Wave 1 OS modules (Pulse, Ports, Yard, Identity) via disjoint worktrees.",
    linkedApp: "proddeck",
    packId: "feature-ship",
    lanes: [
      {
        id: "lead",
        skillId: "crew-lead",
        label: "Wave lead",
        job: "Integrate branch + port registry sync.",
      },
      {
        id: "pulse",
        skillId: "implementer",
        label: "Pulse lane",
        job: "Own src/os/modules/pulse/** + /api/os/pulse.",
      },
      {
        id: "ports",
        skillId: "implementer",
        label: "Ports lane",
        job: "Own src/os/modules/ports/** + registry read.",
      },
      {
        id: "yard",
        skillId: "implementer",
        label: "Yard lane",
        job: "Own src/os/modules/yard/** — Crew Fabric board.",
      },
      {
        id: "identity",
        skillId: "implementer",
        label: "Identity lane",
        job: "Own src/os/modules/identity/** + CSS strip.",
      },
      {
        id: "docs",
        skillId: "docs-keeper",
        label: "docs-keeper",
        job: "docs/os/*.md per module + CLOUD-OS-ROADMAP checklist.",
      },
    ],
  },
];

export function initialLaneState(template: MissionTemplate): Record<string, LaneStatus> {
  return Object.fromEntries(template.lanes.map((lane) => [lane.id, "idle" as const]));
}
