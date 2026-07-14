"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  ActivityLogEntry,
  ActivityLogResponse,
  ActivityQueueResponse,
  ActivityQueueRow,
} from "./types";

const DRAIN_CONFIRM_PHRASE = "DRAIN_TO_MYAGENT";

function LogRow({ entry }: { entry: ActivityLogEntry }) {
  const brief = `${entry.timestamp} ${entry.session} ${entry.action}`;
  const href = `/?osPlace=forge&brief=${encodeURIComponent(brief.slice(0, 200))}`;
  return (
    <article
      className="flex min-h-11 items-center gap-2 rounded-lg border border-white/10 bg-black/55 px-3 py-2 backdrop-blur-md"
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
      <a
        href={href}
        className="min-h-11 shrink-0 inline-flex items-center rounded px-2 py-1 text-[10px] font-semibold text-[var(--pd-lime)]"
      >
        Continue
      </a>
      <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-white/5 text-[var(--pd-mist)]">
        {entry.provider}
      </span>
    </article>
  );
}

function QueueRow({
  entry,
  selected,
  onToggle,
}: {
  entry: ActivityQueueRow;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      className="flex min-h-11 items-center gap-2 rounded-lg border border-amber-400/25 bg-black/55 px-3 py-2 backdrop-blur-md"
      aria-label={`Queued ${entry.timestamp} ${entry.session} ${entry.action}`}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggle}
        aria-label={`Select ${entry.action}`}
        className="min-h-11 min-w-11 shrink-0 accent-[var(--pd-lime)]"
      />
      <time
        className="shrink-0 font-mono text-[10px] leading-tight text-[var(--pd-mist)]"
        dateTime={entry.at}
      >
        {entry.timestamp.replace(/^\d{4}-/, "")}
      </time>
      <span className="min-w-0 flex-1 truncate text-xs text-[var(--pd-paper)]">
        <span className="font-semibold text-amber-300">{entry.session}</span>
        <span className="text-[var(--pd-mist)]"> · </span>
        <span>{entry.action}</span>
        {entry.target ? (
          <>
            <span className="text-[var(--pd-mist)]"> → </span>
            <span className="text-[var(--pd-mist)]">{entry.target}</span>
          </>
        ) : null}
      </span>
      <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-amber-400/15 text-amber-200">
        queued
      </span>
      <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-white/5 text-[var(--pd-mist)]">
        {entry.provider}
      </span>
    </article>
  );
}

