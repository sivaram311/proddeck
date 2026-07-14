"use client";

import { useEffect, useState } from "react";
import type { OsEnv } from "../../types";
import {
  openCssReAuth,
  probeCssSessionFresh,
  useCssSessionFresh,
} from "../identity/cssSessionFresh";
import { expectedConfirmPhrase, isDestructiveEnv, requireEnvConfirm } from "./confirm";

const ENVS: OsEnv[] = ["dev", "preprod", "prod", "releases"];

export function DriveGuardView() {
  const [env, setEnv] = useState<OsEnv>("dev");
  const [typed, setTyped] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { fresh, ready: sessionReady, subject, refresh: refreshSession } = useCssSessionFresh();

  useEffect(() => {
    if (isDestructiveEnv(env)) refreshSession();
  }, [env, refreshSession]);

  async function tryAction() {
    setBusy(true);
    try {
      let cssFresh = true;
      if (isDestructiveEnv(env)) {
        const probe = await probeCssSessionFresh();
        cssFresh = probe.fresh;
        if (!probe.fresh) refreshSession();
      }
      const err = requireEnvConfirm(env, typed, "sample guarded action", cssFresh);
      setMsg(err ?? `OK — ${env} gate passed (no IO performed).`);
    } finally {
      setBusy(false);
    }
  }

  const canTest =
    !busy &&
    (!isDestructiveEnv(env) || (sessionReady && fresh && typed.trim() === expectedConfirmPhrase(env)));

  return (
    <section className="flex flex-col gap-4" aria-label="Drive Guard">
      <header>
        <p className="m-0 text-base text-[var(--pd-lime)]" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
          Drive Guard
        </p>
        <p className="mt-1 m-0 text-sm text-[var(--pd-mist)]">
          Env chip roles · typed confirm + CSS freshness for PROD / RELEASES. Never partitions or mass-delete.
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
            Destructive env — type <code>{expectedConfirmPhrase(env)}</code> and keep a fresh CSS
            session to unlock sample action.
          </p>
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            className="mt-3 min-h-11 w-full rounded-md border border-white/15 bg-black/45 px-3 text-sm"
          />
          <div
            className="mt-3 rounded-md border border-white/10 bg-black/35 px-3 py-2 text-xs text-[var(--pd-mist)]"
            role="status"
          >
            {!sessionReady ? (
              <span>Checking CSS session…</span>
            ) : fresh ? (
              <span>
                CSS session <span className="text-[var(--pd-lime)]">fresh</span>
                {subject ? (
                  <>
                    {" "}
                    · <span className="font-mono text-[var(--pd-paper)]">{subject}</span>
                  </>
                ) : null}
              </span>
            ) : (
              <span className="flex min-h-11 flex-wrap items-center gap-2">
                <span>
                  CSS session <span className="text-[var(--pd-danger)]">not fresh</span> — re-auth
                  required before unlock
                </span>
                <button
                  type="button"
                  onClick={() => openCssReAuth()}
                  className="min-h-11 touch-manipulation rounded-md border border-white/20 bg-black/45 px-3 text-sm text-[var(--pd-paper)]"
                >
                  Re-auth
                </button>
                <button
                  type="button"
                  onClick={() => refreshSession()}
                  className="min-h-11 touch-manipulation rounded-md border border-white/15 bg-transparent px-3 text-sm text-[var(--pd-mist)]"
                >
                  Recheck
                </button>
              </span>
            )}
          </div>
        </div>
      ) : (
        <p className="m-0 text-sm text-[var(--pd-mist)]">DEV / PREPROD — soft warn only in chip.</p>
      )}
      <button
        type="button"
        onClick={() => void tryAction()}
        disabled={!canTest}
        title={
          isDestructiveEnv(env)
            ? !sessionReady
              ? "Checking CSS session…"
              : !fresh
                ? "CSS session must be fresh before unlock"
                : typed.trim() !== expectedConfirmPhrase(env)
                  ? `Type ${expectedConfirmPhrase(env)} to confirm`
                  : "Test gate"
            : "Test gate"
        }
        className="min-h-11 rounded-md border border-white/15 text-sm disabled:opacity-50"
      >
        Test gate
      </button>
      {msg ? <p className="m-0 text-sm text-[var(--pd-paper)]">{msg}</p> : null}
    </section>
  );
}
