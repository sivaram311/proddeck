"use client";

import { useCallback, useEffect, useState } from "react";
import type { ActivityLogEntry, ActivityLogResponse } from "./types";

function LogRow({ entry }: { entry: ActivityLogEntry }) {
  return (
    <article
      className="flex min-h-[44px] items-center gap-2 rounded-lg border border-white/10 bg-black/55 px-3 py-2 backdrop-blur-md"
      aria-label={`${entry.timestamp} ${entry.session} ${entry.action}`}
    >
      <time
        className="shrink-0 font-mono text-[10px] leading-tight text-[var(--pd-mist)]"
        dateTime={entry.timestamp}
      >
        {entry.timestamp.replace(/^\d{4}-/, "")}
      </time>
      <span className="min-w-0 flex-1 truncate text-xs text-[var(--pd-paper)]">
        <span className="font-semibold text-[var(--pd-lime)]">{entry.session}</span>
        <span className="text-[var(--pd-mist)]"> · </span>
        <span>{entry.action}</span>
        {entry.redacted && (
          <span className="ml-1 text-[10px] uppercase tracking-wide text-amber-300">redacted</span>
        )}
      </span>
      <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-white/5 text-[var(--pd-mist)]">
        {entry.provider}
      </span>
    </article>
  );
}

export function ActivityLogView() {
  const [data, setData] = useState<ActivityLogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const refresh = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : "";
      const res = await fetch(`/api/os/activity-log${params}`, { cache: "no-store" });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(body.message ?? `HTTP ${res.status}`);
      }
      setData((await res.json()) as ActivityLogResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "fetch failed");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => void refresh(filter), filter ? 300 : 0);
    return () => window.clearTimeout(id);
  }, [filter, refresh]);

  return (
    <section className="flex flex-col gap-3" aria-label="Activity Log">
      <header className="flex flex-col gap-3">
        <div>
          <p
            className="m-0 text-base text-[var(--pd-lime)]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          >
            Activity Log
          </p>
          <p className="mt-1 m-0 text-sm text-[var(--pd-mist)]">
            Read-only tail of MyAgent ACTIVITY-LOG — filter by provider, session, or action.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter…"
            aria-label="Filter activity log"
            className="min-h-[44px] min-w-0 flex-1 rounded-lg border border-white/15 bg-black/40 px-3 text-sm text-[var(--pd-paper)] placeholder:text-[var(--pd-mist)] focus:border-[var(--pd-lime)] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => void refresh(filter)}
            disabled={loading}
            className="min-h-[44px] min-w-[44px] shrink-0 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-[var(--pd-paper)] transition hover:border-[var(--pd-lime)] hover:text-[var(--pd-lime)] disabled:opacity-50"
          >
            {loading ? "…" : "Refresh"}
          </button>
        </div>
      </header>

      {error && (
        <p className="m-0 rounded-lg border border-[var(--pd-danger)]/40 bg-[var(--pd-danger)]/10 px-4 py-3 text-sm text-[var(--pd-danger)]">
          {error}
        </p>
      )}

      {data && (
        <>
          <p className="m-0 font-mono text-xs text-[var(--pd-mist)]">
            {data.matched} shown
            {data.query ? ` (filter “${data.query}”)` : ` (last ${data.tailLimit})`}
            {data.truncated ? " · response capped" : ""}
            {" · "}
            at {data.at}
          </p>
          <div className="flex flex-col gap-2">
            {data.entries.length === 0 ? (
              <p className="m-0 rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-[var(--pd-mist)]">
                No matching entries in the current tail.
              </p>
            ) : (
              data.entries.map((entry) => (
                <LogRow key={`${entry.timestamp}-${entry.session}-${entry.action}`} entry={entry} />
              ))
            )}
          </div>
        </>
      )}
    </section>
  );
}
