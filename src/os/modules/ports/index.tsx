"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { PortRow, PortsSnapshot, PortReserveEnv } from "./types";
import {
  buildPortReserveJob,
  flashLabel,
  requestPortReserve,
  type ReserveFlash,
} from "./requestReserve";

function MismatchBadge({ kind }: { kind: PortRow["mismatch"] }) {
  if (kind === "ok") {
    return (
      <span className="rounded-full px-2 py-1 text-xs font-semibold text-[var(--pd-lime)]">
        OK
      </span>
    );
  }
  if (kind === "reserved-not-listening") {
    return (
      <span className="rounded-full px-2 py-1 text-xs font-semibold text-[var(--pd-mist)]">
        reserved · down
      </span>
    );
  }
  return (
    <span className="rounded-full px-2 py-1 text-xs font-semibold text-[var(--pd-danger)]">
      unknown listen
    </span>
  );
}

export function PortsView() {
  const [data, setData] = useState<PortsSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [mismatchesOnly, setMismatchesOnly] = useState(false);
  const [flash, setFlash] = useState<ReserveFlash>("idle");
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const [customPort, setCustomPort] = useState("");
  const [customAppId, setCustomAppId] = useState("");
  const [customEnv, setCustomEnv] = useState<PortReserveEnv>("dev");
  const [customNotes, setCustomNotes] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/os/ports", { cache: "no-store" });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(body.message ?? `HTTP ${res.status}`);
      }
      setData((await res.json()) as PortsSnapshot);
    } catch (err) {
      setError(err instanceof Error ? err.message : "fetch failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (flash === "idle") return;
    const t = window.setTimeout(() => setFlash("idle"), 2500);
    return () => window.clearTimeout(t);
  }, [flash]);

  const rows = useMemo(() => {
    if (!data) return [];
    const q = filter.trim().toLowerCase();
    return data.rows.filter((r) => {
      if (mismatchesOnly && r.mismatch === "ok") return false;
      if (!q) return true;
      return (
        String(r.port).includes(q) ||
        r.appId.toLowerCase().includes(q) ||
        (r.env ?? "").toLowerCase().includes(q)
      );
    });
  }, [data, filter, mismatchesOnly]);

  const runReserve = useCallback(
    async (
      key: string,
      input: { port: number; appId: string; env: string; notes?: string },
    ) => {
      setBusyKey(key);
      try {
        const job = buildPortReserveJob(input);
        const result = await requestPortReserve(job);
        setFlash(result);
      } finally {
        setBusyKey(null);
      }
    },
    [],
  );

  const onRowReserve = useCallback(
    (r: PortRow) => {
      void runReserve(`row-${r.port}-${r.appId}`, {
        port: r.port,
        appId: r.appId === "(unknown)" ? "" : r.appId,
        env: r.env,
        notes: r.notes,
      });
    },
    [runReserve],
  );

  const onCustomReserve = useCallback(() => {
    const port = Number.parseInt(customPort.trim(), 10);
    if (!Number.isFinite(port) || port < 1 || port > 65535) {
      setFlash("soft-fail");
      return;
    }
    void runReserve("custom", {
      port,
      appId: customAppId,
      env: customEnv,
      notes: customNotes || undefined,
    });
  }, [customPort, customAppId, customEnv, customNotes, runReserve]);

  const statusText = flashLabel(flash);

  return (
    <section className="flex flex-col gap-4" aria-label="Ports">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p
            className="m-0 text-base text-[var(--pd-lime)]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          >
            Ports
          </p>
          <p className="mt-1 m-0 text-sm text-[var(--pd-mist)]">
            MyAgent registry vs live listeners — reserve before bind.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="min-h-11 rounded-lg border border-white/15 bg-white/5 px-4 text-sm font-semibold text-[var(--pd-paper)] disabled:opacity-50"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </header>

      {statusText ? (
        <p
          className="m-0 rounded-lg border border-white/15 bg-black/45 px-4 py-3 text-sm text-[var(--pd-lime)]"
          aria-live="polite"
        >
          {statusText}
        </p>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter port / app / env"
          className="min-h-11 flex-1 rounded-md border border-white/15 bg-black/45 px-3 text-sm text-[var(--pd-paper)] outline-none"
          aria-label="Filter ports"
        />
        <button
          type="button"
          onClick={() => setMismatchesOnly((v) => !v)}
          className={`min-h-11 rounded-md px-3 text-sm ${
            mismatchesOnly
              ? "bg-[var(--pd-lime)] font-semibold text-[var(--pd-ink)]"
              : "border border-white/15 text-[var(--pd-mist)]"
          }`}
        >
          Mismatches
        </button>
      </div>

      <form
        className="flex flex-col gap-3 rounded-lg border border-white/10 bg-black/55 p-4 backdrop-blur-md"
        onSubmit={(e) => {
          e.preventDefault();
          onCustomReserve();
        }}
        aria-label="Request reserve custom port"
      >
        <p className="m-0 text-xs uppercase tracking-wide text-[var(--pd-mist)]">
          Request reserve (custom)
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm text-[var(--pd-mist)]">
            Port
            <input
              type="number"
              min={1}
              max={65535}
              value={customPort}
              onChange={(e) => setCustomPort(e.target.value)}
              placeholder="3320"
              className="min-h-11 rounded-md border border-white/15 bg-black/45 px-3 text-sm text-[var(--pd-paper)] outline-none"
              aria-label="Custom port"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-[var(--pd-mist)]">
            App ID
            <input
              type="text"
              value={customAppId}
              onChange={(e) => setCustomAppId(e.target.value)}
              placeholder="my-app"
              className="min-h-11 rounded-md border border-white/15 bg-black/45 px-3 text-sm text-[var(--pd-paper)] outline-none"
              aria-label="Custom app ID"
              autoComplete="off"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-[var(--pd-mist)]">
            Env
            <select
              value={customEnv}
              onChange={(e) => setCustomEnv(e.target.value as PortReserveEnv)}
              className="min-h-11 rounded-md border border-white/15 bg-black/45 px-3 text-sm text-[var(--pd-paper)] outline-none"
              aria-label="Custom env"
            >
              <option value="dev">dev</option>
              <option value="preprod">preprod</option>
              <option value="prod">prod</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-[var(--pd-mist)]">
            Notes
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="optional"
              className="min-h-11 rounded-md border border-white/15 bg-black/45 px-3 text-sm text-[var(--pd-paper)] outline-none"
              aria-label="Custom notes"
              autoComplete="off"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={busyKey === "custom" || !customPort.trim()}
          className="min-h-11 rounded-lg border border-white/15 bg-white/5 px-4 text-sm font-semibold text-[var(--pd-paper)] disabled:opacity-50"
        >
          {busyKey === "custom" ? "Requesting…" : "Request reserve"}
        </button>
      </form>

      {error ? (
        <p className="m-0 rounded-lg border border-[var(--pd-danger)]/40 px-4 py-3 text-sm text-[var(--pd-danger)]">
          {error}
        </p>
      ) : null}

      {data ? (
        <p className="m-0 font-mono text-xs text-[var(--pd-mist)]">
          at {data.at} · {data.unknownListening.length} unknown in 3k–6k range
        </p>
      ) : null}

      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {rows.map((r) => {
          const rowKey = `row-${r.port}-${r.appId}`;
          const busy = busyKey === rowKey;
          return (
            <li
              key={`${r.port}-${r.appId}-${r.mismatch}`}
              className="flex min-h-11 flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/55 px-3 py-3 backdrop-blur-md"
            >
              <div className="min-w-0 flex-1">
                <p className="m-0 font-mono text-sm text-[var(--pd-paper)]">
                  :{r.port}{" "}
                  <span className="text-[var(--pd-mist)]">· {r.appId}</span>
                </p>
                <p className="mt-0.5 m-0 truncate text-xs text-[var(--pd-mist)]">
                  {r.env}
                  {r.notes ? ` · ${r.notes}` : ""}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <MismatchBadge kind={r.mismatch} />
                <button
                  type="button"
                  disabled={busy || busyKey !== null}
                  onClick={() => onRowReserve(r)}
                  className="min-h-11 rounded-md border border-white/15 bg-white/5 px-3 text-sm font-semibold text-[var(--pd-paper)] disabled:opacity-50"
                >
                  {busy ? "Requesting…" : "Request reserve"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
