"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Entry = { name: string; path: string; rel: string; kind: "dir" | "file" };

type ListResponse = {
  ok?: boolean;
  root?: string;
  rel?: string;
  entries?: Entry[];
  error?: string;
  message?: string;
};

const HDRIVE_BASE =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_HDRIVE_URL || "https://hdrive.delena.buzz"
    : "https://hdrive.delena.buzz";

const CONSCIOUS_DELETE_COPY =
  "Blocked by CONSCIOUS #1 — no deletion without explicit confirmation of the exact target. ProdDeck FileBridge never deletes on H:. Use the FileBridge app only after a typed confirm of the exact path.";

function toHdriveUrl(rel: string): string {
  const trimmed = rel.replace(/^\\+/, "").replace(/\\/g, "/");
  if (!trimmed) return `${HDRIVE_BASE}/releases/`;
  return `${HDRIVE_BASE}/releases/${trimmed}${trimmed.endsWith("/") ? "" : "/"}`;
}

function parentRel(rel: string): string {
  if (!rel) return "";
  const parts = rel.split("\\").filter(Boolean);
  parts.pop();
  return parts.join("\\");
}

export function FileBridgeView() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [root, setRoot] = useState("H:\\releases");
  const [error, setError] = useState<string | null>(null);
  const [path, setPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState("");
  const [deleteAck, setDeleteAck] = useState<string | null>(null);

  const load = useCallback(async (nextPath?: string) => {
    const target = nextPath !== undefined ? nextPath : path;
    setLoading(true);
    setError(null);
    setDeleteAck(null);
    try {
      const res = await fetch(
        "/api/os/filebridge?path=" + encodeURIComponent(target),
        { cache: "no-store" },
      );
      const body = (await res.json().catch(() => ({}))) as ListResponse;

      if (res.status === 404 && body.error === "drive_missing") {
        setEntries([]);
        setError(
          body.message ||
            "H:\\releases unavailable — use Open H-Drive. Local list needs the RELEASES volume.",
        );
        return;
      }

      if (!res.ok || body.ok === false) {
        setEntries([]);
        setError(
          body.message ||
            (body.error ? `${body.error} (HTTP ${res.status})` : `List failed (HTTP ${res.status})`),
        );
        return;
      }

      setRoot(body.root || "H:\\releases");
      setEntries(body.entries || []);
      if (typeof body.rel === "string") setPath(body.rel);
    } catch (err) {
      setError(
        err instanceof Error
          ? `${err.message} — network error; try Open H-Drive.`
          : "List failed — try Open H-Drive.",
      );
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    void load("");
    // initial mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const crumbs = useMemo(() => {
    if (!path) return [] as string[];
    return path.split("\\").filter(Boolean);
  }, [path]);

  const hdriveHere = toHdriveUrl(path);

  return (
    <section className="flex flex-col gap-4" aria-label="FileBridge">
      <header>
        <p
          className="m-0 text-base text-[var(--pd-lime)]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
        >
          FileBridge · Archive lane
        </p>
        <p className="mt-1 m-0 text-sm text-[var(--pd-mist)]">
          Read-only browse under <code className="text-[var(--pd-lime)]">H:\releases</code>. Opens in
          H-Drive for full browser. Deletes stay blocked (CONSCIOUS).
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <input
          value={path}
          onChange={(e) => setPath(e.target.value.replace(/\//g, "\\"))}
          onKeyDown={(e) => {
            if (e.key === "Enter") void load(path);
          }}
          className="min-h-11 flex-1 rounded-md border border-white/15 bg-black/45 px-3 font-mono text-sm"
          aria-label="Relative path under H:\\releases"
          placeholder="(releases root) e.g. proddeck-0.6.2"
        />
        <button
          type="button"
          onClick={() => void load(path)}
          disabled={loading}
          className="min-h-11 rounded-md border border-white/15 px-3 text-sm disabled:opacity-50"
        >
          {loading ? "Listing…" : "List"}
        </button>
        <button
          type="button"
          onClick={() => void load(parentRel(path))}
          disabled={loading || !path}
          className="min-h-11 rounded-md border border-white/15 px-3 text-sm disabled:opacity-40"
        >
          Up
        </button>
        <a
          href={hdriveHere}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center rounded-md bg-[var(--pd-lime)] px-3 text-sm font-semibold text-[var(--pd-ink)] no-underline"
        >
          Open H-Drive
        </a>
      </div>

      <nav
        className="flex flex-wrap items-center gap-1 font-mono text-xs text-[var(--pd-mist)]"
        aria-label="Path under releases"
      >
        <button
          type="button"
          className="min-h-11 rounded-md border border-transparent px-2 text-[var(--pd-lime)] hover:border-white/15"
          onClick={() => void load("")}
        >
          H:\releases
        </button>
        {crumbs.map((part, i) => {
          const rel = crumbs.slice(0, i + 1).join("\\");
          return (
            <span key={rel} className="inline-flex items-center gap-1">
              <span aria-hidden>\</span>
              <button
                type="button"
                className="min-h-11 rounded-md border border-transparent px-2 text-[var(--pd-paper)] hover:border-white/15"
                onClick={() => void load(rel)}
              >
                {part}
              </button>
            </span>
          );
        })}
      </nav>

      <p className="m-0 break-all font-mono text-[10px] text-[var(--pd-mist)]">{root}</p>

      {error ? (
        <p
          className="m-0 rounded-md border border-[var(--pd-danger)]/30 bg-black/40 px-3 py-2 text-sm text-[var(--pd-paper)]"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {!loading && !error && entries.length === 0 ? (
        <p className="m-0 text-sm text-[var(--pd-mist)]">Empty folder — or use Open H-Drive.</p>
      ) : null}

      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {entries.map((e) => (
          <li
            key={e.path}
            className="flex min-h-11 flex-wrap items-center justify-between gap-2 rounded-md border border-white/10 px-3"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span className="shrink-0 font-mono text-[10px] uppercase text-[var(--pd-mist)]">
                {e.kind === "dir" ? "dir" : "file"}
              </span>
              {e.kind === "dir" ? (
                <button
                  type="button"
                  className="truncate text-left font-mono text-xs text-[var(--pd-lime)]"
                  onClick={() => void load(e.rel)}
                >
                  {e.name}
                </button>
              ) : (
                <span className="truncate font-mono text-xs text-[var(--pd-paper)]">{e.name}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={toHdriveUrl(e.rel)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[var(--pd-lime)] no-underline"
              >
                H-Drive
              </a>
              <button
                type="button"
                className="text-xs text-[var(--pd-mist)]"
                onClick={() => void navigator.clipboard.writeText(e.path)}
              >
                Copy path
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="rounded-lg border border-[var(--pd-danger)]/30 bg-black/40 p-3">
        <p className="m-0 text-xs text-[var(--pd-mist)]">
          Delete · blocked — CONSCIOUS #1. Typing DELETE only acknowledges policy; no API delete IO.
        </p>
        <input
          value={confirmDelete}
          onChange={(e) => setConfirmDelete(e.target.value)}
          className="mt-2 min-h-11 w-full rounded-md border border-white/15 bg-black/45 px-3 text-sm"
          placeholder="DELETE"
          aria-label="Type DELETE to acknowledge blocked policy"
        />
        <button
          type="button"
          disabled={confirmDelete !== "DELETE"}
          className="mt-2 min-h-11 w-full rounded-md border border-[var(--pd-danger)]/40 text-sm text-[var(--pd-danger)] disabled:opacity-40"
          onClick={() => {
            setDeleteAck(CONSCIOUS_DELETE_COPY);
            setConfirmDelete("");
          }}
        >
          Request delete (blocked)
        </button>
        {deleteAck ? (
          <p className="mt-2 mb-0 text-xs text-[var(--pd-paper)]" role="status">
            {deleteAck}
          </p>
        ) : null}
      </div>
    </section>
  );
}
