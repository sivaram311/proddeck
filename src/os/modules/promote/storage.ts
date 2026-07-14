import type { GateChecklist, PromoteDecision, PromoteGate } from "./types";
import { DEFAULT_EVIDENCE_PATH } from "./types";

const CHECKLIST_PREFIX = "proddeck.promote.checklist.";
const DECISIONS_KEY = "proddeck.promote.decisions";

function defaultChecklist(gate: PromoteGate): GateChecklist {
  return {
    smoke: false,
    securityNotes: false,
    review: false,
    fieldOpsTip: false,
    evidencePath: DEFAULT_EVIDENCE_PATH[gate],
  };
}

export function loadChecklist(gate: PromoteGate): GateChecklist {
  if (typeof window === "undefined") return defaultChecklist(gate);
  try {
    const raw = localStorage.getItem(`${CHECKLIST_PREFIX}${gate}`);
    if (!raw) return defaultChecklist(gate);
    const parsed = JSON.parse(raw) as Partial<GateChecklist>;
    return { ...defaultChecklist(gate), ...parsed };
  } catch {
    return defaultChecklist(gate);
  }
}

export function saveChecklist(gate: PromoteGate, checklist: GateChecklist): void {
  localStorage.setItem(`${CHECKLIST_PREFIX}${gate}`, JSON.stringify(checklist));
}

export function loadDecisions(): PromoteDecision[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DECISIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PromoteDecision[];
  } catch {
    return [];
  }
}

export function appendDecision(decision: PromoteDecision): PromoteDecision[] {
  const next = [...loadDecisions(), decision];
  localStorage.setItem(DECISIONS_KEY, JSON.stringify(next));
  return next;
}
