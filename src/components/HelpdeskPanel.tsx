"use client";

import { useCallback, useEffect, useState } from "react";
import { AUTH_CONFIG } from "@/lib/config";
import { ensureFreshToken } from "@/lib/auth";

type Category = { id: string; label: string; crewRole: string };
type Ticket = {
  id: string;
  title: string;
  category: string;
  body: string;
  crewRole: string;
  status: string;
  createdAt: string;
  createdBy: string;
};

type Props = {
  categories: Category[];
  onTicketCreated?: () => void;
};

export function HelpdeskPanel({ categories, onTicketCreated }: Props) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]?.id || "");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    const token = await ensureFreshToken(AUTH_CONFIG);
    if (!token) {
      setError("Session expired");
      return;
    }
    const res = await fetch("/api/helpdesk", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) {
      const j = (await res.json().catch(() => null)) as { message?: string } | null;
      setError(j?.message || `Load failed (${res.status})`);
      return;
    }
    const data = (await res.json()) as { tickets: Ticket[] };
    setTickets(data.tickets || []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const token = await ensureFreshToken(AUTH_CONFIG);
      if (!token) throw new Error("Session expired");
      const res = await fetch("/api/helpdesk", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, category, body }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(j?.message || `Create failed (${res.status})`);
      }
      setTitle("");
      setBody("");
      onTicketCreated?.();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-label="Helpdesk" className="pd-rise space-y-6">
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block text-sm text-[var(--pd-mist)]">
          Title
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full min-h-11 rounded-md border border-white/10 bg-[var(--pd-steel)] px-3 text-[var(--pd-paper)]"
          />
        </label>
        <label className="block text-sm text-[var(--pd-mist)]">
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full min-h-11 rounded-md border border-white/10 bg-[var(--pd-steel)] px-3 text-[var(--pd-paper)]"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-[var(--pd-mist)]">
          Details
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-md border border-white/10 bg-[var(--pd-steel)] px-3 py-2 text-[var(--pd-paper)]"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="min-h-11 rounded-md bg-[var(--pd-lime)] px-4 font-semibold text-[var(--pd-ink)] disabled:opacity-50"
        >
          {busy ? "Submitting…" : "Open ticket"}
        </button>
      </form>

      {error ? (
        <p className="text-[var(--pd-danger)]" role="alert">
          {error}
        </p>
      ) : null}

      <ul className="m-0 list-none space-y-2 p-0">
        {tickets.length === 0 ? (
          <li className="text-[var(--pd-mist)]">No tickets yet.</li>
        ) : (
          tickets.map((t) => (
            <li
              key={t.id}
              className="rounded-md border border-white/10 bg-[var(--pd-steel)]/80 px-3 py-3"
            >
              <p className="m-0 font-medium text-[var(--pd-paper)]">{t.title}</p>
              <p className="mt-1 m-0 text-xs text-[var(--pd-mist)]">
                {t.category} → {t.crewRole} · {t.status} · {new Date(t.createdAt).toLocaleString()}
              </p>
              {t.body ? <p className="mt-2 m-0 text-sm text-[var(--pd-mist)]">{t.body}</p> : null}
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
