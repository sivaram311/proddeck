import type { OsEnv } from "../../types";

/** Manual lane status for Wave 1 — live runners land in Wave 2+. */
export type LaneStatus = "idle" | "running" | "done" | "blocked";

export type SkillPackId =
  | "promote-q1"
  | "promote-q2"
  | "feature-ship"
  | "incident"
  | "docs-only";

export type SkillPack = {
  id: SkillPackId;
  label: string;
  blurb: string;
  /** Skill ids mirrored from MyAgent promote skills + docs-keeper pattern. */
  skills: string[];
};

/** Read-only catalog row — skill, persona, or pack id (no spawn from registry). */
export type SkillRegistryKind = "promote" | "persona" | "pack" | "lane";

export type SkillRegistryEntry = {
  id: string;
  kind: SkillRegistryKind;
  label: string;
  blurb: string;
  /** Path note pointing at MyAgent workflow or machine-docs personas. */
  pathNote: string;
};

export type MissionLane = {
  id: string;
  skillId: string;
  label: string;
  job: string;
};

export type MissionTemplate = {
  id: string;
  title: string;
  env: OsEnv;
  goal: string;
  linkedApp: string;
  packId: SkillPackId;
  lanes: MissionLane[];
};

export type LaneState = Record<string, LaneStatus>;

export const LANE_STATUS_ORDER: LaneStatus[] = ["idle", "running", "done", "blocked"];

export const LANE_STATUS_LABEL: Record<LaneStatus, string> = {
  idle: "Idle",
  running: "Running",
  done: "Done",
  blocked: "Blocked",
};
