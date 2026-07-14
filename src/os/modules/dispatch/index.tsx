"use client";

import { useCallback, useMemo, useState } from "react";
import { buildDispatchUrl } from "./build-url";
import {
  DISPATCH_TARGET_LABELS,
  defaultReturnUrl,
  type DispatchTargetApp,
} from "./config";

const TARGETS: DispatchTargetApp[] = ["agentverse", "proddeck", "portal"];

const fieldClass =
  "min-h-[44px] w-full rounded-lg border border-white/15 bg-black/45 px-3 py-2 text-sm text-[var(--pd-paper)] outline-none transition focus:border-[var(--pd-lime)]";

const actionClass =
  "min-h-[44px] min-w-[44px] flex-1 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-[var(--pd-paper)] transition hover:border-[var(--pd-lime)] hover:text-[var(--pd-lime)] disabled:cursor-not-allowed disabled:opacity-50";

export function DispatchView() {
  const [target, setTarget] = useState<DispatchTargetApp>("agentverse");
  const [missionTitle, setMissionTitle] = useState("");
  const [returnUrl, setReturnUrl] = useState(() => defaultReturnUrl());
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  const builtUrl = useMemo(
    () =>
      buildDispatchUrl({
        target,
        missionTitle,
        returnUrl,
      }),
    [target, missionTitle, returnUrl],
  );

  const canAct = Boolean(builtUrl);

  const handleCopy = useCallback(async () => {
    if (!builtUrl) return;
    try {
      await navigator.clipboard.writeText(builtUrl);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("failed");
      window.setTimeout(() => setCopyState("idle"), 2500);
    }
  }, [builtUrl]);

  const handleOpen = useCallback(() => {
    if (!builtUrl) return;
    window.open(builtUrl, "_blank", "noopener,noreferrer");
  }, [builtUrl]);

  return (
    <section className="flex flex-col gap-4" aria-label="Dispatch">
      <header>
        <p
          className="m-0 text-base text-[var(--pd-lime)]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
        >
          Dispatch
        </p>
        <p className="mt-1 m-0 text-sm text-[var(--pd-mist)]">
          Build Session Desk deep-links — hire crew with mission context and a return URL.
        </p>
      </header>

      <form
        className="flex flex-col gap-3 rounded-lg border border-white/10 bg-black/55 p-4 backdrop-blur-md"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="flex flex-col gap-1.5 text-sm text-[var(--pd-mist)]">
          Target app
          <select
            className={fieldClass}
            value={target}
            onChange={(event) => setTarget(event.target.value as DispatchTargetApp)}
            aria-label="Target app"
          >
            {TARGETS.map((app) => (
              <option key={app} value={app}>
                {DISPATCH_TARGET_LABELS[app]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-[var(--pd-mist)]">
          Mission title
          <input
            className={fieldClass}
            type="text"
            value={missionTitle}
            onChange={(event) => setMissionTitle(event.target.value)}
            placeholder="e.g. Promote Q1 evidence review"
            aria-label="Mission title"
            autoComplete="off"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-[var(--pd-mist)]">
          Return URL
          <input
            className={fieldClass}
            type="url"
            value={returnUrl}
            onChange={(event) => setReturnUrl(event.target.value)}
            placeholder="https://home.delena.buzz"
            aria-label="Return URL"
            autoComplete="off"
          />
        </label>
      </form>

      <div className="rounded-lg border border-white/10 bg-black/55 p-4 backdrop-blur-md">
        <p className="m-0 text-xs uppercase tracking-wide text-[var(--pd-mist)]">
          Built link
        </p>
        <p
          className="mt-2 m-0 break-all font-mono text-xs leading-relaxed text-[var(--pd-paper)]"
          aria-live="polite"
        >
          {builtUrl ?? (
            <span className="text-[var(--pd-mist)]">Enter a mission title to build a link.</span>
          )}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className={actionClass}
          disabled={!canAct}
          onClick={() => void handleCopy()}
        >
          {copyState === "copied"
            ? "Copied!"
            : copyState === "failed"
              ? "Copy failed"
              : "Copy link"}
        </button>
        <button
          type="button"
          className={actionClass}
          disabled={!canAct}
          onClick={handleOpen}
        >
          Open
        </button>
      </div>
    </section>
  );
}