export function ActivityLogView() {
  const [data, setData] = useState<ActivityLogResponse | null>(null);
  const [queue, setQueue] = useState<ActivityQueueResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [selectedAts, setSelectedAts] = useState<Set<string>>(() => new Set());
  const [busy, setBusy] = useState<"preview" | "apply" | null>(null);
  const [previewMd, setPreviewMd] = useState<string[] | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [drainFlash, setDrainFlash] = useState<string | null>(null);

  const refresh = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const q = query.trim() ? `q=${encodeURIComponent(query.trim())}&` : "";
      const logParams = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : "";
      const [logRes, queueRes] = await Promise.all([
        fetch(`/api/os/activity-log${logParams}`, { cache: "no-store" }),
        fetch(`/api/os/activity-log?${q}queue=1`, { cache: "no-store" }),
      ]);

      if (!logRes.ok) {
        const body = (await logRes.json().catch(() => ({}))) as { message?: string };
        throw new Error(body.message ?? `HTTP ${logRes.status}`);
      }
      if (!queueRes.ok) {
        const body = (await queueRes.json().catch(() => ({}))) as { message?: string };
        throw new Error(body.message ?? `queue HTTP ${queueRes.status}`);
      }

      setData((await logRes.json()) as ActivityLogResponse);
      setQueue((await queueRes.json()) as ActivityQueueResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "fetch failed");
      setData(null);
      setQueue(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => void refresh(filter), filter ? 300 : 0);
    return () => window.clearTimeout(id);
  }, [filter, refresh]);

  const selectableAts = useMemo(
    () => (queue?.entries ?? []).map((e) => e.at),
    [queue],
  );

  const toggleAt = useCallback((at: string) => {
    setSelectedAts((prev) => {
      const next = new Set(prev);
      if (next.has(at)) next.delete(at);
      else next.add(at);
      return next;
    });
  }, []);

  const selectAllQueue = useCallback(() => {
    setSelectedAts(new Set(selectableAts));
  }, [selectableAts]);

  const clearSelection = useCallback(() => {
    setSelectedAts(new Set());
    setPreviewMd(null);
    setConfirmText("");
  }, []);

  const runDrain = useCallback(
    async (mode: "dry-run" | "apply") => {
      setBusy(mode === "dry-run" ? "preview" : "apply");
      setDrainFlash(null);
      setError(null);
      try {
        const ats = selectedAts.size > 0 ? [...selectedAts] : undefined;
        const res = await fetch("/api/os/activity-log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            op: "drain",
            mode,
            ats,
            confirm: mode === "apply" ? confirmText : undefined,
          }),
        });
        const body = (await res.json().catch(() => ({}))) as {
          message?: string;
          markdownLines?: string[];
          drained?: number;
          selected?: number;
        };
        if (!res.ok) throw new Error(body.message ?? `HTTP ${res.status}`);
        setPreviewMd(body.markdownLines ?? []);
        if (mode === "apply") {
          setDrainFlash(`Drained ${body.drained ?? body.selected ?? 0} row(s) into MyAgent ACTIVITY-LOG`);
          setConfirmText("");
          setSelectedAts(new Set());
          await refresh(filter);
        } else {
          setDrainFlash(`Preview ${body.selected ?? 0} row(s) — confirm phrase required to apply`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "drain failed");
      } finally {
        setBusy(null);
      }
    },
    [confirmText, filter, refresh, selectedAts],
  );

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
            MyAgent ACTIVITY-LOG tail plus local staging queue. Staging POSTs never write MyAgent;
            Lead drain requires an explicit confirm phrase.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter…"
            aria-label="Filter activity log"
            className="min-h-11 min-w-0 flex-1 rounded-lg border border-white/15 bg-black/40 px-3 text-sm text-[var(--pd-paper)] placeholder:text-[var(--pd-mist)] focus:border-[var(--pd-lime)] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => void refresh(filter)}
            disabled={loading}
            className="min-h-11 min-w-11 shrink-0 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-[var(--pd-paper)] transition hover:border-[var(--pd-lime)] hover:text-[var(--pd-lime)] disabled:opacity-50"
          >
            {loading ? "…" : "Refresh"}
          </button>
        </div>
      </header>

      <aside
        className="min-h-11 rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-[var(--pd-paper)]"
        aria-label="Queue drain SOP"
      >
        <p className="m-0 font-semibold text-amber-200">SOP — Lead drain</p>
        <p className="mt-1 m-0 text-[var(--pd-mist)]">
          Preview first, then type <code className="text-[10px] text-amber-100">{DRAIN_CONFIRM_PHRASE}</code>{" "}
          and Apply. Drains serially into MyAgent ACTIVITY-LOG (CONSCIOUS #10).
        </p>
      </aside>

      {error && (
        <p className="m-0 rounded-lg border border-[var(--pd-danger)]/40 bg-[var(--pd-danger)]/10 px-4 py-3 text-sm text-[var(--pd-danger)]">
          {error}
        </p>
      )}
      {drainFlash && (
        <p
          className="m-0 rounded-lg border border-[var(--pd-lime)]/30 bg-[var(--pd-lime)]/10 px-4 py-3 text-sm text-[var(--pd-lime)]"
          aria-live="polite"
        >
          {drainFlash}
        </p>
      )}

      {queue && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="m-0 flex-1 font-mono text-xs text-amber-200/90">
              Queue · {queue.matched} pending
              {queue.query ? ` (filter “${queue.query}”)` : ""}
              {queue.truncated ? " · tail capped" : ""}
              {selectedAts.size > 0 ? ` · ${selectedAts.size} selected` : " · all if none selected"}
            </p>
            <button
              type="button"
              onClick={selectAllQueue}
              className="min-h-11 rounded-lg border border-white/15 bg-white/5 px-3 text-xs font-semibold text-[var(--pd-paper)]"
            >
              Select all
            </button>
            <button
              type="button"
              onClick={clearSelection}
              className="min-h-11 rounded-lg border border-white/15 bg-white/5 px-3 text-xs font-semibold text-[var(--pd-paper)]"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => void runDrain("dry-run")}
              disabled={busy !== null || queue.entries.length === 0}
              className="min-h-11 rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 text-xs font-semibold text-amber-100 disabled:opacity-50"
            >
              {busy === "preview" ? "Preview…" : "Preview drain"}
            </button>
          </div>

          {queue.entries.length === 0 ? (
            <p className="m-0 min-h-11 rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-[var(--pd-mist)]">
              No pending staging rows.
            </p>
          ) : (
            queue.entries.map((entry) => (
              <QueueRow
                key={`${entry.at}-${entry.session}-${entry.action}`}
                entry={entry}
                selected={selectedAts.has(entry.at)}
                onToggle={() => toggleAt(entry.at)}
              />
            ))
          )}

          {previewMd && previewMd.length > 0 ? (
            <div className="flex flex-col gap-2 rounded-lg border border-white/15 bg-black/50 p-3">
              <p className="m-0 text-xs font-semibold text-[var(--pd-paper)]">Markdown preview</p>
              <pre className="m-0 max-h-40 overflow-auto whitespace-pre-wrap break-all font-mono text-[10px] text-[var(--pd-mist)]">
                {previewMd.join("\n")}
              </pre>
              <label className="flex flex-col gap-1 text-xs text-[var(--pd-mist)]">
                Confirm phrase
                <input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={DRAIN_CONFIRM_PHRASE}
                  className="min-h-11 rounded-lg border border-white/15 bg-black/40 px-3 text-sm text-[var(--pd-paper)]"
                  autoComplete="off"
                />
              </label>
              <button
                type="button"
                onClick={() => void runDrain("apply")}
                disabled={busy !== null || confirmText !== DRAIN_CONFIRM_PHRASE}
                className="min-h-11 rounded-lg border border-[var(--pd-danger)]/50 bg-[var(--pd-danger)]/15 px-4 text-sm font-semibold text-[var(--pd-paper)] disabled:opacity-40"
              >
                {busy === "apply" ? "Draining…" : "Apply drain to MyAgent"}
              </button>
            </div>
          ) : null}
        </div>
      )}

      {data && (
        <>
          <p className="m-0 font-mono text-xs text-[var(--pd-mist)]">
            Log · {data.matched} shown
            {data.query ? ` (filter “${data.query}”)` : ` (last ${data.tailLimit})`}
            {data.truncated ? " · response capped" : ""}
            {" · "}
            at {data.at}
          </p>
          <div className="flex flex-col gap-2">
            {data.entries.length === 0 ? (
              <p className="m-0 min-h-11 rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-[var(--pd-mist)]">
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
