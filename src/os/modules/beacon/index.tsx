"use client";

import { useCallback, useEffect, useState } from "react";
import type { BeaconSnapshot } from "./types";

export function BeaconView() {
  const [data, setData] = useState<BeaconSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/os/beacon", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData((await res.json()) as BeaconSnapshot);
    } catch (err) {
      setError(err instanceof Error ? err.message : "fetch failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <section className="flex flex-col gap-4" aria-label="Beacon">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="m-0 text-base text-[var(--pd-lime)]" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
            Beacon
          </p>
          <p className="mt-1 m-0 text-sm text-[var(--pd-mist)]">Known hosts → upstream / listener health</p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="min-h-11 rounded-lg border border-white/15 px-4 text-sm font-semibold text-[var(--pd-paper)] disabled:opacity-50"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </header>
      {error ? <p className="m-0 text-sm text-[var(--pd-danger)]">{error}</p> : null}
      {data ? <p className="m-0 font-mono text-xs text-[var(--pd-mist)]">at {data.at}</p> : null}
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {data?.rows.map((r) => (
          <li
            key={r.id}
            className="flex min-h-11 items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/55 px-3 py-3"
          >
            <div className="min-w-0">
              <p className="m-0 text-sm text-[var(--pd-paper)]">{r.label}</p>
              <p className="mt-0.5 m-0 truncate font-mono text-xs text-[var(--pd-mist)]">
                {r.detail ?? r.kind}
                {r.ms != null ? ` · ${r.ms}ms` : ""}
              </p>
            </div>
            <span
              className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
              style={{ color: r.ok ? "var(--pd-lime)" : "var(--pd-danger)" }}
            >
              {r.ok ? "UP" : "DOWN"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
