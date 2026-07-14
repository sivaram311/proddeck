"use client";

import { useCallback, useEffect, useState } from "react";
import {
  eventSummary,
  fetchFabricEvents,
  formatEventAt,
  type YardOsEvent,
} from "./fabric-events";

const POLL_MS = 20_000;

type Props = {
  /** Bump after hire so the mirror refreshes immediately. */
  refreshToken?: number;
};

export function FabricEventsTail({ refreshToken = 0 }: Props) {
  const [events, setEvents] = useState<YardOsEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const next = await fetchFabricEvents(30);
    setEvents(next);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => void refresh(), POLL_MS);
    return () => window.clearInterval(id);
  }, [refresh, refreshToken]);

  return (
    <section aria-label="Recent fabric events">
      <div className="flex min-h-11 flex-wrap items-center justify-between gap-2">
        <p
          className="m-0 text-sm text-[var(--pd-paper)]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
        >
          Recent fabric events
        </p>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            void refresh();
          }}
          disabled={loading}
          className="min-h-11 rounded-md border border-white/15 px-3 text-xs font-semibold text-[var(--pd-paper)] disabled:opacity-50"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <p className="mt-1 m-0 text-xs text-[var(--pd-mist)]">
        Soft mirror of <code className="text-[var(--pd-paper)]">crew.fabric.spawned</code> — read-only.
      </p>

      {events.length === 0 ? (
        <p className="mt-2 m-0 min-h-11 rounded-md border border-white/10 bg-black/40 px-3 py-3 text-xs text-[var(--pd-mist)]" role="status">
          {loading ? "Loading events…" : "No recent fabric events yet."}
        </p>
      ) : (
        <ul className="mt-2 m-0 flex list-none flex-col gap-1.5 p-0" aria-live="polite">
          {events.slice(0, 12).map((ev, i) => (
            <li
              key={`${ev.at}-${ev.type}-${i}`}
              className="flex min-h-11 items-center justify-between gap-3 rounded-md border border-white/10 bg-black/40 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="m-0 truncate text-xs font-semibold text-[var(--pd-lime)]">
                  {ev.type.replace(/^crew\.fabric\./, "")}
                </p>
                <p className="mt-0.5 m-0 truncate text-xs text-[var(--pd-mist)]">
                  {eventSummary(ev)}
                  {ev.actor ? ` · ${ev.actor}` : ""}
                  {ev.env ? ` · ${ev.env}` : ""}
                </p>
              </div>
              <time
                className="shrink-0 font-mono text-[10px] text-[var(--pd-mist)]"
                dateTime={ev.at}
              >
                {formatEventAt(ev.at)}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
