"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

function decodeBriefParam(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const b64 = raw.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
    const binary = atob(b64 + pad);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

type InboundParams = {
  src: string;
  intent: string | null;
  brief: string | null;
  env: string | null;
  returnUrl: string | null;
};

export function DispatchView() {
  const [target, setTarget] = useState<DispatchTargetApp>("agentverse");
  const [missionTitle, setMissionTitle] = useState("");
  const [returnUrl, setReturnUrl] = useState(() => defaultReturnUrl());
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [inbound, setInbound] = useState<InboundParams | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = new URLSearchParams(window.location.search);
    const src = q.get("src");
    if (!src) return;
    setInbound({
      src,
      intent: q.get("intent"),
      brief: decodeBriefParam(q.get("brief")),
      env: q.get("env"),
      returnUrl: q.get("return"),
    });
  }, []);

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
          AgentVerse Desk landing is deferred; see{" "}
          <code className="text-[var(--pd-lime)]">docs/os/av-deeplink-contract.md</code>.
        </p>
      </header>

      {inbound ? (
        <aside
          className="rounded-lg border border-[var(--pd-lime)]/35 bg-[var(--pd-lime)]/10 p-4 backdrop-blur-md"
          aria-label="Inbound dispatch params"
          role="status"
        >
          <p className="m-0 text-sm font-semibold text-[var(--pd-lime)]">
            Params received
          </p>
          <p className="mt-1 m-0 text-sm text-[var(--pd-mist)]">
            Deep-link from <span className="font-mono text-[var(--pd-paper)]">{inbound.src}</span>
            {inbound.intent ? (
              <>
                {" "}
                · intent{" "}
                <span className="font-mono text-[var(--pd-paper)]">{inbound.intent}</span>
              </>
            ) : null}
            {inbound.env ? (
              <>
                {" "}
                · env <span className="font-mono text-[var(--pd-paper)]">{inbound.env}</span>
              </>
            ) : null}
          </p>
          {inbound.brief ? (
            <p className="mt-2 m-0 text-sm text-[var(--pd-paper)]">{inbound.brief}</p>
          ) : (
            <p className="mt-2 m-0 text-xs text-[var(--pd-mist)]">No brief payload (or decode failed).</p>
          )}
          {inbound.returnUrl ? (
            <a
              href={inbound.returnUrl}
              className="mt-3 inline-flex min-h-11 items-center text-sm text-[var(--pd-lime)] underline"
            >
              Return
            </a>
          ) : null}
        </aside>
      ) : null}

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
