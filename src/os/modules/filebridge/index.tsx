"use client";

import { useCallback, useEffect, useState } from "react";

type Entry = { name: string; path: string; kind: "dir" | "file" };

const HDRIVE_BASE = typeof window !== "undefined"
  ? (process.env.NEXT_PUBLIC_HDRIVE_URL || "https://hdrive.delena.buzz")
  : "https://hdrive.delena.buzz";

export function FileBridgeView() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [path, setPath] = useState("releases");
  const [confirmDelete, setConfirmDelete] = useState("");

  const load = useCallback(async () => {
    setError(null);
    try {
      // Prefer local archive-style listing via server if present; else deep-link mode
      const res = await fetch("/api/os/filebridge?path=" + encodeURIComponent(path), { cache: "no-store" });
      if (res.status === 404) {
        setEntries([]);
        setError("Browse API not required — use Open H-Drive. Local list unavailable.");
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = (await res.json()) as { entries: Entry[] };
      setEntries(body.entries || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "list failed");
      setEntries([]);
    }
  }, [path]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className="flex flex-col gap-4" aria-label="FileBridge">
      <header>
        <p className="m-0 text-base text-[var(--pd-lime)]" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
          FileBridge · Archive lane
        </p>
        <p className="mt-1 m-0 text-sm text-[var(--pd-mist)]">
          Scoped H-Drive browse / open. Deletes require typed CONSCIOUS confirm — deferred (use FileBridge app).
        </p>
      </header>
      <div className="flex flex-wrap gap-2">
        <input
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className="min-h-11 flex-1 rounded-md border border-white/15 bg-black/45 px-3 text-sm"
          aria-label="Relative path under H-Drive"
        />
        <button type="button" onClick={() => void load()} className="min-h-11 rounded-md border border-white/15 px-3 text-sm">
          List
        </button>
        <a
          href={HDRIVE_BASE}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center rounded-md bg-[var(--pd-lime)] px-3 text-sm font-semibold text-[var(--pd-ink)]"
        >
          Open H-Drive
        </a>
      </div>
      {error ? <p className="m-0 text-sm text-[var(--pd-mist)]">{error}</p> : null}
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {entries.map((e) => (
          <li key={e.path} className="flex min-h-11 items-center justify-between rounded-md border border-white/10 px-3">
            <span className="font-mono text-xs text-[var(--pd-paper)]">{e.name}</span>
            <button
              type="button"
              className="text-xs text-[var(--pd-lime)]"
              onClick={() => void navigator.clipboard.writeText(e.path)}
            >
              Copy path
            </button>
          </li>
        ))}
      </ul>
      <div className="rounded-lg border border-[var(--pd-danger)]/30 bg-black/40 p-3">
        <p className="m-0 text-xs text-[var(--pd-mist)]">Delete (deferred) — type DELETE to acknowledge policy</p>
        <input
          value={confirmDelete}
          onChange={(e) => setConfirmDelete(e.target.value)}
          className="mt-2 min-h-11 w-full rounded-md border border-white/15 bg-black/45 px-3 text-sm"
          placeholder="DELETE"
        />
        <button
          type="button"
          disabled={confirmDelete !== "DELETE"}
          className="mt-2 min-h-11 w-full rounded-md border border-[var(--pd-danger)]/40 text-sm text-[var(--pd-danger)] disabled:opacity-40"
          onClick={() => alert("Deletes are not enabled in ProdDeck FileBridge MVP. Use FileBridge app with CONSCIOUS confirm.")}
        >
          Request delete (blocked)
        </button>
      </div>
    </section>
  );
}
