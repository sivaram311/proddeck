import type { SkillPack } from "./types";

/** Presets aligned with CLOUD-OS-ROADMAP §8.5 and MyAgent promote skills. */
export const SKILL_PACKS: SkillPack[] = [
  {
    id: "promote-q1",
    label: "Promote Q1",
    blurb: "DEV→PREPROD gate — parallel specialists; ops blocked until EM GO.",
    skills: [
      "promote-em",
      "promote-qa",
      "promote-security",
      "promote-review",
      "promote-field-ops",
      "promote-ops",
    ],
  },
  {
    id: "promote-q2",
    label: "Promote Q2",
    blurb: "PREPROD→PROD gate — same crew; field-ops mandatory.",
    skills: [
      "promote-em",
      "promote-qa",
      "promote-security",
      "promote-review",
      "promote-field-ops",
      "promote-ops",
    ],
  },
  {
    id: "feature-ship",
    label: "Feature ship",
    blurb: "Product code — crew lead, implementer lanes, docs-keeper, QA.",
    skills: [
      "crew-lead",
      "architect",
      "implementer",
      "docs-keeper",
      "qa",
      "validation-gatekeeper",
    ],
  },
  {
    id: "incident",
    label: "Incident",
    blurb: "Pulse + ports/beacon read; ops proposes only until confirm.",
    skills: ["pulse-reader", "ports-beacon", "security", "ops-propose", "dispatch"],
  },
  {
    id: "docs-only",
    label: "Docs only",
    blurb: "Fastest safe parallel ship when code is frozen.",
    skills: ["docs-keeper", "promote-review"],
  },
];

export const PROMOTE_SKILL_IDS = [
  "promote-em",
  "promote-qa",
  "promote-security",
  "promote-review",
  "promote-ops",
  "promote-field-ops",
] as const;

export const PROMOTE_SKILL_LABEL: Record<(typeof PROMOTE_SKILL_IDS)[number], string> = {
  "promote-em": "EM — orchestrate; only GO/HOLD decision",
  "promote-qa": "QA — smoke matrix + destination notes",
  "promote-security": "Security — CSS / JWT / secrets scan",
  "promote-review": "Review — ports, DB, drive, diff compliance",
  "promote-ops": "Ops — deploy after EM GO only",
  "promote-field-ops": "Field ops — bind race, CF cache, serial log",
};
