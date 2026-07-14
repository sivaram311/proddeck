"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchArchiveReleases, fetchEnvVersionPins } from "./actions";
import type { ArchiveListResult, ArchiveReleaseEntry, EnvVersionPin } from "./types";

const HDRIVE_HOME = "https://hdrive.delena.buzz/releases/";

function CopyPathButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }, [value]);

  return (
    <button
      type="button"
      onClick={() => void copy()}
      className="min-h-11 rounded-md border border-white/15 bg-black/35 px-3 text-sm text-[var(--pd-mist)] backdrop-blur-sm"
      aria-label={`${label}: ${value}`}
    >
      {copied ? "Copied" : label}
    </button>
  );
}

function VersionPinStrip({ pins }: { pins: EnvVersionPin[] }) {
  return (
    <div
      className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md border border-white/10 bg-black/35 px-3 py-2"
      aria-label="Live PREPROD and PROD VERSION pins"
    >
      {pins.map((pin, i) => {
        const display = pin.version ?? "unpinned / unavailable";
        return (
          <span key={pin.path} className="inline-flex min-h-11 flex-wrap items-center gap-x-2 gap-y-0.5">
            {i > 0 ? (
              <span className="text-[var(--pd-mist)]" aria-hidden>
                ·
              </span>
            ) : null}
            <span className="text-sm text-[var(--pd-paper)]">
              {pin.env} {pin.drive}{" "}
              <span className={pin.version ? "text-[var(--pd-lime)]" : "text-[var(--pd-mist)]"}>
                {display}
              </span>
            </span>
            <span className="font-mono text-[10px] text-[var(--pd-mist)]">{pin.path}</span>
          </span>
        );
      })}
    </div>
  );
}

function ReleaseCard({ release }: { release: ArchiveReleaseEntry }) {
  return (
    <article className="rounded-md border border-white/10 bg-black/40 p-3">
      <p
        className="m-0 font-mono text-sm text-[var(--pd-paper)]"
        style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
      >
        {release.name}
      </p>
      <p className="mt-1 m-0 break-all font-mono text-xs text-[var(--pd-mist)]">{release.rootPath}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={release.hdriveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center rounded-md bg-[var(--pd-lime)] px-3 text-sm font-semibold text-[var(--pd-ink)] no-underline"
        >
          Open in H-Drive (SSO)
        </a>
        <CopyPathButton value={release.rootPath} label="Copy path" />
      </div>
      {release.evidence.length > 0 ? (
        <div className="mt-3 space-y-2">
          <p className="m-0 text-xs uppercase tracking-wide text-[var(--pd-mist)]">Evidence</p>
          {release.evidence.map((ev) => (
            <div key={ev.gate} className="flex flex-wrap items-center gap-2">
              <span className="min-w-[2.5rem] font-mono text-xs uppercase text-[var(--pd-lime)]">
                {ev.gate}
              </span>
              <a
                href={ev.hdriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 flex-1 items-center rounded-md border border-white/15 px-3 font-mono text-xs text-[var(--pd-paper)] no-underline backdrop-blur-sm"
              >
                {ev.path}
              </a>
              <CopyPathButton value={ev.path} label="Copy" />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 m-0 text-xs text-[var(--pd-mist)]">No evidence\q1 or evidence\q2 folder found.</p>
      )}
    </article>
  );
}

export function ArchiveView() {
  const [result, setResult] = useState<ArchiveListResult | null>(null);
  const [pins, setPins] = useState<EnvVersionPin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [data, pinResult] = await Promise.all([fetchArchiveReleases(), fetchEnvVersionPins()]);
      if (!cancelled) {
        setResult(data);
        setPins(pinResult.pins);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      className="rounded-lg border border-white/10 bg-black/55 p-4 backdrop-blur-md"
      aria-label="Archive"
    >
      <p
        className="m-0 text-sm text-[var(--pd-lime)]"
        style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
      >
        Archive
      </p>
      <p className="mt-2 m-0 text-sm text-[var(--pd-mist)]">
        Release folders under H:\releases. Browse via{" "}
        <a
          href={HDRIVE_HOME}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--pd-paper)] underline"
        >
          H-Drive (SSO)
        </a>
        . <span className="text-[var(--pd-paper)]">Read-only</span> — no deletes from this module.
      </p>

      {!loading && pins.length > 0 ? <VersionPinStrip pins={pins} /> : null}

      {loading ? (
        <p className="mt-4 m-0 text-sm text-[var(--pd-mist)]">Scanning H:\releases…</p>
      ) : null}

      {!loading && result && !result.ok ? (
        <p className="mt-4 m-0 rounded-md border border-[var(--pd-danger)]/35 bg-[var(--pd-danger)]/10 px-3 py-3 text-sm text-[var(--pd-danger)]">
          {result.message}
        </p>
      ) : null}

      {!loading && result?.ok ? (
        <div className="mt-4 space-y-4">
          <p className="m-0 font-mono text-xs text-[var(--pd-mist)]">{result.root}</p>

          {result.proddeck.length === 0 ? (
            <p className="m-0 text-sm text-[var(--pd-mist)]">No proddeck-* release folders found.</p>
          ) : (
            <div className="space-y-3">
              <p className="m-0 text-xs uppercase tracking-wide text-[var(--pd-mist)]">
                ProdDeck releases ({result.proddeck.length})
              </p>
              {result.proddeck.map((release) => (
                <ReleaseCard key={release.name} release={release} />
              ))}
            </div>
          )}

          {result.other.length > 0 ? (
            <details className="rounded-md border border-white/10 bg-black/30 p-3">
              <summary className="flex min-h-11 cursor-pointer list-none items-center text-sm text-[var(--pd-mist)]">
                Other releases ({result.other.length})
              </summary>
              <ul className="mt-2 space-y-2 p-0">
                {result.other.map((name) => {
                  const rootPath = `${result.root}\\${name}`;
                  return (
                    <li key={name} className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-[var(--pd-paper)]">{name}</span>
                      <CopyPathButton value={rootPath} label="Copy path" />
                    </li>
                  );
                })}
              </ul>
            </details>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
