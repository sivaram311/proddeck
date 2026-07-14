"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CHECKLIST_LABELS,
  EVIDENCE_PATH_RE,
  type GateChecklist,
  type PromoteDecision,
  type PromoteGate,
} from "./types";
import { appendDecision, loadChecklist, loadDecisions, saveChecklist } from "./storage";

const ACTOR_STUB = "em-stub";

type Props = {
  gate: PromoteGate;
  subtitle: string;
};

export function GateChecklist({ gate, subtitle }: Props) {
  const [checklist, setChecklist] = useState<GateChecklist>(() => loadChecklist(gate));
  const [note, setNote] = useState("");
  const [decisions, setDecisions] = useState<PromoteDecision[]>(() => loadDecisions());
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setChecklist(loadChecklist(gate));
    setDecisions(loadDecisions());
    setNote("");
  }, [gate]);

  const evidenceOk = useMemo(
    () => EVIDENCE_PATH_RE.test(checklist.evidencePath.trim()),
    [checklist.evidencePath],
  );

  const checklistComplete = useMemo(
    () =>
      checklist.smoke &&
      checklist.securityNotes &&
      checklist.review &&
      checklist.fieldOpsTip &&
      evidenceOk,
    [checklist, evidenceOk],
  );

  const lastDecision = useMemo(
    () => [...decisions].reverse().find((d) => d.gate === gate),
    [decisions, gate],
  );

  const patchChecklist = useCallback(
    (patch: Partial<GateChecklist>) => {
      setChecklist((prev) => {
        const next = { ...prev, ...patch };
        saveChecklist(gate, next);
        return next;
      });
      setSavedFlash(true);
      window.setTimeout(() => setSavedFlash(false), 1200);
    },
    [gate],
  );

  const recordDecision = useCallback(
    (decision: "GO" | "HOLD") => {
      const entry: PromoteDecision = {
        gate,
        decision,
        at: new Date().toISOString(),
        actor: ACTOR_STUB,
        note: note.trim(),
      };
      const next = appendDecision(entry);
      setDecisions(next);
      setNote("");
    },
    [gate, note],
  );

  return (
    <div className="space-y-3">
      <p className="m-0 text-xs text-[var(--pd-mist)]">{subtitle}</p>

      <ul className="m-0 list-none space-y-2 p-0">
        {(Object.keys(CHECKLIST_LABELS) as Array<keyof typeof CHECKLIST_LABELS>).map((key) => (
          <li key={key}>
            <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-white/10 bg-black/35 px-3 text-sm text-[var(--pd-paper)]">
              <input
                type="checkbox"
                className="size-5 shrink-0 accent-[var(--pd-lime)]"
                checked={checklist[key]}
                onChange={(e) => patchChecklist({ [key]: e.target.checked })}
              />
              <span>{CHECKLIST_LABELS[key]}</span>
            </label>
          </li>
        ))}
        <li>
          <label className="grid gap-1.5 text-sm text-[var(--pd-mist)]">
            <span className="flex min-h-11 items-center gap-2">
              <span
                className={`inline-block size-2.5 rounded-full ${evidenceOk ? "bg-[var(--pd-lime)]" : "bg-[var(--pd-danger)]"}`}
                aria-hidden
              />
              Evidence path <code className="text-[var(--pd-lime)]">H:\releases\proddeck-*</code>
            </span>
            <input
              type="text"
              value={checklist.evidencePath}
              onChange={(e) => patchChecklist({ evidencePath: e.target.value })}
              spellCheck={false}
              className="min-h-11 rounded-md border border-white/10 bg-[var(--pd-steel)] px-3 font-mono text-xs text-[var(--pd-paper)] outline-none focus:border-[var(--pd-lime)]"
              aria-invalid={!evidenceOk}
            />
          </label>
          {!evidenceOk ? (
            <p className="mt-1 m-0 text-xs text-[var(--pd-danger)]" role="status">
              Path must start with <code>H:\releases\proddeck-</code>
            </p>
          ) : null}
        </li>
      </ul>

      <label className="grid gap-1.5 text-sm text-[var(--pd-mist)]">
        Decision note (optional)
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="min-h-11 resize-y rounded-md border border-white/10 bg-[var(--pd-steel)] px-3 py-2 text-sm text-[var(--pd-paper)] outline-none focus:border-[var(--pd-lime)]"
          placeholder="Evidence refs, blockers, or HOLD reason"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => recordDecision("GO")}
          className="min-h-11 min-w-[5.5rem] rounded-md bg-[var(--pd-lime)] px-4 text-sm font-semibold text-[var(--pd-ink)] disabled:opacity-50"
          disabled={!checklistComplete}
          title={checklistComplete ? "Record GO decision" : "Complete checklist first"}
        >
          GO
        </button>
        <button
          type="button"
          onClick={() => recordDecision("HOLD")}
          className="min-h-11 min-w-[5.5rem] rounded-md border border-white/20 bg-black/45 px-4 text-sm font-semibold text-[var(--pd-paper)]"
        >
          HOLD
        </button>
      </div>

      {savedFlash ? (
        <p className="m-0 text-xs text-[var(--pd-lime)]" role="status">
          Checklist saved locally
        </p>
      ) : null}

      {lastDecision ? (
        <p className="m-0 rounded-md border border-white/10 bg-black/35 p-3 font-mono text-xs text-[var(--pd-mist)]">
          Last {gate}:{" "}
          <span
            className={
              lastDecision.decision === "GO" ? "text-[var(--pd-lime)]" : "text-[var(--pd-danger)]"
            }
          >
            {lastDecision.decision}
          </span>{" "}
          · {lastDecision.at} · {lastDecision.actor}
          {lastDecision.note ? ` · ${lastDecision.note}` : ""}
        </p>
      ) : (
        <p className="m-0 text-xs text-[var(--pd-mist)]">No {gate} decision recorded yet.</p>
      )}
    </div>
  );
}
