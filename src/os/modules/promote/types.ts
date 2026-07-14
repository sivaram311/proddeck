export type PromoteGate = "Q1" | "Q2";

export type GateChecklist = {
  smoke: boolean;
  securityNotes: boolean;
  review: boolean;
  fieldOpsTip: boolean;
  evidencePath: string;
};

export type PromoteDecision = {
  gate: PromoteGate;
  decision: "GO" | "HOLD";
  at: string;
  actor: string;
  note: string;
};

export const CHECKLIST_LABELS: Record<keyof Omit<GateChecklist, "evidencePath">, string> = {
  smoke: "Smoke matrix complete",
  securityNotes: "Security notes filed",
  review: "Review / compliance pass",
  fieldOpsTip: "Field-ops tip acknowledged (hire promote-field-ops)",
};

export const DEFAULT_EVIDENCE_PATH: Record<PromoteGate, string> = {
  Q1: "H:\\releases\\proddeck-0.4.0\\evidence\\q1\\",
  Q2: "H:\\releases\\proddeck-0.4.0\\evidence\\q2\\",
};

/** Must match H:\releases\proddeck-* per promote gate. */
export const EVIDENCE_PATH_RE = /^H:\\releases\\proddeck-[^\\]+/i;
