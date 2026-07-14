"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { buildDispatchUrl } from "./build-url";
import {
  AGENTVERSE_UPGRADE_HOSTS,
  DISPATCH_CREW,
  DISPATCH_CREW_LABELS,
  defaultReturnUrl,
  resolveFleetFromHostname,
  type DispatchCrewId,
  type DispatchFleet,
  type DispatchIntent,
} from "./config";

const fieldClass =
  "min-h-[44px] w-full rounded-lg border border-white/15 bg-black/45 px-3 py-2 text-sm text-[var(--pd-paper)] outline-none transition focus:border-[var(--pd-lime)]";

const actionClass =
  "min-h-[44px] min-w-[44px] flex-1 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-[var(--pd-paper)] transition hover:border-[var(--pd-lime)] hover:text-[var(--pd-lime)] disabled:cursor-not-allowed disabled:opacity-50";

const primaryActionClass =
  "min-h-[44px] min-w-[44px] flex-[1.4] rounded-lg border border-[var(--pd-lime)]/40 bg-[var(--pd-lime)]/15 px-4 py-2 text-sm font-semibold text-[var(--pd-lime)] transition hover:bg-[var(--pd-lime)]/25 disabled:cursor-not-allowed disabled:opacity-50";

const chipClass =
  "min-h-[44px] min-w-[44px] rounded-lg border px-3 py-2 text-sm font-semibold transition";

