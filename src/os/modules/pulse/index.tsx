"use client";

import { useCallback, useEffect, useState } from "react";
import type { HealthSnapshot } from "../../types";

const DRIVE_ROLES: Record<string, string> = {
  E: "DEV",
  F: "PREPROD",
  G: "PROD",
  H: "RELEASES",
};

function formatUptime(sec?: number): string {
  if (sec == null) return "—";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatGb(value?: number): string {
  if (value == null) return "—";
  return `${value} GB`;
}

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span
      className="inline-block h-3 w-3 shrink-0 rounded-full"
      style={{ backgroundColor: ok ? "var(--pd-lime)" : "var(--pd-danger)" }}
      aria-hidden
    />
  );
}

function DriveCard({ drive }: { drive: NonNullable<HealthSnapshot["drives"]>[number] }) {
  const role = DRIVE_ROLES[drive.letter] ?? drive.letter;
  const pct =
    drive.freeGb != null && drive.totalGb != null && drive.totalGb > 0
      ? Math.round((drive.freeGb / drive.totalGb) * 100)
      : null;

  return (
    <article
      className="rounded-lg border border-white/10 bg-black/55 p-4 backdrop-blur-md"
      aria-label={`Drive ${drive.letter} ${role}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p
            className="m-0 text-lg leading-none"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          >
            {drive.letter}:
          </p>
          <p className="mt-1 m-0 text-xs text-[var(--pd-mist)]">{role}</p>
        </div>
        <StatusDot ok={drive.ok} />
      </div>
      <p className="mt-3 m-0 text-sm text-[var(--pd-paper)]">
        {drive.ok ? (
          <>
            <span className="font-semibold">{formatGb(drive.freeGb)}</span>
            <span className="text-[var(--pd-mist)]"> free</span>
            {drive.totalGb != null && (
              <span className="text-[var(--pd-mist)]"> / {formatGb(drive.totalGb)}</span>
            )}
          </>
        ) : (
          <span className="text-[var(--pd-danger)]">Unavailable</span>
        )}
      </p>
      {pct != null && (
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${pct}%`,
              backgroundColor: pct < 10 ? "var(--pd-danger)" : "var(--pd-lime)",
            }}
          />
        </div>
      )}
    </article>
  );
}

function ServiceCard({
  label,
  detail,
  ok,
}: {
  label: string;
  detail: string;
  ok?: boolean;
}) {
  const up = ok === true;
  return (
    <article
      className="flex min-h-[44px] items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/55 px-4 py-3 backdrop-blur-md"
      aria-label={`${label} ${up ? "up" : ok === false ? "down" : "unknown"}`}
    >
      <div>
        <p className="m-0 text-sm font-semibold text-[var(--pd-paper)]">{label}</p>
        <p className="mt-0.5 m-0 font-mono text-xs text-[var(--pd-mist)]">{detail}</p>
      </div>
      {ok != null ? (
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold"
          style={{
            backgroundColor: up ? "rgba(184,240,0,0.15)" : "rgba(255,92,92,0.15)",
            color: up ? "var(--pd-lime)" : "var(--pd-danger)",
          }}
        >
          {up ? "UP" : "DOWN"}
        </span>
      ) : (
        <span className="text-xs text-[var(--pd-mist)]">—</span>
      )}
    </article>
  );
}

export function PulseView() {
  const [snapshot, setSnapshot] = useState<HealthSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/os/pulse", { cache: "no-store" });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(body.message ?? `HTTP ${res.status}`);
      }
      setSnapshot((await res.json()) as HealthSnapshot);
    } catch (err) {
      setError(err instanceof Error ? err.message : "fetch failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => void refresh(), 30_000);
    return () => window.clearInterval(id);
  }, [refresh]);

  return (
    <section className="flex flex-col gap-4" aria-label="Pulse">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p
            className="m-0 text-base text-[var(--pd-lime)]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          >
            Pulse
          </p>
          <p className="mt-1 m-0 text-sm text-[var(--pd-mist)]">
            Machine health — drives E–H, Postgres, CSS
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="min-h-[44px] min-w-[44px] rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-[var(--pd-paper)] transition hover:border-[var(--pd-lime)] hover:text-[var(--pd-lime)] disabled:opacity-50"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </header>

      {error && (
        <p className="m-0 rounded-lg border border-[var(--pd-danger)]/40 bg-[var(--pd-danger)]/10 px-4 py-3 text-sm text-[var(--pd-danger)]">
          {error}
        </p>
      )}

      {snapshot && (
        <>
          <p className="m-0 font-mono text-xs text-[var(--pd-mist)]">
            at {snapshot.at}
            {snapshot.uptimeSec != null && (
              <>
                {" "}
                · uptime {formatUptime(snapshot.uptimeSec)}
              </>
            )}
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {snapshot.drives?.map((drive) => (
              <DriveCard key={drive.letter} drive={drive} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ServiceCard label="Postgres" detail="127.0.0.1:5432" ok={snapshot.postgresOk} />
            <ServiceCard
              label="CSS"
              detail="127.0.0.1:9000"
              ok={snapshot.cssOk}
            />
          </div>

          {snapshot.notes && snapshot.notes.length > 0 ? (
            <ul className="m-0 list-none space-y-1 p-0 font-mono text-xs text-[var(--pd-mist)]">
              {snapshot.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          ) : null}
        </>
      )}
    </section>
  );
}
