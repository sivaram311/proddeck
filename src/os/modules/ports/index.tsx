"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { PortRow, PortsSnapshot, PortReserveEnv } from "./types";
import {
  buildPortReserveJob,
  flashLabel,
  requestPortReserve,
  type ReserveFlash,
} from "./requestReserve";
import { buildPortStopJob, requestPortStop } from "./requestStop";

function rowKeyOf(r: PortRow): string {
  return `row-${r.port}-${r.appId}`;
}

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
  const [selected, setSelected] = useState<Set<string>>(() => new Set());

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

  const selectedRows = useMemo(
    () => rows.filter((r) => selected.has(rowKeyOf(r))),
    [rows, selected],
  );

  const toggleSelected = useCallback((key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const toggleSelectAllVisible = useCallback(() => {
    setSelected((prev) => {
      const visibleKeys = rows.map(rowKeyOf);
      const allOn = visibleKeys.length > 0 && visibleKeys.every((k) => prev.has(k));
      if (allOn) {
        const next = new Set(prev);
        for (const k of visibleKeys) next.delete(k);
        return next;
      }
      const next = new Set(prev);
      for (const k of visibleKeys) next.add(k);
      return next;
    });
  }, [rows]);

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

  const runStop = useCallback(
    async (
      key: string,
      input: { port: number; appId: string; env: string; notes?: string },
    ) => {
      setBusyKey(key);
      try {
        const job = buildPortStopJob(input);
        const result = await requestPortStop(job);
        setFlash(result);
      } finally {
        setBusyKey(null);
      }
    },
    [],
  );

  const stopInputFromRow = useCallback((r: PortRow) => {
    return {
      port: r.port,
      appId: r.appId === "(unknown)" ? "" : r.appId,
      env: r.env,
      notes: r.notes,
    };
  }, []);

  const onRowReserve = useCallback(
    (r: PortRow) => {
      void runReserve(rowKeyOf(r), stopInputFromRow(r));
    },
    [runReserve, stopInputFromRow],
  );

  const onRowStop = useCallback(
    (r: PortRow) => {
      void runStop(`stop-${rowKeyOf(r)}`, stopInputFromRow(r));
    },
    [runStop, stopInputFromRow],
  );

  const onStopSelected = useCallback(async () => {
    if (selectedRows.length === 0) return;
    setBusyKey("stop-selected");
    try {
      let worst: ReserveFlash = "queued";
      for (const r of selectedRows) {
        const job = buildPortStopJob(stopInputFromRow(r));
        const result = await requestPortStop(job);
        if (result === "soft-fail") worst = "soft-fail";
        else if (result === "copied" && worst === "queued") worst = "copied";
      }
      setFlash(worst);
    } finally {
      setBusyKey(null);
    }
  }, [selectedRows, stopInputFromRow]);

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
  const allVisibleSelected =
    rows.length > 0 && rows.every((r) => selected.has(rowKeyOf(r)));
  const busy = busyKey !== null;

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
            MyAgent registry vs live listeners — reserve before bind; request stop only
            (no kill).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void onStopSelected()}
            disabled={busy || selectedRows.length === 0}
            className="min-h-11 rounded-lg border border-white/15 bg-white/5 px-4 text-sm font-semibold text-[var(--pd-paper)] disabled:opacity-50"
          >
            {busyKey === "stop-selected"
              ? "Requesting…"
              : `Request stop selected (${selectedRows.length})`}
          </button>
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={loading}
            className="min-h-11 rounded-lg border border-white/15 bg-white/5 px-4 text-sm font-semibold text-[var(--pd-paper)] disabled:opacity-50"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
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

      <div className="flex items-center gap-2">
        <label className="flex min-h-11 items-center gap-2 text-sm text-[var(--pd-mist)]">
          <input
            type="checkbox"
            checked={allVisibleSelected}
            onChange={toggleSelectAllVisible}
            disabled={rows.length === 0}
            aria-label="Select all visible ports"
          />
          Select all visible
        </label>
      </div>

      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {rows.map((r) => {
          const rowKey = rowKeyOf(r);
          const reserveBusy = busyKey === rowKey;
          const stopBusy = busyKey === `stop-${rowKey}`;
          const isSelected = selected.has(rowKey);
          return (
            <li
              key={`${r.port}-${r.appId}-${r.mismatch}`}
              className="flex min-h-11 flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/55 px-3 py-3 backdrop-blur-md"
            >
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelected(rowKey)}
                  className="mt-1"
                  aria-label={`Select port ${r.port} ${r.appId}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="m-0 font-mono text-sm text-[var(--pd-paper)]">
                    :{r.port}{" "}
                    <span className="text-[var(--pd-mist)]">· {r.appId}</span>
                  </p>
                  <p className="mt-0.5 m-0 truncate text-xs text-[var(--pd-mist)]">
                    {r.env}
                    {r.notes ? ` · ${r.notes}` : ""}
                    {r.listening ? " · listening" : ""}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <MismatchBadge kind={r.mismatch} />
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onRowReserve(r)}
                  className="min-h-11 rounded-md border border-white/15 bg-white/5 px-3 text-sm font-semibold text-[var(--pd-paper)] disabled:opacity-50"
                >
                  {reserveBusy ? "Requesting…" : "Request reserve"}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onRowStop(r)}
                  className="min-h-11 rounded-md border border-white/15 bg-white/5 px-3 text-sm font-semibold text-[var(--pd-paper)] disabled:opacity-50"
                >
                  {stopBusy ? "Requesting…" : "Request stop"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