/** Legacy base64url → UTF-8 (old Dispatch emit). */
function tryDecodeBase64UrlBrief(raw: string): string | null {
  try {
    const b64 = raw.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
    const binary = atob(b64 + pad);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const decoded = new TextDecoder().decode(bytes).trim();
    if (!decoded || decoded.includes("\uFFFD")) return null;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Prefer plain URI text (`URLSearchParams.get` already percent-decodes).
 * Optionally accept leftover base64url briefs from older Dispatch links.
 */
function decodeBriefParam(raw: string | null): string | null {
  if (!raw) return null;
  const text = raw.trim();
  if (!text) return null;
  if (/[^A-Za-z0-9\-_]/.test(text)) return text;
  const legacy = tryDecodeBase64UrlBrief(text);
  return legacy ?? text;
}

type InboundParams = {
  src: string;
  intent: string | null;
  brief: string | null;
  env: string | null;
  crew: string | null;
  returnUrl: string | null;
};

/**
 * Forge → Dispatch: hire crew on AgentVerse upgrade fleet.
 * Default hosts: agentverse-upgrade(-staging).delena.buzz — not classic agentverse.delena.buzz.
 */
export function DispatchView() {
  const [fleet, setFleet] = useState<DispatchFleet>("prod");
  const [crew, setCrew] = useState<DispatchCrewId>("rajesh");
  const [intent, setIntent] = useState<DispatchIntent>("session-desk");
  const [brief, setBrief] = useState("");
  const [skills, setSkills] = useState("");
  const [returnUrl, setReturnUrl] = useState(() => defaultReturnUrl());
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [inbound, setInbound] = useState<InboundParams | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setFleet(resolveFleetFromHostname());
    setReturnUrl(defaultReturnUrl());

    const q = new URLSearchParams(window.location.search);
    const src = q.get("src");
    if (!src) return;

    const inboundBrief = decodeBriefParam(q.get("brief"));
    const inboundCrew = q.get("crew");
    const inboundIntent = q.get("intent");

    setInbound({
      src,
      intent: inboundIntent,
      brief: inboundBrief,
      env: q.get("env"),
      crew: inboundCrew,
      returnUrl: q.get("return"),
    });

    if (inboundBrief) setBrief(inboundBrief);
    if (inboundCrew && (DISPATCH_CREW as readonly string[]).includes(inboundCrew)) {
      setCrew(inboundCrew as DispatchCrewId);
    }
    if (inboundIntent === "session-desk" || inboundIntent === "hire") {
      setIntent(inboundIntent);
    }
  }, []);

  const builtUrl = useMemo(
    () =>
      buildDispatchUrl({
        fleet,
        crew,
        intent,
        brief,
        returnUrl,
        skills,
      }),
    [fleet, crew, intent, brief, returnUrl, skills],
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
    window.location.assign(builtUrl);
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
          Open AgentVerse Desk with crew + brief. Default fleet is{" "}
          <span className="font-mono text-[var(--pd-paper)]">upgrade</span> — not classic{" "}
          <span className="font-mono text-[var(--pd-paper)]">agentverse.delena.buzz</span>.
        </p>
      </header>

      {inbound ? (
        <aside
          className="rounded-lg border border-white/10 bg-black/55 p-4 backdrop-blur-md"
          aria-label="Inbound dispatch params"
          role="status"
        >
          <p className="m-0 text-sm font-semibold text-[var(--pd-lime)]">Params received</p>
          <p className="mt-1 m-0 text-sm text-[var(--pd-mist)]">
            Deep-link from <span className="font-mono text-[var(--pd-paper)]">{inbound.src}</span>
            {inbound.crew ? (
              <>
                {" "}
                · crew <span className="font-mono text-[var(--pd-paper)]">{inbound.crew}</span>
              </>
            ) : null}
            {inbound.intent ? (
              <>
                {" "}
                · intent <span className="font-mono text-[var(--pd-paper)]">{inbound.intent}</span>
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
        className="flex flex-col gap-4 rounded-lg border border-white/10 bg-black/55 p-4 backdrop-blur-md"
        onSubmit={(event) => {
          event.preventDefault();
          handleOpen();
        }}
      >
        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-2 text-sm text-[var(--pd-mist)]">Crew</legend>
          <div className="flex flex-wrap gap-2" role="listbox" aria-label="Crew picker">
            {DISPATCH_CREW.map((id) => {
              const selected = crew === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={chipClass}
                  style={{
                    borderColor: selected ? "var(--pd-lime)" : "rgba(255,255,255,0.15)",
                    color: selected ? "var(--pd-lime)" : "var(--pd-paper)",
                    background: selected ? "rgba(190, 242, 100, 0.12)" : "rgba(0,0,0,0.35)",
                  }}
                  onClick={() => setCrew(id)}
                >
                  {DISPATCH_CREW_LABELS[id]}
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="flex flex-col gap-1.5 text-sm text-[var(--pd-mist)]">
          Brief
          <textarea
            className={`${fieldClass} min-h-[96px] resize-y`}
            value={brief}
            onChange={(event) => setBrief(event.target.value)}
            placeholder="Incident or hire context for Session Desk…"
            aria-label="Brief"
            rows={3}
          />
        </label>

        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-2 text-sm text-[var(--pd-mist)]">Intent</legend>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["session-desk", "Session desk"],
                ["hire", "Hire"],
              ] as const
            ).map(([value, label]) => {
              const selected = intent === value;
              return (
                <button
                  key={value}
                  type="button"
                  className={chipClass}
                  aria-pressed={selected}
                  style={{
                    borderColor: selected ? "var(--pd-lime)" : "rgba(255,255,255,0.15)",
                    color: selected ? "var(--pd-lime)" : "var(--pd-paper)",
                    background: selected ? "rgba(190, 242, 100, 0.12)" : "rgba(0,0,0,0.35)",
                  }}
                  onClick={() => setIntent(value)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-2 text-sm text-[var(--pd-mist)]">AgentVerse fleet</legend>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["staging", "Staging"],
                ["prod", "Prod"],
              ] as const
            ).map(([value, label]) => {
              const selected = fleet === value;
              return (
                <button
                  key={value}
                  type="button"
                  className={chipClass}
                  aria-pressed={selected}
                  style={{
                    borderColor: selected ? "var(--pd-lime)" : "rgba(255,255,255,0.15)",
                    color: selected ? "var(--pd-lime)" : "var(--pd-paper)",
                    background: selected ? "rgba(190, 242, 100, 0.12)" : "rgba(0,0,0,0.35)",
                  }}
                  onClick={() => setFleet(value)}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <p className="mt-2 m-0 break-all font-mono text-xs text-[var(--pd-mist)]">
            {AGENTVERSE_UPGRADE_HOSTS[fleet]}
          </p>
        </fieldset>

        <label className="flex flex-col gap-1.5 text-sm text-[var(--pd-mist)]">
          Skills <span className="text-xs opacity-70">(optional, comma-separated)</span>
          <input
            className={fieldClass}
            type="text"
            value={skills}
            onChange={(event) => setSkills(event.target.value)}
            placeholder="e.g. promote-em,ports"
            aria-label="Skills"
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
        <p className="m-0 text-xs uppercase tracking-wide text-[var(--pd-mist)]">Built link</p>
        <p
          className="mt-2 m-0 break-all font-mono text-xs leading-relaxed text-[var(--pd-paper)]"
          aria-live="polite"
        >
          {builtUrl ?? (
            <span className="text-[var(--pd-mist)]">Enter a brief to build a Desk link.</span>
          )}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className={primaryActionClass}
          disabled={!canAct}
          onClick={handleOpen}
        >
          Open Desk
        </button>
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
      </div>
    </section>
  );
}
