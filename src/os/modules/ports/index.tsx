"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AUTH_CONFIG } from "@/lib/config";
import { ensureFreshToken } from "@/lib/auth";
import type { PortRow, PortsResponse } from "./types";

function MismatchBadge({ row }: { row: PortRow }) {
  if (row.mismatch === "not-listening") {
    return (
      <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-[var(--pd-danger)]/20 text-[var(--pd-danger)]">
        not listening
      </span>
    );
  }
  if (row.listening && row.status === "legacy") {
    return (
      <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-amber-500/20 text-amber-300">
        legacy live
      </span>
    );
  }
  if (row.listening) {
    return (
      <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-[var(--pd-lime)]/15 text-[var(--pd-lime)]">
        live
      </span>
    );
  }
  return null;
}

function UnknownBadge() {
  return (
    <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-[var(--pd-danger)]/20 text-[var(--pd-danger)]">
      unknown
    </span>
  );
}

export function PortsView() {
  const [data, setData] = useState<PortsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [query, setQuery] = useState("");
  const [envFilter, setEnvFilter] = useState("all");
  const [mismatchesOnly, setMismatchesOnly] = useState(false);

  const load = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const token = await ensureFreshToken(AUTH_CONFIG);
      if (!token) {
        setError("Session expired");
        setData(null);
        return;
      }
      const res = await fetch("/api/os/ports", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(j?.message || `Load failed (${res.status})`);
      }
      setData((await res.json()) as PortsResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
      setData(null);
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const envOptions = useMemo(() => {
    if (!data) return ["all"];
    const envs = new Set(data.reserved.map((r) => r.env));
    return ["all", ...Array.from(envs).sort()];
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return data.reserved.filter((row) => {
      if (mismatchesOnly && row.mismatch === "none") return false;
      if (envFilter !== "all" && row.env !== envFilter) return false;
      if (!q) return true;
      const hay = `${row.port} ${row.appId} ${row.env} ${row.status} ${row.notes ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [data, query, envFilter, mismatchesOnly]);

  const mismatchCount = useMemo(() => {
    if (!data) return 0;
    const reservedMiss = data.reserved.filter((r) => r.mismatch === "not-listening").length;
    return reservedMiss + data.unknownListeners.length;
  }, [data]);

  return (
    <section
      className="rounded-lg border border-white/10 bg-black/55 p-3 backdrop-blur-md"
      aria-label="Ports"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p
            className="m-0 text-sm text-[var(--pd-lime)]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          >
            Ports
          </p>
          <p className="mt-1 m-0 text-xs text-[var(--pd-mist)]">
            MyAgent registry vs live listeners — reserve before bind.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={busy}
          className="shrink-0 min-h-11 rounded-md border border-white/10 px-3 text-xs text-[var(--pd-paper)] hover:border-[var(--pd-lime)]/40 disabled:opacity-50"
        >
          {busy ? "…" : "Refresh"}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search port, app, notes…"
          aria-label="Search ports"
          className="min-h-11 flex-1 min-w-[140px] rounded-md border border-white/10 bg-[var(--pd-steel)] px-3 text-sm text-[var(--pd-paper)] placeholder:text-[var(--pd-mist)]"
        />
        <select
          value={envFilter}
          onChange={(e) => setEnvFilter(e.target.value)}
          aria-label="Filter by environment"
          className="min-h-11 rounded-md border border-white/10 bg-[var(--pd-steel)] px-2 text-sm text-[var(--pd-paper)]"
        >
          {envOptions.map((env) => (
            <option key={env} value={env}>
              {env === "all" ? "All envs" : env}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setMismatchesOnly((v) => !v)}
          className={`min-h-11 rounded-md px-3 text-xs font-semibold ${
            mismatchesOnly
              ? "bg-[var(--pd-lime)] text-[var(--pd-ink)]"
              : "border border-white/10 text-[var(--pd-mist)]"
          }`}
        >
          Mismatches
        </button>
      </div>

      {error ? (
        <p className="mt-3 m-0 text-sm text-[var(--pd-danger)]">{error}</p>
      ) : null}

      {data ? (
        <>
          <p className="mt-2 m-0 font-mono text-[10px] text-[var(--pd-mist)]">
            source:{data.source}
            {data.registryUpdated ? ` · updated ${data.registryUpdated}` : ""}
            {data.listenerScan !== "ok" ? ` · scan:${data.listenerScan}` : ""}
            {mismatchCount > 0 ? (
              <span className="text-[var(--pd-danger)]"> · {mismatchCount} mismatch</span>
            ) : (
              <span className="text-[var(--pd-lime)]"> · aligned</span>
            )}
          </p>

          <ul className="mt-2 m-0 list-none space-y-0 p-0" aria-label="Reserved ports">
            {filtered.length === 0 ? (
              <li className="min-h-11 flex items-center text-sm text-[var(--pd-mist)]">
                No rows match filter.
              </li>
            ) : (
              filtered.map((row) => (
                <li
                  key={row.port}
                  className="flex min-h-11 items-center gap-2 border-b border-white/5 py-1 last:border-0"
                >
                  <span className="w-12 shrink-0 font-mono text-sm font-semibold text-[var(--pd-paper)]">
                    {row.port}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-[var(--pd-paper)]">
                    {row.appId}
                  </span>
                  <span className="hidden shrink-0 text-[10px] uppercase text-[var(--pd-mist)] sm:inline">
                    {row.env}
                  </span>
                  <MismatchBadge row={row} />
                </li>
              ))
            )}
          </ul>

          {data.unknownListeners.length > 0 ? (
            <div className="mt-3 border-t border-white/10 pt-2">
              <p className="m-0 text-xs font-semibold text-[var(--pd-danger)]">
                Unknown listeners ({data.unknownListeners.length})
              </p>
              <ul className="mt-1 m-0 list-none space-y-0 p-0">
                {data.unknownListeners.map((port) => (
                  <li
                    key={port}
                    className="flex min-h-11 items-center gap-2 border-b border-white/5 py-1 last:border-0"
                  >
                    <span className="w-12 shrink-0 font-mono text-sm font-semibold text-[var(--pd-paper)]">
                      {port}
                    </span>
                    <span className="flex-1 text-sm text-[var(--pd-mist)]">unregistered</span>
                    <UnknownBadge />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {data.listenerNote ? (
            <p className="mt-2 m-0 text-[10px] text-[var(--pd-mist)]">{data.listenerNote}</p>
          ) : null}
        </>
      ) : busy ? (
        <p className="mt-3 m-0 text-sm text-[var(--pd-mist)]">Loading registry…</p>
      ) : null}
    </section>
  );
}
