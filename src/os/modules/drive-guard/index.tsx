"use client";

import { useState } from "react";
import type { OsEnv } from "../../types";
import { expectedConfirmPhrase, isDestructiveEnv, requireEnvConfirm } from "./confirm";

const ENVS: OsEnv[] = ["dev", "preprod", "prod", "releases"];

export function DriveGuardView() {
  const [env, setEnv] = useState<OsEnv>("dev");
  const [typed, setTyped] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  function tryAction() {
    const err = requireEnvConfirm(env, typed, "sample guarded action");
    setMsg(err ?? `OK — ${env} gate passed (no IO performed).`);
  }

  return (
    <section className="flex flex-col gap-4" aria-label="Drive Guard">
      <header>
        <p className="m-0 text-base text-[var(--pd-lime)]" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
          Drive Guard
        </p>
        <p className="mt-1 m-0 text-sm text-[var(--pd-mist)]">
          Env chip roles · typed confirm for PROD / RELEASES. Never partitions or mass-delete.
        </p>
      </header>
      <div className="flex flex-wrap gap-2">
        {ENVS.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => {
              setEnv(e);
              setTyped("");
              setMsg(null);
            }}
            className={`min-h-11 rounded-md px-3 text-sm ${
              env === e ? "bg-[var(--pd-lime)] font-semibold text-[var(--pd-ink)]" : "border border-white/15 text-[var(--pd-mist)]"
            }`}
          >
            {e.toUpperCase()}
          </button>
        ))}
      </div>
      {isDestructiveEnv(env) ? (
        <div className="rounded-lg border border-[var(--pd-danger)]/40 bg-black/50 p-4">
          <p className="m-0 text-sm text-[var(--pd-danger)]">
            Destructive env — type <code>{expectedConfirmPhrase(env)}</code> to unlock sample action.
          </p>
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            className="mt-3 min-h-11 w-full rounded-md border border-white/15 bg-black/45 px-3 text-sm"
          />
        </div>
      ) : (
        <p className="m-0 text-sm text-[var(--pd-mist)]">DEV / PREPROD — soft warn only in chip.</p>
      )}
      <button type="button" onClick={tryAction} className="min-h-11 rounded-md border border-white/15 text-sm">
        Test gate
      </button>
      {msg ? <p className="m-0 text-sm text-[var(--pd-paper)]">{msg}</p> : null}
    </section>
  );
}
