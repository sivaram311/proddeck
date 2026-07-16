"use client";

import { useCallback, useEffect, useState } from "react";

type WatchCard = {
  id: string;
  title: string;
  blurb: string;
  href?: string;
  tone: "ok" | "warn" | "info";
};

/**
 * D2 — Watch as real ops: aggregate Pulse tip + Yard fabric events + Dispatch return.
 * No embedded AgentVerse chat.
 */
export function WatchOpsView() {
  const [cards, setCards] = useState<WatchCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    const next: WatchCard[] = [];
    try {
      const [pulseRes, eventsRes, flagsRes] = await Promise.all([
        fetch("/api/os/pulse", { cache: "no-store" }),
        fetch("/api/os/events?limit=8", { cache: "no-store" }),
        fetch("/api/os/flags", { cache: "no-store" }),
      ]);

      if (pulseRes.ok) {
        const pulse = (await pulseRes.json()) as {
          cssOk?: boolean;
          postgresOk?: boolean;
          drives?: { letter: string; ok: boolean }[];
        };
        const driveBad = (pulse.drives ?? []).filter((d) => !d.ok).map((d) => d.letter);
        next.push({
          id: "pulse",
          title: "Pulse",
          blurb:
            driveBad.length > 0
              ? `Drive attention: ${driveBad.join(", ")}`
              : `CSS ${pulse.cssOk ? "up" : "down"} · PG ${pulse.postgresOk ? "up" : "down"}`,
          href: "/?osPlace=control-tower",
          tone: driveBad.length || !pulse.cssOk ? "warn" : "ok",
        });
      }

      if (eventsRes.ok) {
        const body = (await eventsRes.json()) as {
          events?: { type?: string; at?: string; payload?: { packId?: string } }[];
        };
        const fabric = (body.events ?? []).filter((e) =>
          String(e.type ?? "").startsWith("crew.fabric"),
        );
        next.push({
          id: "fabric",
          title: "Crew Fabric",
          blurb:
            fabric.length > 0
              ? `Recent fabric events: ${fabric.length} (latest ${fabric[0]?.type ?? "—"})`
              : "No recent fabric events — hire from Yard",
          href: "/?osPlace=yard",
          tone: "info",
        });
      }

      if (flagsRes.ok) {
        const flags = (await flagsRes.json()) as {
          flags?: Record<string, boolean>;
        };
        const on = Object.entries(flags.flags ?? {})
          .filter(([, v]) => v)
          .map(([k]) => k);
        next.push({
          id: "flags",
          title: "Hard-out flags",
          blurb:
            on.length === 0
              ? "All OS_* hard outs OFF (safe default)"
              : `Enabled: ${on.join(", ")}`,
          tone: on.length ? "warn" : "ok",
        });
      }

      next.push({
        id: "dispatch",
        title: "Dispatch leftovers",
        blurb: "Send blocked work to AgentVerse Session Desk — peers, not clones.",
        href: "/?osPlace=forge",
        tone: "info",
      });

      setCards(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "watch fetch failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <section className="flex flex-col gap-4" aria-label="Watch ops">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p
            className="m-0 text-base text-[var(--pd-lime)]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          >
            Watch · Ops
          </p>
          <p className="mt-1 m-0 text-sm text-[var(--pd-mist)]">
            Health, fabric, flags — deep-link out; no embedded office chat.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="min-h-11 rounded-lg border border-white/15 px-4 text-sm font-semibold disabled:opacity-50"
        >
          {loading ? "Scanning…" : "Refresh"}
        </button>
      </header>
      {error ? (
        <p className="m-0 text-sm text-[var(--pd-danger)]" role="alert">
          {error}
        </p>
      ) : null}
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {cards.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-white/10 bg-black/55 px-3 py-3"
          >
            <p className="m-0 text-sm font-semibold text-[var(--pd-paper)]">{c.title}</p>
            <p
              className={`mt-1 m-0 text-xs ${
                c.tone === "warn"
                  ? "text-[var(--pd-danger)]"
                  : c.tone === "ok"
                    ? "text-[var(--pd-lime)]"
                    : "text-[var(--pd-mist)]"
              }`}
            >
              {c.blurb}
            </p>
            {c.href ? (
              <a
                href={c.href}
                className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--pd-lime)]"
              >
                Open place →
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
