"use client";

import { useCallback, useEffect, useState } from "react";
import { APPLIANCES, type ApplianceId } from "./catalog";

type StatusMap = Partial<Record<ApplianceId, boolean>>;

async function probePort(port: number): Promise<boolean> {
  try {
    const res = await fetch(`/api/os/beacon`, { cache: "no-store" });
    if (!res.ok) return false;
    const body = (await res.json()) as { rows?: { id: string; ok: boolean; port?: number }[] };
    // fallthrough: use dedicated lightweight HEAD via open origin when possible
    void body;
  } catch {
    /* ignore */
  }
  try {
    await fetch(`http://127.0.0.1:${port}/`, { mode: "no-cors", cache: "no-store" });
    return true;
  } catch {
    return false;
  }
}

export function AppliancesView() {
  const [status, setStatus] = useState<StatusMap>({});
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const next: StatusMap = {};
    await Promise.all(
      APPLIANCES.map(async (a) => {
        if (a.probeUrl) {
          try {
            const res = await fetch(a.probeUrl, { cache: "no-store", mode: "cors" });
            next[a.id] = res.ok;
          } catch {
            next[a.id] = false;
          }
        } else if (a.probePort) {
          next[a.id] = await probePort(a.probePort);
        }
      }),
    );
    setStatus(next);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <section className="flex flex-col gap-4" aria-label="Appliances">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="m-0 text-base text-[var(--pd-lime)]" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
            Appliances
          </p>
          <p className="mt-1 m-0 text-sm text-[var(--pd-mist)]">Fleet tiles — open production surfaces</p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="min-h-11 rounded-lg border border-white/15 px-4 text-sm font-semibold disabled:opacity-50"
        >
          {loading ? "Probing…" : "Refresh"}
        </button>
      </header>
      <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2">
        {APPLIANCES.map((a) => {
          const ok = status[a.id];
          return (
            <li key={a.id} className="rounded-lg border border-white/10 bg-black/55 p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="m-0 text-sm font-semibold text-[var(--pd-paper)]">{a.label}</p>
                  <p className="mt-1 m-0 text-xs text-[var(--pd-mist)]">{a.blurb}</p>
                </div>
                <span className="text-xs font-semibold" style={{ color: ok ? "var(--pd-lime)" : "var(--pd-mist)" }}>
                  {ok == null ? "—" : ok ? "UP" : "?"}
                </span>
              </div>
              <a
                href={
                  a.returnPlace
                    ? `${a.openUrl.replace(/\/$/, "")}/?return=${encodeURIComponent(
                        typeof window !== "undefined"
                          ? `${window.location.origin}/?osPlace=${a.returnPlace}`
                          : `https://home.delena.buzz/?osPlace=${a.returnPlace}`,
                      )}`
                    : a.openUrl
                }
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex min-h-11 items-center justify-center rounded-md bg-[var(--pd-lime)] px-3 text-sm font-semibold text-[var(--pd-ink)]"
              >
                {a.id === "stack-pilot" ? "Open + return" : "Open"}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
